<template>
  <view>
    <uv-picker
      ref="pickerRef"
      :columns="columns"
      keyName="name"
      round="30rpx"
      @confirm="confirm"
      @change="change"
    ></uv-picker>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';
import { appGetPbProvinceCityArea } from '@/api/my';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'confirm']);

const pickerRef = ref(null);
const onClose = () => {
  pickerRef.value.close();
};
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      pickerRef.value.open();
    } else {
      onClose();
    }
  }
);

const columns = [];
const columnsCopy = ref([]);
// 获取省市区
const areaData = [];
const getPbProvinceCityArea = async () => {
  const { result } = await appGetPbProvinceCityArea();
  areaData[0] = getArea(result.pbProvinceCityAreaDtoList, 0);
  areaData[1] = getArea(result.pbProvinceCityAreaDtoList, 1);
  areaData[2] = getArea(result.pbProvinceCityAreaDtoList, 2);
  const column1 = settingColumn('', 0);
  pickerRef.value.setIndexs([0], true);
  const column2 = settingColumn(column1[0].id, 1);
  settingColumn(column2[0].id, 2);
};
getPbProvinceCityArea();

// 获取三类
const getArea = (list, level) => {
  return list.filter((e) => e.level == level);
};

// 获取对应列
const getColumn = (id, level) => {
  return areaData[level].filter((e) => e.level == level && e.fatherId == id);
};

// 设置对应列
const settingColumn = (id, index) => {
  const column = getColumn(id, index);
  pickerRef.value.setColumnValues(index, column);
  columnsCopy[index] = column;
  return column;
};

// 实时改变
const change = (e) => {
  const { columnIndex, index } = e;
  const list = settingColumn(
    columnsCopy[columnIndex][index]?.id,
    columnIndex + 1
  );
  if (columnIndex == 0) {
    settingColumn(list[0]?.id, columnIndex + 2);
  }
};

// 确认
const confirm = (e) => {
  emit('confirm', e.value);
};
</script>

<style scoped lang="scss"></style>
