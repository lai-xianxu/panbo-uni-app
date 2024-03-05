<template>
  <nav-bar-page class="login pb-page">
    <view class="fsc-c">
      <view class="pb-welcome">{{ from ? '输入密码' : '添加银行卡' }}</view>
      <view class="code-phone" v-if="!from">请输入支付密码，以验证身份。</view>
      <uv-code-input
        class="code-input"
        v-model="transactionPassword"
        :maxlength="6"
        :focus="true"
        size="80rpx"
        @finish="onAddCard"
      ></uv-code-input>
    </view>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { appAddPdUserCardCheck } from '@/api/my';
import { onLoad } from '@dcloudio/uni-app';
import { useRepayStore } from '@/stores/repay';

const repayStore = useRepayStore();
const transactionPassword = ref('');

const from = ref('');
const pageType = ref('');
onLoad((params) => {
  from.value = params.from;
  pageType.value = params?.type;
});

// 添加银行卡
const onAddCard = async () => {
  if (from.value) {
    uni.setStorageSync('scanPsw', transactionPassword.value);
    route({ type: 'navigateBack' });
    return;
  }
  await appAddPdUserCardCheck({
    transactionPassword: transactionPassword.value,
  });
  if (pageType.value == 'repay') {
    repayStore.state_repay_refresh = true;
    route({ type: 'navigateBack' });
    return;
  }
  route({
    type: 'redirect',
    url: 'pages/my/bank-card/add-bank-card/index',
    params: {
      transactionPassword: transactionPassword.value,
    },
  });
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
}
:deep(.uv-code-input__item) {
  width: 80rpx !important;
  height: 100rpx !important;
  background: #f2f2f2;
  border: none !important;
  border-radius: 8rpx;
}
</style>
