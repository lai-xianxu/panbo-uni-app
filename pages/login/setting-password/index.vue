<template>
  <nav-bar-page class="login pb-page" contentClass="fsc-c">
    <view class="login-phone fsc">
      <uv-input
        v-model="password"
        type="password"
        placeholder="输入您的新密码"
        border="none"
        fontSize="28rpx"
        clearable
      ></uv-input>
    </view>
    <view class="login-phone login-phone-check fsc">
      <uv-input
        v-model="checkPassword"
        type="password"
        placeholder="再次输入您的新密码"
        border="none"
        fontSize="28rpx"
        clearable
      ></uv-input>
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
import { appPassLogin, appRegister, appPasswordChange } from '@/api/login';
import { useUserStore } from '@/stores/user';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';

const userStore = useUserStore();

// 静态文本
const buttonText = {
  register: '确认注册并登录',
  forgot: '确认修改并登录',
};

// 初始化
const phone = ref('');
const smsCode = ref('');
const pageType = ref('forgot');
onLoad((params) => {
  pageType.value = params.type || 'forgot';
  phone.value = params.phone || '';
  smsCode.value = params.smsCode || '';
});

// 按钮事件
const password = ref('');
const checkPassword = ref('');
const radiovalue = ref('');
const onNext = () => {
  if (!password.value) {
    uni.$uv.toast('请输入密码');
    return;
  }
  if (!checkPassword.value) {
    uni.$uv.toast('请再次输入密码');
    return;
  }
  if (password.value !== checkPassword.value) {
    uni.$uv.toast('两次输入的密码不一致');
    return;
  }
  if (radiovalue.value != 'agree') {
    uni.$uv.toast('请阅读并同意用户协议和隐私政策');
    return;
  }
  if (pageType.value == 'forgot') {
    onForgotPassword();
  } else if (pageType.value == 'register') {
    onRegister();
  }
};

// 修改并登录
const onForgotPassword = async () => {
  await appPasswordChange({
    phone: phone.value,
    smsCode: smsCode.value,
    password: password.value,
    checkPassword: checkPassword.value,
  });
  const { result } = await appPassLogin({
    phone: phone.value,
    password: password.value,
  });
  userStore.state_user = result;
  userStore.state_is_gestures_password = result?.userInfo?.isGesturesPassword;
  route({
    type: 'switchTab',
    url: 'pages/home/index',
  });
};

// 注册并登录
const onRegister = async () => {
  await appRegister({
    phone: phone.value,
    smsCode: smsCode.value,
    password: password.value,
    checkPassword: checkPassword.value,
  });
  const { result } = await appPassLogin({
    phone: phone.value,
    password: password.value,
  });
  userStore.state_user = result;
  userStore.state_is_gestures_password = result?.userInfo?.isGesturesPassword;
  route({
    type: 'switchTab',
    url: 'pages/home/index',
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
  .login-phone {
    margin-top: 370rpx;
    &-check {
      margin-top: 60rpx;
    }
  }
}
</style>
