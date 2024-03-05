<template>
  <nav-bar-page class="login pb-page" contentClass="fsc-c" :isNavBar="false">
    <view class="login-type fsc" @click.stop="onPasswordLogin">
      <image class="login-type-icon" src="@/static/login/switch.png" />
      <text>账号登录</text>
    </view>

    <view class="gesture-text">请绘制你的手势密码</view>
    <draw-lock
      class="draw-lock"
      :defaultValue="[]"
      :activeBorderColor="lockColor.border"
      :activeOutColor="lockColor.activeOut"
      :activeColor="lockColor.active"
      @complete="onComplete"
      @completeTimeout="onCompleteTimeout"
    />
    <view v-if="errorVisible" class="card-error-text"
      >图案绘制错误<br />请重新尝试</view
    >
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { appGestureLogin } from '@/api/login';
import { useUserStore } from '@/stores/user';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';

const userStore = useUserStore();

// 初始化
const phone = ref('');
onLoad((params) => {
  phone.value = params.phone;
});

// 密码登录
const onPasswordLogin = () => {
  route('pages/login/index', {
    phone: phone.value,
  });
};

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
const lockColor = ref(defaultColor);
const errorVisible = ref(false);
const onComplete = async (value) => {
  const { result } = await appGestureLogin({
    phone: phone.value,
    gesturesPassword: value.join(''),
  }).catch(() => {
    errorVisible.value = true;
    lockColor.value = errorColor;
  });
  userStore.state_user = result;
  userStore.state_is_gestures_password = result?.userInfo?.isGesturesPassword;
  route({
    type: 'switchTab',
    url: 'pages/home/index',
  });
  errorVisible.value = false;
  lockColor.value = defaultColor;
};
const onCompleteTimeout = () => {
  lockColor.value = defaultColor;
};
</script>

<style scoped lang="scss">
@import '@/static/scss/login.scss';
.login {
  .gesture-text {
    font-size: 28rpx;
    font-weight: 400;
    color: #333333;
    line-height: 28rpx;
    margin-top: 280rpx;
  }
  .draw-lock {
    margin-top: 100rpx;
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
</style>
