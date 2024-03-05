<template>
  <view class="article">
    <nav-bar />
    <view class="position-det position-item">
      <p class="title">职位详情</p>
      <view class="flex-row position-tab">
        <p class="position-tab-item flex-center">{{ info.jobTags }}</p>
      </view>
      <p class="dec" v-html="info.jobDescription?.replace(/\n/g, '<br>')"></p>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getJobyById } from '@/api/recruit';

const info = ref({});
onLoad((params) => {
  const init = async () => {
    const data = await getJobyById({
      id: params.id,
    });
    info.value = data.result;
  };
  init();
});
</script>

<style scoped lang="scss">
.article {
  display: flex;
  flex-direction: column;
  padding-bottom: 30rpx;
  .position-det {
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
    border-radius: 20rpx;
    margin: 0 30rpx;
    padding: 30rpx;

    .title {
      font-weight: 500;
    }
    .position-tab {
      margin: 16rpx 0;
      .position-tab-item {
        background: #17bcef;

        height: 40rpx;
        padding: 0 8rpx;
        font-size: 24rpx;
        color: #ffffff;
        margin-right: 10rpx;
        border-radius: 8rpx;
      }
    }
    .dec {
      color: #777777;
    }
  }
}
</style>
