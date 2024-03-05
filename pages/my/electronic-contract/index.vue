<template>
  <nav-bar-page class="electronic-contract" padding="0 30rpx 30rpx">
    <view class="ec-card">
      <p class="ec-h4">xxxx合同</p>
      <br />
      <p class="ec-text">甲方：xxx</p>
      <p class="ec-text">乙方：xxx</p>
      <br />
      <p class="ec-text">
        合同内容合同内容合同内容合同内容合同内容合同
        合同内容合同内容合同内容合同内容 合同内容合同内容合同内容
        合同内容合同内容合同内容合同内容合同内容
        合同内容合同内容合同内容合同内容 合同内容合同内容合同内容
        合同内容合同内容合同内容 合同内容合同内容合同内容合同内容
        合同内容合同内容合同内容合同内容合同内容
      </p>
      <p class="ec-text mt240">甲方：xxx</p>
      <p class="ec-text">乙方：点击签名（待引入组件）</p>
      <button class="ec-button fcc">同意并签署合同</button>
    </view>
  </nav-bar-page>
</template>

<script setup></script>

<style lang="scss">
.web-view-page {
  width: 100%;
  height: 100%;
  background-color: #fff;
  iframe {
    border: none !important;
  }
}
.electronic-contract {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;

  .ec-card {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 32rpx;
    background-color: #fff;
    border-radius: 20rpx;
    .ec-h4 {
      font-size: 28rpx;
      line-height: 28rpx;
      font-weight: bold;
      color: #1a1a1a;
    }
    .ec-text {
      font-size: 28rpx;
      line-height: 28rpx;
      font-weight: 400;
      color: #1a1a1a;
      line-height: 36rpx;
    }
    .ec-button {
      position: absolute;
      bottom: 80rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 600rpx;
      height: 80rpx;
      background: #17bcef;
      border-radius: 40rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #ffffff;
      margin: 170rpx auto 0;
    }
    .mt240 {
      margin-top: 240rpx;
    }
  }
}
</style>
