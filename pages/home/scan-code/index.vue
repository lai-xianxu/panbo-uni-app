<template>
  <view class="scan-wrap">
    <nav-bar />
    <view class="flex-column cross-center main-center scan-squre">
      <image class="squire" src="@/static/home/scan-squire.png" />
      <image class="line" src="@/static/home/scan-line.png" />
      <p class="tip">将二维码放入框内,即可自动扫描</p>
    </view>
  </view>
</template>

<script setup>
const scanCode = () => {
  uni.scanCode({
    //是否只能从相机扫码,不能从相册扫码
    onlyFromCamera: false,
    //规定扫码类型  字节跳动小程序不支持此参数
    // barcode就是一维码(条形码)  qrcode就是(er)维码
    // datamatrix就是Data Matrix码   pdf417就是PDF417条码
    scanType: ["barCode", "qrCode", "datamatrix", "pdf417"],
    // 是否启动自动识别字符编码功能
    autoDecodeCharset: false,
    // 是否开启自动放大功能  仅 App-Android (3.5.4+) 支持
    autoZoom: false,
    // 是否支持手动输入条形码  仅飞书小程序（V3.14.0）支持
    barCodeInput: false,
    success: (res) => {
      console.log(res, "scanCode-success")
    },
    fail: (error) => {
      console.log("扫码失败了", error);
    },
  });
};
scanCode()
</script>

<style scoped lang="scss">
.scan-wrap {
  padding: 0 30rpx;
  height: 100%;
  position: relative;
}
.scan-squre {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 400rpx;
  height: 400rpx;
  .squire {
    width: 100%;
    height: 100%;
  }
  .line {
    position: absolute;
    left: 0;
    width: 100%;
    top: 40%;
    height: 8rpx;
  }
}
.tip {
  font-size: 28rpx;
color: #FFFFFF;
margin-top: 40rpx;

}
</style>
