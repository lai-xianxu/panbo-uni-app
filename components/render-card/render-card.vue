<template>
  <view class="social-wrap">
    <view v-for="item in list" :key="item.label" class="social-wrap-item">
      <view class="label">{{ item.label }}</view>
      <view v-html="item.value"></view>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  list: {
    default: [],
  },
});
</script>

<style scoped lang="scss">
.social-wrap {
  flex: 1;
  overflow: auto;
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
  border-radius: 20rpx;
  padding: 30rpx;
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
