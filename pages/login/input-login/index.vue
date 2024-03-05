<template>
  <nav-bar-page class="login pb-page" contentClass="fsc-c">
    <view
      v-if="pageType == 'password'"
      class="login-type fsc"
      @click.stop="onCodeLogin"
    >
      <image class="login-type-icon" src="@/static/login/switch.png" />
      <text>验证码登录</text>
    </view>

    <view class="pb-welcome">{{ inputText[pageType] }}</view>
    <view class="login-phone fsc">
      <text class="login-phone-qh" v-if="pageType == 'register'">+86</text>
      <uv-input
        v-model="inputValue"
        :type="inputType[pageType]"
        :placeholder="placeholderText[pageType]"
        border="none"
        fontSize="28rpx"
        clearable
      ></uv-input>
    </view>
    <view
      v-if="pageType == 'password'"
      class="forgot-password"
      @click.stop="onForgotPassword"
    >
      忘记密码？
    </view>

    <view class="footer fsc-c">
      <uv-button
        :throttleTime="300"
        shape="square"
        :text="buttonText[pageType]"
        @click="onNext"
      ></uv-button>
      <div class="agreement">
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
import { appPassLogin } from '@/api/login';
import { useUserStore } from '@/stores/user';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';

const userStore = useUserStore();

// 静态文本
const inputText = {
  register: '注册账号',
  password: '输入密码',
};
const placeholderText = {
  register: '输入您的手机号码',
  password: '输入您的密码',
};
const inputType = {
  register: 'number',
  password: 'password',
};
const buttonText = {
  register: '下一步',
  password: '立即登录',
};

// 初始化
const phone = ref('');
const pageType = ref('password');
const inputValue = ref('');
onLoad((params) => {
  pageType.value = params.type || 'password';
  phone.value = params.phone;
  if (params.type == 'register') {
    inputValue.value = params.phone;
  }
});

// 按钮事件
const radiovalue = ref('');
const onNext = () => {
  if (radiovalue.value != 'agree') {
    uni.$uv.toast('请阅读并同意用户协议和隐私政策');
    return;
  }
  if (pageType.value == 'password') {
    onLogin();
  } else if (pageType.value == 'register') {
    onRegister();
  }
};

// 登录
const onLogin = async () => {
  if (!inputValue.value) {
    uni.$uv.toast('请输入密码');
    return;
  }
  const { result } = await appPassLogin({
    phone: phone.value,
    password: inputValue.value,
  });
  userStore.state_user = result;
  userStore.state_is_gestures_password = result?.userInfo?.isGesturesPassword;
  route({
    type: 'switchTab',
    url: 'pages/home/index',
  });
};

// 注册
const onRegister = async () => {
  if (!inputValue.value) {
    uni.$uv.toast('请输入手机号码');
    return;
  }
  route('pages/login/code-login/index', {
    phone: inputValue.value,
    type: 'register',
  });
};

// 验证码登录
const onCodeLogin = () => {
  route('pages/login/code-login/index', {
    phone: phone.value,
    type: 'login',
  });
};

// 忘记密码
const onForgotPassword = () => {
  route('pages/login/code-login/index', {
    phone: phone.value,
    type: 'forgot',
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
}
</style>
