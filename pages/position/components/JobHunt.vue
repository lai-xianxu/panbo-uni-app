<template>
  <view class="resume-contant flex-column">
    <view class="flex1">
      <view class="field-item">
        <p class="label">工作城市</p>
        <uv-input
          @click.stop="onChooseCity"
          :modelValue="form.desiredCity_dictText"
          placeholder="请输入工作城市"
          border="bottom"
        ></uv-input>
      </view>
      <view class="field-item">
        <p class="label">期望职位</p>
        <uv-input
          v-model="form.desiredPosition"
          placeholder="请输入期望职位"
          border="bottom"
        ></uv-input>
      </view>
      <view class="field-item">
        <p class="label">薪资要求</p>
        <p class="salary" @click.stop="onOpen">
          {{ form.salaryMin }}-{{ form.salaryMax }}k
        </p>
      </view>
    </view>
    <view class="resume-contant-footer flex0 flex-center">
      <p class="del-btn flex-center" @click.stop="modal?.open()">删除</p>
      <p class="save-btn flex-center" @click.stop="onSave">保存</p>
    </view>
    <uv-picker
      ref="picker"
      title="薪资要求 (月薪, 单位: 元)"
      :columns="columns"
      :defaultIndex="[2, 1]"
      round="30rpx"
      @confirm="onPickerchange"
    ></uv-picker>
    <uv-modal
      ref="modal"
      title="提示"
      showCancelButton
      content="确认删除次求职期望?"
      @confirm="confirmDel"
    ></uv-modal>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { addJob, getMyResume, updateJob, deleteByJob } from "@/api/recruit";
import { onLoad, onShow } from "@dcloudio/uni-app";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";

const picker = ref();
const curCity = ref({});
const modal = ref();
const form = ref({
  desiredPosition: "", // 期望职位
  salaryMin: "3", // 最低薪资
  salaryMax: "4", // 最高薪资
});
const columns = ref([
  ["1k", "2k", "3k", "4k", "5k", "6k", "7k", "8k", "9k", "10k", "11k"],
  [
    "3k",
    "4k",
    "5k",
    "6k",
    "7k",
    "8k",
    "9k",
    "10k",
    "11k",
    "12k",
    "13k",
    "14k",
    "15k",
    "16k",
    "17k",
    "18k",
    "19k",
    "20k",
  ],
]);
onShow(() => {
  const city = uni.getStorageSync("checkedCity");
  curCity.value = city ? JSON.parse(city) : {};
  form.value.desiredCity = city ? curCity.value?.value : form.value.desiredCity;
  form.value.desiredCity_dictText = city ? curCity.value?.title : form.value.title;
  uni.clearStorageSync("checkedCity");
});
const info = ref({});
const initData = async (id) => {
  const data = await getMyResume();
  info.value = data?.result;
  const list = data?.result?.pbJobExpectationList || [];
  form.value = list.find((res) => res.id == id);
};
let id = "";
onLoad((params) => {
  id = params.id;
  if (id) initData(id);
});

const onOpen = () => {
  picker.value?.open();
};
const onPickerchange = (e) => {
  form.value.salaryMin = e.value[0]?.slice(0, -1);
  form.value.salaryMax = e.value[1]?.slice(0, -1);
};
const onSave = async () => {
  if (id) {
    await updateJob({
      ...form.value,
    });
  } else {
    await addJob({
      desiredCity: curCity.value.value,
      ...form.value,
    });
  }
  uni.navigateBack({
    delta: 1,
  });
};
const onChooseCity = () => {
  route("pages/position/search-city/index");
};
const confirmDel = async () => {
  if (id) {
    await deleteByJob({ id });
  }
  uni.navigateBack({
    delta: 1,
  });
};
</script>

<style scoped lang="scss">
.resume-contant {
  padding: 30rpx;
  &-footer {
    color: #ffffff;
    .del-btn {
      width: 200rpx;
      height: 80rpx;
      background: #aaaaaa;
      border-radius: 40rpx;
      box-shadow: -4rpx 0rpx 8rpx 4rpx rgba(119, 119, 119, 0.3);
    }
    .save-btn {
      width: 400rpx;
      height: 80rpx;
      background: linear-gradient(0deg, #17bcef 0%, #378cfd 100%);
      border-radius: 40rpx;
      box-shadow: -4rpx 0rpx 8rpx 4rpx rgba(12, 100, 127, 0.3);
      margin-left: 20rpx;
    }
  }
  .field-item {
    margin-bottom: 24rpx;
    position: relative;
    &::after {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 1rpx;
      content: "";
      background-color: #17bcef;
      transform: scaleY(0.5);
    }
    .label {
      font-size: 28rpx;
      padding-left: 4rpx;
      color: #777777;
    }
    .salary {
      padding: 16rpx 0 30rpx;
      color: #333333;
    }
  }
}

:deep {
  .uv-input {
    padding: 16rpx 0 30rpx !important;
    border: none !important;
    .uni-input-input {
      color: #333333;
      font-size: 28rpx;
    }
  }
}
</style>
