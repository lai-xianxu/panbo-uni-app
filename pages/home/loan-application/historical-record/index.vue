<template>
  <view class="record-wrap flex-column">
    <view>
      <nav-bar />
      <view class="title-suffix">{{ title }}</view>
    </view>
    <view class="record-con flex1">
      <scroll-view
        style="height: 100%"
        scroll-y="true"
        lower-threshold="20"
        @scrolltolower="getList"
      >
        <template v-if="list?.length">
          <HistoricalRecordList :list="list" @onRenewList="onRenewList" />
        </template>
        <uv-load-more style="padding: 20rpx 0" :status="status" />
      </scroll-view>
    </view>
    <view
      class="repayment-btn all-repayment flex0"
      @click.stop="onRepaymentAll"
    >
      全部还款
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { pbLoanManagementList, repayment } from '@/api/home';
import HistoricalRecordList from '../components/historical-record-list/index.vue';
import { onLoad } from '@dcloudio/uni-app';
import { useRepayStore } from '@/stores/repay';

const repayStore = useRepayStore();

const list = ref([]);
let pageNo = 1;
let pageSize = 4;
const status = ref('loading');
const loanType = ref('');

const getList = async () => {
  if (status.value == 'nomore') return;
  if (pageNo == 1) {
    list.value = [];
  }
  const data = await pbLoanManagementList({
    loanType: loanType.value, //借款
    pageNo,
    pageSize,
  });
  pageNo++;
  list.value = [...list.value, ...(data?.result?.records || [])];
  if ((data?.result?.records || []).length < pageSize) {
    status.value = 'nomore';
  }
};

onLoad((params) => {
  loanType.value = params?.loanType;
  // "更多备用金记录" : "更多借款记录";
  getList();
});
const title = computed(() => {
  return loanType.value == 1 ? '更多备用金记录' : '更多借款记录';
});
const onRenewList = () => {
  pageNo = 1;
  status.value = 'loading';
  getList();
};
const onRepaymentAll = async () => {
  await repayment({
    loanType: loanType.value,
  });
  uni.$uv.toast('全部还款成功');
  onRenewList();
};

watch(
  () => repayStore.getters_repay_refresh,
  async (val) => {
    if (val) {
      repayStore.state_repay_refresh = false;
      await repayment({
        id: repayStore.getters_repay_obj.id,
        loanType: repayStore.getters_repay_obj.loanType,
      });
      repayStore.state_repay_obj = {};
      uni.$uv.toast('还款成功');
      onRenewList();
    }
  },
  {
    immediate: true,
  }
);
</script>

<style scoped lang="scss">
.record-wrap {
  box-sizing: border-box;
  display: flex;
  height: 100%;
  flex-direction: column;
  .record-con {
    flex: 1;
    overflow: auto;
    padding: 30rpx 30rpx 30rpx;
    &-con {
      margin-top: 32rpx;
    }
  }
}
.title-suffix {
  padding: 0 33rpx;
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
  margin: 60rpx auto 30rpx;
}
.all-repayment {
  width: 600rpx;
  margin-top: 42rpx;
}
</style>
