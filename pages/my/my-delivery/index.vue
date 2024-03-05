<template>
  <nav-bar-page class="pb-page my-delivery">
    <tab :list="tabList" v-model="active" />

    <view
      v-if="list?.length"
      class="delivery-card"
      v-for="item in list"
      :key="item.id"
    >
      <view class="card-header fsbc">
        <view class="header-left">{{ item.jobTitle }}</view>
        <view class="header-right">{{ item.salary }}</view>
      </view>
      <view class="fss fw">
        <view class="card-tag fcc" v-if="item.jobCity_dictText">{{
          item.jobCity_dictText
        }}</view>
        <view class="card-tag fcc" v-if="item.jobExperience"
          >{{ item.jobExperience }}年</view
        >
        <view class="card-tag fcc" v-if="item.educationRequired_dictText">{{
          item.educationRequired_dictText
        }}</view>
      </view>
      <view class="fsc card-company">
        <image src="@/static/login/pb-logo.png" class="company-avatar" />
        <view class="fss-c">
          <view class="company-name">{{ item.companyVO?.companyName }}</view>
          <view class="company-desc">{{ item.companyVO?.description }}</view>
        </view>
      </view>

      <view v-if="active == '1'">
        <view class="card-line"></view>
        <view class="success-text">恭喜您收到面试邀请，请准时参加面试！</view>
        <view class="success-text fsc">
          <image src="@/static/my/time.png" class="success-icon" />
          {{ item.interviewTime }}
        </view>
        <view class="success-text fsc" v-if="item.interviewAddress">
          <image src="@/static/my/position.png" class="success-icon" />
          {{ item.interviewAddress }}
        </view>
      </view>
    </view>

    <uv-empty v-else mode="list" marginTop="100"></uv-empty>
  </nav-bar-page>
</template>

<script setup>
import { ref, watch } from 'vue';
import { appMyDelivery, appMyInterview } from '@/api/my';

const active = ref('1');
const tabList = ref([
  {
    name: '已收到面试邀请',
    id: '1',
  },
  {
    name: '未收到面试邀请',
    id: '2',
  },
]);

// 获取简历投递
const list = ref([]);
const getMyDelivery = async () => {
  const { result } = await appMyDelivery();
  list.value = result || [];
};

// 获取面试记录
const getMyInterview = async () => {
  const { result } = await appMyInterview();
  list.value = result || [];
};

watch(
  () => active.value,
  (val) => {
    if (val == 1) {
      getMyInterview();
    } else {
      getMyDelivery();
    }
  },
  {
    immediate: true,
  }
);
</script>

<style scoped lang="scss">
.my-delivery {
  .delivery-card {
    width: 100%;
    background: #ffffff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 8rpx 0rpx rgba(12, 100, 127, 0.3);
    padding: 30rpx;
    margin-top: 30rpx;
    .card-header {
      .header-left {
        font-size: 28rpx;
        font-weight: 700;
        color: #1a1a1a;
      }
      .header-right {
        font-size: 28rpx;
        font-weight: 400;
        color: #17bcef;
      }
    }
    .card-tag {
      height: 40rpx;
      background: #17bcef;
      border-radius: 8rpx;
      font-size: 24rpx;
      font-weight: 400;
      color: #ffffff;
      padding: 0 8rpx;
      margin: 12rpx 20rpx 0 0;
    }
    .card-company {
      margin-top: 30rpx;
      .company-avatar {
        width: 100rpx;
        height: 100rpx;
        margin-right: 30rpx;
        flex-shrink: 0;
      }
      .company-name {
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 400;
        color: #1a1a1a;
      }
      .company-desc {
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 400;
        color: #808080;
        margin-top: 20rpx;
      }
    }
    .card-line {
      width: 100%;
      height: 2rpx;
      background-color: #17bcef;
      border-radius: 2rpx;
      margin-top: 40rpx;
    }
    .success-text {
      font-size: 28rpx;
      font-weight: 400;
      color: #17bcef;
      line-height: 28rpx;
      margin-top: 30rpx;
      .success-icon {
        width: 24rpx;
        height: 24rpx;
        margin-right: 10rpx;
      }
    }
  }
}
</style>
