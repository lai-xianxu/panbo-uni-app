<template>
  <view class="historical-record-wrap flex-column">
    <view
      class="historical-record"
      v-for="item in list"
      :key="item.id"
      @click.stop="onViewDetail(item)"
    >
      <li class="historical-record-item">
        <view class="historical-record-item-label">借款日期</view>
        <view class="historical-record-item-value">{{ item.loanDate }}</view>
      </li>
      <li class="historical-record-item">
        <view class="historical-record-item-label">还款日期</view>
        <view class="historical-record-item-value">
          {{ item.repaymentDate }}
        </view>
      </li>
      <li class="historical-record-item">
        <view class="historical-record-item-label">借款金额</view>
        <view class="historical-record-item-value">
          {{ item.loanAmount }}
        </view>
      </li>
      <li class="historical-record-item">
        <view class="historical-record-item-label">利息金额</view>
        <view class="historical-record-item-value">
          {{ item.interestAmount }}
        </view>
      </li>
      <li class="historical-record-item">
        <view class="historical-record-item-label">总计金额</view>
        <view class="historical-record-item-value">
          {{ item.totalAmount }}
        </view>
      </li>
      <li class="historical-record-item" v-if="item.reason">
        <view class="historical-record-item-label">驳回原因</view>
        <view class="historical-record-item-value">
          {{ item.reason }}
        </view>
      </li>
      <view
        class="repayment-btn"
        @click.stop="onRepayment(item)"
        :class="item.overdueDays ? 'normal' : status[item.status || 3]?.class"
      >
        {{
          item.overdueDays ? '立即还款' : status[item.status]?.name || '已还款'
        }}
      </view>
      <p class="izOverdue" v-if="item.izOverdue">
        已逾期{{ item.overdueDays }}天, 应额外缴纳滞纳金{{
          item.penaltyAmount
        }}元
      </p>
      <!-- <view class="repayment-btn under-review" v-if="item.isRepay">审核中</view> -->
    </view>
    <!-- <view class="repayment-btn all-repayment flex0">全部还款</view> -->
  </view>
</template>

<script setup>
import { ref } from 'vue';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { useRepayStore } from '@/stores/repay';

const repayStore = useRepayStore();

const emit = defineEmits(['onRenewList']);

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
    class: 'under-review',
  },
});
const props = defineProps({
  list: {
    default: () => [],
  },
});
const onRepayment = async (item) => {
  if (item.status == 1 || item.overdueDays) {
    repayStore.state_repay_obj = item;
    route('pages/my/bank-card/pay-password-check/index', {
      type: 'repay',
    });
    // emit('onRenewList');
    return;
  }
};

const onViewDetail = (item) => {
  route(
    'pages/home/loan-application/components/historical-record-detail/index',
    {
      data: JSON.stringify(item),
    }
  );
};
</script>

<style scoped lang="scss">
.historical-record-wrap {
  border-radius: 20rpx;
  background: #ffffff;
  padding: 0 30rpx 30rpx;
}
.historical-record {
  border-bottom: 1px solid #17bcef;
  padding: 30rpx 0 70rpx;
}
.historical-record-item {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  font-size: 28rpx;
  color: #333333;
  &:last-child {
    margin-bottom: 0;
  }
  &-label {
    font-size: 28rpx;
    color: #333333;
    margin-right: 10rpx;
  }
}
.repayment-btn {
  width: 300rpx;
  height: 80rpx;
  background: linear-gradient(0deg, #17bcef 0%, #378cfd 100%);
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
  border-radius: 40rpx;
  font-size: 28rpx;
  color: #ffffff;
  line-height: 80rpx;
  text-align: center;
  cursor: pointer;
  margin-top: 60rpx;
  &.warning {
    background: #da0000;
  }
}
.under-review {
  background: #aaaaaa;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(0, 0, 0, 0.3);
}
.all-repayment {
  width: 600rpx;
  margin-top: 42rpx;
}
.izOverdue {
  font-size: 22rpx;
  margin-top: 20rpx;
  color: red;
}
</style>
