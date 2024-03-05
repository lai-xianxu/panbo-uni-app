<template>
  <nav-bar-page class="setting-gesture pb-page" contentClass="fsc-c">
    <view class="gesture-content">
      <view class="gesture-card fsc-c">
        <view class="card-text">{{ numMsg }}</view>
        <draw-lock
          class="draw-lock"
          :defaultValue="[]"
          :activeBorderColor="lockColor.border"
          :activeOutColor="lockColor.activeOut"
          :activeColor="lockColor.active"
          @complete="onComplete"
          @completeTimeout="onCompleteTimeout"
        />
        <view class="card-error-text" v-if="errorMsg"
          >{{ errorMsg }}<br />请重新尝试</view
        >
      </view>
    </view>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { appUpdateUser, appGetUser } from '@/api/login';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 手势颜色
const defaultColor = {
  border: '#17BCEF',
  activeOut: '#378cfd',
  active: '#17BCEF',
};
const errorColor = {
  border: '#ffc6bf',
  activeOut: '#ff736e',
  active: '#ffc6bf',
};

// 手势完成
const num = ref(1);
const errorMsg = ref('');
const numMsg = ref('请绘制你的手势密码');
const firstPassword = ref('');
const lockColor = ref(defaultColor);
const onComplete = async (value) => {
  if (value.length < 4) {
    lockColor.value = errorColor;
    errorMsg.value = '长度不能小于4';
    return;
  }
  if (num.value == 1) {
    firstPassword.value = value.join('');
    num.value = 2;
    numMsg.value = '请再次绘制你的手势密码';
    return;
  }
  if (num.value == 2 && firstPassword.value != value.join('')) {
    lockColor.value = errorColor;
    errorMsg.value = '两次绘制图案不一致';
    return;
  }
  errorMsg.value = '';
  await appUpdateUser({
    type: 5,
    gesturesPassword: value.join(''),
    checkGesturesPassword: value.join(''),
  });
  await appUpdateUser({
    type: 6,
    isGesturesPassword: 200,
  });
  num.value = 1;
  numMsg.value = '请绘制你的手势密码';
  uni.$uv.toast('手势设置成功');
  const { result } = await appGetUser();
  userStore.state_is_gestures_password = result?.isGesturesPassword;
  setTimeout(() => {
    route({ type: 'navigateBack' });
  }, 500);
};
const onCompleteTimeout = () => {
  lockColor.value = defaultColor;
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
      .card-text {
        font-size: 28rpx;
        font-weight: 400;
        color: #333333;
        line-height: 36rpx;
        margin-top: 60rpx;
      }
      .draw-lock {
        margin-top: 110rpx;
      }
      .card-error-text {
        font-size: 28rpx;
        font-weight: 400;
        text-align: center;
        color: #cc0000;
        line-height: 36rpx;
        margin-top: 60rpx;
      }
    }
  }
}
</style>
