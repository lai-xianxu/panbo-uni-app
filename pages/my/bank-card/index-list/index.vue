<template>
  <uv-popup ref="popupRef" mode="right" @change="change">
    <view class="index-list-page fss-c">
      <view class="status_bar" />
      <view class="nav-bar">
        <image src="@/static/common/left-arrow.png" @click="close" />
      </view>
      <view class="page-content">
        <uv-index-list :index-list="indexList">
          <template v-for="(item, index) in itemArr">
            <uv-index-item>
              <uv-index-anchor :text="indexList[index]"></uv-index-anchor>
              <view
                class="list-cell"
                v-for="cell in item"
                @click.stop="onSelect(cell)"
              >
                {{ cell.label || cell.areaName }}
              </view>
            </uv-index-item>
          </template>
        </uv-index-list>
      </view>
    </view>
  </uv-popup>
</template>

<script setup>
import { ref, watch } from 'vue';
import { appGetDictItems, appGetPdAreaCountryList } from '@/api/my';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'bank',
  },
});

const emit = defineEmits(['update:modelValue', 'select']);

// v-model
let popupRef = ref(null);
const open = () => {
  popupRef.value.open();
};
const close = () => {
  popupRef.value.close();
};
const change = (e) => {
  emit('update:modelValue', e.show);
};
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      open();
      if (props.type == 'bank') {
        getDictItems();
      } else {
        getPdAreaCountryList();
      }
    } else {
      close();
    }
  }
);

const indexList = ref([]);
const itemArr = ref([]);
// 获取银行信息
const getDictItems = async () => {
  const res = await appGetDictItems({
    dictCode: 'card_type',
  });
  indexList.value = ['#'];
  itemArr.value = [res];
};

// 获取国家信息
const getPdAreaCountryList = async () => {
  const { result } = await appGetPdAreaCountryList();
  let data = result.pdAreaCountryDtoList;
  data.sort((a, b) => a.initial.localeCompare(b.initial));
  let initialArray = [...new Set(data.map((item) => item.initial))];
  let groupedData = data.reduce((groups, item) => {
    let initial = item.initial;
    if (!groups[initial]) {
      groups[initial] = [];
    }
    groups[initial].push(item);
    return groups;
  }, {});
  let dataList = initialArray.map((initial) => groupedData[initial]);
  indexList.value = initialArray;
  itemArr.value = dataList;
};

const onSelect = (cell) => {
  emit('select', {
    type: props.type,
    value: cell,
  });
  close();
};
</script>

<style scoped lang="scss">
.nav-bar {
  width: 100%;
  padding: 38rpx 33rpx 33rpx;
  image {
    width: 22rpx;
    height: 36rpx;
    cursor: pointer;
  }
}
:deep() {
  .index-list-page {
    min-width: 750rpx;
    width: 100%;
    height: 100%;
    background-color: #f2faff;
    .uv-index-list,
    .uni-scroll-view {
      height: 100%;
    }
    uni-scroll-view {
      height: 100%;
    }
    .page-content {
      flex: 1;
      height: 0;
      min-height: 0;
      width: calc(100% - 30px);
    }
    .uni-scroll-view-content {
      padding: 0 0 0 30rpx;
    }

    .uv-index-anchor {
      background-color: #f2faff !important;
      .uv-index-anchor__text {
        font-size: 32rpx !important;
        line-height: 32rpx;
        font-weight: 400;
        color: #1a1a1a;
      }
    }
    .list-cell {
      width: 100%;
      background: #ffffff;
      border-radius: 20rpx;
      box-shadow: 0 4rpx 8rpx 0 rgba(12, 100, 127, 0.3);
      padding: 15rpx 30rpx;
      margin: 15rpx 0;
      font-size: 28rpx;
      line-height: 28rpx;
      font-weight: 400;
      color: #1a1a1a;
    }
  }
}
</style>
