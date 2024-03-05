<template>
  <view class="social-con">
    <nav-bar />
    <view class="title title-suffix">借款详情</view>
    <view class="social-wrap">
      <view class="fsc-c">
        <view>借款金额</view>
        <view class="billing-num">{{ pageParams.loanAmount }}</view>
      </view>
      <view class="billing-line"></view>
      <view v-for="item in list" :key="item.label" class="social-wrap-item">
        <view class="label">{{ item.label }}</view>
        <view>{{ pageParams[item.value] }}</view>
      </view>
      <view class="social-wrap-item" v-if="pageParams.reason">
        <view class="label">驳回原因</view>
        <view>{{ pageParams.reason }}</view>
      </view>
      <view class="social-wrap-item">
        <view class="label">借款状态</view>
        <view>{{
          pageParams.overdueDays
            ? '立即还款'
            : status[pageParams.status]?.name || '已还款'
        }}</view>
      </view>
      <view class="social-wrap-item" v-if="pageParams.izOverdue">
        <view class="label"
          >已逾期{{ pageParams.overdueDays }}天, 应额外缴纳滞纳金{{
            pageParams.penaltyAmount
          }}元</view
        >
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const pageParams = ref({});
onLoad((params) => {
  pageParams.value = JSON.parse(params.data || {});
  console.log('pageParams.value:', pageParams.value);
});

const list = ref([
  {
    label: '借款日期',
    value: 'loanDate',
  },
  {
    label: '还款日期',
    value: 'repaymentDate',
  },
  {
    label: '利息金额',
    value: 'interestAmount',
  },
  {
    label: '总计金额',
    value: 'totalAmount',
  },
]);

const status = ref({
  0: {
    name: '审核中',
    class: 'under-review',
  },
  1: {
    name: '立即还款',
    class: 'normal',
  },
  2: {
    name: '审核失败',
    class: 'warning',
  },
  3: {
    name: '已还款',
    class: 'normal',
  },
});
</script>

<style scoped lang="scss">
.social-con {
  padding: 0 0 50rpx;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.title {
  font-size: 32rpx;
  color: #333333;
  margin-bottom: 30rpx;
  padding-left: 30rpx;
}
.content {
  margin: 0 30rpx;
}
.social-wrap {
  flex: 1;
  overflow: auto;
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
  border-radius: 20rpx;
  padding: 30rpx;
  margin: 0 30rpx;
  .billing-num {
    font-size: 48rpx;
    line-height: 48rpx;
    font-weight: 400;
    color: #333333;
    margin-top: 30rpx;
  }
  .billing-line {
    width: 100%;
    height: 1rpx;
    background: #17bcef;
    border-radius: 1rpx;
    margin: 30rpx 0;
  }
  .label {
    min-width: 200rpx;
  }
  &-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 30rpx;
    font-size: 28rpx;
    color: #1a1a1a;
  }
}
</style>
