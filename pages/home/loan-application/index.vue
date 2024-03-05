<template>
  <view class="social-con">
    <nav-bar />
    <view class="social-wrap">
      <tab :list="tabList" v-model="active" class="tab_con" />
      <view class="social-wrap-con">
        <component :is="aligns[active]" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import BorrowMoney from "./borrow-money/index.vue";
import PettyCash from "./petty-cash/index.vue";
const aligns = {
  BorrowMoney,
  PettyCash,
};
const active = ref("BorrowMoney");
const tabList = ref([
  {
    name: "备用金",
    id: "PettyCash",
  },
  {
    name: "贷款",
    id: "BorrowMoney",
  },
]);
</script>

<style scoped lang="scss">
.social-con {
  display: flex;
  height: 100%;
  flex-direction: column;
  .social-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    // padding: 0 30rpx 30rpx;
    .tab_con {
      padding: 0 30rpx;
    }
    &-con {
      flex: 1;
      padding: 0 30rpx 30rpx;
      overflow: auto;
      margin-top: 32rpx;
    }
  }
}
.title {
  font-size: 32rpx;
  color: #333333;
  margin-bottom: 30rpx;
  padding-left: 20rpx;
}
</style>
