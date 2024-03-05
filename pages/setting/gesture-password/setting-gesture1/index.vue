<template>
  <nav-bar-page class="setting-gesture pb-page" contentClass="fsc-c">
    <view class="gesture-content">
      <view class="gesture-card fsc-c">
        <image class="gesture-bg-image" src="@/static/setting/gesture-bg.png" />
        <p>你可以设置一个手势密码<br />再次打开时可以选择手势密码登录</p>
        <uv-button
          :throttleTime="300"
          shape="square"
          text="开始设置"
          @click="onSetting"
        ></uv-button>
      </view>
    </view>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';

const onSetting = () => {
  route({
    type: 'redirect',
    url: 'pages/setting/gesture-password/setting-gesture2/index',
  });
};
</script>

<style scoped lang="scss">
.setting-gesture {
  width: 100%;
  height: 100%;
  .gesture-content {
    width: 100%;
    height: 100%;
    padding: 0 30rpx 30rpx;
    .gesture-card {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 20rpx;
      box-shadow: 0 4rpx 8rpx 0rpx rgba(12, 100, 127, 0.3);

      .gesture-bg-image {
        width: 400rpx;
        height: 594rpx;
        margin-top: 140rpx;
      }
      p {
        font-size: 28rpx;
        font-weight: 400;
        text-align: center;
        color: #333333;
        line-height: 40rpx;
        margin-bottom: 30rpx;
      }
    }
  }
}
</style>
