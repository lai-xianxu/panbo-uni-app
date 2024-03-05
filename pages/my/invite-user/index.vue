<template>
  <nav-bar-page class="invite-user" isWhiteArrow>
    <view class="real-header invite-header">邀请用户</view>

    <div class="code-card fsc-c">
      <div class="user-name">
        用户名称 <span v-if="userInfo.realname">({{ userInfo.realname }}) </span
        >
      </div>
      <div class="code-desc">请被邀请人通过扫码功能扫描该二维码完成绑定</div>

      <!-- <div class="code-img"> -->
        <uv-qrcode v-if="!codeUrl" class="code-img" ref="qrcode"></uv-qrcode>
        <image v-else class="code-img" :src="codeUrl" />

      <!-- </div> -->
      <!-- <div class="code-error">二维码已过期，请点击二维码刷新重试</div> -->
    </div>

    <div class="invite-his fsbc" @click.stop="onViewDetail">
      <div class="fsc">
        <image class="his-icon" src="@/static/my/invite-his.png"></image>
        <div>我的邀请</div>
      </div>
      <image class="his-arrow" src="@/static/common/right-arrow.png"></image>
    </div>
  </nav-bar-page>
</template>

<script setup>
import { computed, ref } from "vue";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import { useUserStore } from "@/stores/user";
import {getInviteCode } from "@/api/company"

const userStore = useUserStore();
const userInfo = computed(() => userStore.getters_user_info);
const onViewDetail = () => {
  route("pages/my/invite-user/invite-history/index");
};

const codeUrl = ref("");
const initCode = async () => {
  const data = await getInviteCode();
  let base64 = uni.arrayBufferToBase64(data);
  console.log(data, "base64")
  codeUrl.value = "data:image/jpeg;base64," + base64;
};
initCode();
</script>

<style scoped lang="scss">
.invite-user {
  background-color: #368efc;
  .invite-header {
    font-size: 32rpx;
    font-weight: 400;
    color: #ffffff;
  }
  .code-card {
    background: url("@/static/my/invite-bg.png") no-repeat;
    background-size: 100%;
    width: 100%;
    height: 800rpx;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
    border-radius: 20rpx;
    margin-top: 30rpx;
    .user-name {
      margin-top: 120rpx;
      font-size: 28rpx;
      line-height: 28rpx;
      font-weight: 400;
      color: #333333;
    }
    .code-desc {
      margin-top: 150rpx;
      font-size: 24rpx;
      line-height: 24rpx;
      font-weight: 400;
      color: #999999;
    }
    .code-img {
      margin-top: 30rpx;
      width: 300rpx;
      height: 300rpx ;
    }
    .code-error {
      font-size: 24rpx;
      line-height: 24rpx;
      font-weight: 400;
      color: #cc0000;
    }
  }
  .invite-his {
    width: 100%;
    height: 80rpx;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
    border-radius: 20rpx;
    margin-top: 30rpx;
    padding: 0 30rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #333333;
    .his-icon {
      width: 34rpx;
      height: 32rpx;
      margin-right: 10rpx;
    }
    .his-arrow {
      width: 20rpx;
      height: 34rpx;
    }
  }
}
</style>
