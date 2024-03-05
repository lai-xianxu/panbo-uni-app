<template>
  <nav-bar-page class="login pb-page" contentClass="fsc-c">
    <view
      v-if="pageType == 'login'"
      class="login-type fsc"
      @click.stop="onPasswordLogin"
    >
      <image class="login-type-icon" src="@/static/login/switch.png" />
      <text>密码登录</text>
    </view>

    <view class="pb-welcome">验证码已发送</view>
    <view class="code-phone">{{ phone }}</view>
    <uv-code-input
      class="code-input"
      v-model="smsCode"
      :maxlength="6"
      :focus="true"
      size="80rpx"
    ></uv-code-input>
    <view
      class="reset-send"
      :class="{ 'reset-send-disabled': sendLock }"
      @click.stop="onResetSend"
    >
      重新发送 {{ sendLock ? `${countdown}s` : '' }}
    </view>

    <view class="footer fsc-c">
      <uv-button
        :throttleTime="300"
        shape="square"
        :text="buttonText[pageType]"
        @click="onNext"
      ></uv-button>
      <div class="agreement" v-if="pageType == 'login'">
        <uv-radio-group
          v-model="radiovalue"
          activeColor="#fff"
          size="24rpx"
          labelSize="24rpx"
        >
          <uv-radio name="agree">
            <div class="radio-text">
              我已阅读并同意盘博
              <text @click.stop="onAgreement">用户协议</text>
              和
              <text @click.stop="onPrivary">隐私政策</text>
            </div>
          </uv-radio>
        </uv-radio-group>
      </div>
    </view>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { appSms, appPhoneLogin, appVerification } from '@/api/login';
import throttle from '@/uni_modules/uv-ui-tools/libs/function/throttle.js';
import { useUserStore } from '@/stores/user';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';

const userStore = useUserStore();

// 静态文本
const buttonText = {
  register: '下一步',
  forgot: '下一步',
  login: '立即登录',
};

// 初始化
const phone = ref('');
const pageType = ref('login');
onLoad((params) => {
  pageType.value = params.type || 'login';
  phone.value = params.phone;
  sendSms();
});

// 发送验证码
const sendSms = async () => {
  const smsModeMap = {
    login: '0',
    register: '1',
    forgot: '2',
  };
  await appSms({
    phone: phone.value,
    smsMode: smsModeMap[pageType.value],
  });
  getCountdown();
};

// 倒计时
const countdown = ref(59);
const getCountdown = () => {
  sendLock.value = true;
  let timmer = setInterval(() => {
    countdown.value--;
    if (countdown.value == 0) {
      clearInterval(timmer);
      timmer = null;
      sendLock.value = false;
      countdown.value = 59;
    }
  }, 1000);
};

// 重新发送
const sendLock = ref(false);
const onResetSend = () => {
  throttle(async () => {
    if (sendLock.value) return;
    sendSms();
  }, 300);
};

// 按钮事件
const smsCode = ref('');
const radiovalue = ref('');
const onNext = () => {
  if (!smsCode.value || smsCode.value.length !== 6) {
    uni.$uv.toast('请输入完整的验证码');
    return;
  }
  if (pageType.value == 'login') {
    if (radiovalue.value != 'agree') {
      uni.$uv.toast('请阅读并同意用户协议和隐私政策');
      return;
    }
    onLogin();
  } else if (pageType.value == 'register') {
    onRegister();
  } else if (pageType.value == 'forgot') {
    onForgotPassword();
  }
};

// 登录
const onLogin = async () => {
  const { result } = await appPhoneLogin({
    phone: phone.value,
    smsCode: smsCode.value,
  });
  userStore.state_user = result;
  userStore.state_is_gestures_password = result?.userInfo?.isGesturesPassword;
  route({
    type: 'switchTab',
    url: 'pages/home/index',
  });
};

// 注册
const onRegister = () => {
  route('pages/login/setting-password/index', {
    phone: phone.value,
    type: pageType.value,
    smsCode: smsCode.value,
  });
};

// 忘记密码
const onForgotPassword = async () => {
  await appVerification({
    phone: phone.value,
    smsCode: smsCode.value,
  });
  route('pages/login/setting-password/index', {
    phone: phone.value,
    type: pageType.value,
    smsCode: smsCode.value,
  });
};

// 密码登录
const onPasswordLogin = () => {
  route('pages/login/input-login/index', {
    phone: phone.value,
    type: 'password',
  });
};

// const popupShow = ref(false);

// 查看协议
const onAgreement = () => {
  // plus.runtime.openURL('/static/agreement.html');
  route('pages/login/web-view/index', {
    url: '/static/agreement.html',
  });
};
const onPrivary = () => {
  plus.runtime.openWeb('http://site.skyun.com.cn/privacy.html');
};
</script>

<style scoped lang="scss">
@import '@/static/scss/login.scss';
.login {
  .pb-welcome {
    margin-top: 300rpx;
    font-weight: 400;
  }
  .code-phone {
    font-size: 28rpx;
    color: #333333;
    line-height: 28rpx;
    margin-top: 30rpx;
  }
  .code-input {
    margin-top: 90rpx;
  }
  .reset-send {
    margin-top: 60rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #17bcef;
    line-height: 28rpx;
    &-disabled {
      color: #999999;
      pointer-events: none;
    }
  }
}
:deep(.uv-code-input__item) {
  width: 80rpx !important;
  height: 100rpx !important;
  background: #f2f2f2;
  border: none !important;
  border-radius: 8rpx;
}
</style>
