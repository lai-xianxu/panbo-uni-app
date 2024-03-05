<template>
  <uv-popup
    ref="basePopupRef"
    mode="right"
    safeAreaInsetTop
    zIndex="888"
    @change="change"
  >
    <view class="filter-popup pb-page">
      <view class="filter-text">时间</view>
      <view class="fsc-c">
        <view class="filter-time fcc" @click.stop="calendarsOpen('startTime')">
          {{ timeFormat(params.startTime, 'yyyy-mm') }}
        </view>
        <view class="filter-text m20">至</view>
        <view class="filter-time fcc" @click.stop="calendarsOpen('endTime')">
          {{ timeFormat(params.endTime, 'yyyy-mm') }}
        </view>
      </view>
      <view class="filter-text">金额</view>
      <view class="fsc-c">
        <uv-input
          placeholder="请输入"
          border="surround"
          type="number"
          v-model="params.minAmt"
        ></uv-input>
        <!-- <view class="filter-time fcc">2022-08</view> -->
        <view class="filter-text m20">至</view>
        <uv-input
          placeholder="请输入"
          border="surround"
          type="number"
          v-model="params.maxAmt"
        ></uv-input>
        <!-- <view class="filter-time fcc">2022-08</view> -->
      </view>
      <view class="filter-text">发放情况</view>
      <view
        class="radio-btn fcc mb30"
        :class="{ 'radio-btn-no': params.grantState != 200 }"
        @click.stop="params.grantState = 200"
      >
        已发放
      </view>
      <view
        class="radio-btn fcc"
        :class="{ 'radio-btn-no': params.grantState == 200 }"
        @click.stop="params.grantState = 100"
      >
        未发放
      </view>

      <uv-button
        :throttleTime="300"
        shape="square"
        text="确定"
        @click="onSubmit"
      ></uv-button>
    </view>
  </uv-popup>

  <!-- 开始时间 -->
  <uv-datetime-picker
    ref="startDatetimePicker"
    v-model="params.startTime"
    mode="year-month"
  />
  <uv-datetime-picker
    ref="endDatetimePicker"
    v-model="params.endTime"
    mode="year-month"
  />
</template>

<script setup>
import { ref, watch } from 'vue';
import { timeFormat } from '@/uni_modules/uv-ui-tools/libs/function/index.js';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'confirm']);

// popup
const basePopupRef = ref(null);
const open = () => {
  basePopupRef.value.open();
};
const close = () => {
  basePopupRef.value.close();
};
const change = (e) => {
  if (e.show) emit('update:modelValue', true);
  else emit('update:modelValue', false);
};
// v-model
watch(
  () => props.modelValue,
  (val) => {
    if (val) open();
    // else close();
  }
);

// 时间
const dateNow = new Date();
dateNow.setDate(1);
dateNow.setHours(0, 0, 0, 0);
const params = ref({
  endTime: dateNow.getTime(),
  startTime: dateNow.getTime(),
  grantState: 200,
  maxAmt: '',
  minAmt: '',
});
const startDatetimePicker = ref(null);
const endDatetimePicker = ref(null);
const calendarsOpen = (type) => {
  if (type == 'startTime') {
    startDatetimePicker.value.open();
  } else {
    endDatetimePicker.value.open();
  }
};

const onSubmit = () => {
  emit('confirm', params.value);
  close();
};
</script>

<style scoped lang="scss">
.filter-popup {
  position: relative;
  width: 300rpx;
  height: 100%;
  padding: 40rpx 60rpx 70rpx 30rpx;
  .filter-text {
    font-size: 28rpx;
    line-height: 28rpx;
    font-weight: 400;
    color: #333333;
    margin: 30rpx 0;
  }
  .filter-time {
    width: 100%;
    height: 60rpx;
    border: 1rpx solid #333333;
    border-radius: 20rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #333333;
  }
  .radio-btn {
    width: 100%;
    height: 60rpx;
    background: #17bcef;
    border-radius: 20rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #ffffff;
    &-no {
      background: #ffffff;
      border: 1rpx solid #aaaaaa;
      color: #aaaaaa;
    }
  }
}
:deep() {
  .uv-input {
    border: 1rpx solid #333333 !important;
    border-radius: 20rpx;
    width: 100%;
    height: 60rpx;
    padding: 5rpx 10rpx !important;
    input {
      text-align: center;
    }
  }
  .uni-input-placeholder,
  .uni-input-input {
    text-align: center;
  }
  .uv-button-wrapper {
    position: absolute;
    bottom: 60rpx;
    width: initial;
    .uv-button {
      width: 200rpx !important;
    }
  }
}
</style>
