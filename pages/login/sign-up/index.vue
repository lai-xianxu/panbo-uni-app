<template>
  <nav-bar-page
    class="login-new pb-page"
    contentClass="fsc-c"
    :isNavBar="false"
    :isStatus="false"
  >
    <view v-html="video" class="video-bg"></view>
    <div class="mask"></div>

    <div class="fss-c login-content">
      <view class="pb-welcome">注册账号</view>
      <view class="pb-desc">请输入您的手机号码进行账号注册</view>
      <view class="login-phone fsc">
        <text class="login-phone-qh">+86</text>
        <uv-input
          v-model="phone"
          type="number"
          placeholder="输入手机号码"
          border="none"
          fontSize="34rpx"
          clearable
        ></uv-input>
      </view>

      <div class="login-button fcc" @click="onNext">下一步</div>
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
              <text @click.stop="onAgreement('/static/agreement.html')"
                >用户协议</text
              >
              和
              <text @click.stop="onPrivary">隐私政策</text>
            </div>
          </uv-radio>
        </uv-radio-group>
      </div>
    </div>
  </nav-bar-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const video = ref(
  `<video controlslist="nodownload nofullscreen noremoteplayback noplaybackrate"	src="https://demo-cos.weiling.cn/1356898121111711744/1696835620WR7KNbC.mp4" poster="https://demo-cos.weiling.cn/1356898121111711744/1696835711XwxpCwp.jpg" autoplay loop muted webkit-playsinline="" playsinline="" style="width: 100%; height: 100%; object-fit: cover;"></video>`
);

// 初始化
const phone = ref('');
onLoad((params) => {
  phone.value = params.phone || '';
});

const radiovalue = ref('');

// 下一步
const onNext = () => {
  if (!phone.value) {
    uni.$uv.toast('请输入手机号');
    return;
  }
  if (radiovalue.value != 'agree') {
    uni.$uv.toast('请阅读并同意用户协议和隐私政策');
    return;
  }
  route('pages/login/code-login/index', {
    phone: phone.value,
    type: 'register',
  });
};

// 查看协议
const onAgreement = (url, title) => {
  // plus.runtime.openURL('/static/agreement.html');
  route('pages/login/web-view/index', {
    url,
    title,
  });
};
const onPrivary = () => {
  plus.runtime.openWeb('http://site.skyun.com.cn/privacy.html');
};
</script>

<style lang="scss">
@import '@/static/scss/login.scss';
</style>
