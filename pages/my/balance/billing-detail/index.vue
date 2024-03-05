<template>
  <nav-bar-page class="billing-details">
    <view class="fss-c billing-content">
      <view class="real-header">账单详情</view>
      <view class="billing-card">
        <view class="fsc-c">
          <view>{{ titleMap[billingDetail.transactionType] }}</view>
          <view class="billing-num">{{ billingDetail.amount }}</view>
        </view>
        <view class="billing-line"></view>
        <view v-for="item in detailMap" :key="item.key">
          <view class="fsbc mt30" v-show="billingDetail[item.key]">
            <span class="label-text">{{ item.label }}</span>
            <span class="value-text">{{ billingDetail[item.key] }}</span>
          </view>
        </view>
      </view>
    </view>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import { appGetPbBalanceChangeDetail } from '@/api/my';
import { onLoad } from '@dcloudio/uni-app';

onLoad(({ id }) => {
  getPbBalanceChangeDetail(id);
});

const detailMap = [
  {
    label: '订单状态',
    key: 'state',
  },
  {
    label: '订单时间',
    key: 'createTime',
  },
  {
    label: '订单编号',
    key: 'balanceNo',
  },
  {
    label: '备注',
    key: 'notes',
  },
  {
    label: '还款期数',
    key: 'repaymentNumberPeriods',
  },
  {
    label: '当前期数',
    key: 'currentNumberPeriods',
  },
  {
    label: '总共需还款本息和',
    key: 'interest',
  },
  {
    label: '已还款金额',
    key: 'alreadyRepaidMoney',
  },
  {
    label: '未还款金额',
    key: 'notYetMoney',
  },
];
const titleMap = {
  100: '提现',
  200: '存入',
  300: '充值',
  400: '转入',
  500: '借款',
  600: '还款',
  700: '收益',
  900: '扫码付款',
};

const billingDetail = ref({});
const getPbBalanceChangeDetail = async (id) => {
  const { result } = await appGetPbBalanceChangeDetail({ id });
  billingDetail.value = result;
};
</script>

<style scoped lang="scss">
.billing-details {
  .billing-content {
    height: 100%;
    padding-bottom: 30rpx;
  }
  .billing-card {
    width: 100%;
    flex: 1;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
    border-radius: 20rpx;
    padding: 30rpx;
    font-size: 28rpx;
    line-height: 28rpx;
    font-weight: 400;
    color: #333333;
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
      margin-top: 30rpx;
    }
    .label-text {
      min-width: 240rpx;
      flex-shrink: 0;
    }
    .value-text {
      text-align: right;
      word-break: break-all;
    }
  }
}
</style>
