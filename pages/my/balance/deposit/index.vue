<template>
  <nav-bar-page padding="0 30rpx 30rpx" class="pb-page">
    <view class="deposit-card">
      <view class="deposit-title">{{ titleText[pageType] }}</view>

      <view class="fsbc" @click.stop="popupShow = true">
        <view class="fsc">
          <image :src="payTypeMap.img" class="card-bank-img" />
          <view class="deposit-card-bank">{{ payTypeMap.cardTypeDis }}</view>
        </view>
        <image class="card-icon" src="@/static/common/right-arrow.png" />
      </view>

      <view class="money-text">{{ moneyText[pageType] }}</view>
      <view class="fsc money-input">
        <view class="input-left fsc"
          >￥
          <uv-input
            placeholder="请输入金额"
            border="none"
            type="number"
            fontSize="48rpx"
            v-model="moneyValue"
          ></uv-input>
        </view>
        <view
          class="input-balance"
          v-if="pageType == 'withdraw' || payTypeMap.cardType == 'balance'"
        >
          可用余额：￥{{ userStore.getters_balance_data?.availableBalance }}
        </view>
      </view>

      <view v-if="pageType == 'periodical'" class="deposit-time fss">
        <view class="deposit-time-text">存入时间</view>
        <view class="fss fw">
          <view
            v-for="item in timeOptions"
            :key="item.term"
            class="deposit-tag fcc mb30"
            :class="{ 'deposit-tag--active': item.term == depositTime?.term }"
            @click.stop="depositTime = item"
            >{{ item.term_dictText }}</view
          >
        </view>
      </view>
      <view v-if="pageType == 'periodical'" class="deposit-time fsc">
        <view class="deposit-time-text">存入利率</view>
        <view class="deposit-time-text">{{ depositTime.amount }}</view>
      </view>

      <uv-button
        :throttleTime="300"
        shape="square"
        :text="btnText[pageType]"
        class="deposit-btn"
        @click="onSubmit"
      ></uv-button>
    </view>

    <pay-popup
      v-model="popupShow"
      :type="pageType"
      @save="onPopupSave"
    ></pay-popup>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import PayPopup from './pay-popup/index.vue';
import {
  alipayApi,
  appGetInterestRate,
  appPbWithdrawalsApply,
  appPbRegularSave,
} from '@/api/my';
import { useUserStore } from '@/stores/user';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';

const userStore = useUserStore();

const pageType = ref('');
onLoad((params) => {
  pageType.value = params.type || 'deposit';
  if (pageType.value == 'periodical') {
    getInterestRate();
  }
});

const btnText = {
  withdraw: '确认提现',
  periodical: '存入余额',
  deposit: '存入余额',
};
const titleText = {
  withdraw: '提现方式',
  periodical: '存入方式',
  deposit: '存入方式',
};
const moneyText = {
  withdraw: '提现金额',
  periodical: '转入金额',
  deposit: '转入金额',
};

// 定期、利率
const timeOptions = ref([]);
const depositTime = ref({});
const getInterestRate = async () => {
  const { result } = await appGetInterestRate({
    adjustmentType: 3,
  });
  timeOptions.value = result;
  depositTime.value = result[0];
};

// 支付方式
const popupShow = ref(false);
const payTypeMap = ref({});
const onPopupSave = (val) => {
  payTypeMap.value = val;
};

// 提交
const moneyValue = ref();
const onSubmit = () => {
  if (!moneyValue.value) {
    uni.$uv.toast('请输入金额');
    return;
  }
  if (
    pageType.value == 'withdraw' &&
    moneyValue.value > userStore.getters_balance_data?.availableBalance
  ) {
    uni.$uv.toast('余额不足');
    return;
  }
  if (
    payTypeMap.value.cardType == 'balance' &&
    moneyValue.value > userStore.getters_balance_data?.availableBalance
  ) {
    uni.$uv.toast('余额不足');
    return;
  }
  if (pageType.value == 'withdraw') {
    pbWithdrawalsApply();
    return;
  }
  if (
    pageType.value == 'periodical' &&
    payTypeMap.value.cardType == 'balance'
  ) {
    pbPeriodical(moneyValue.value);
    return;
  }
  alipay(moneyValue.value, pageType.value);
};

// 刷新余额
const refershBalance = () => {
  uni.$uv.toast(pageType.value == 'withdraw' ? '提现成功' : '存入成功');
  userStore.actions_get_balance_data();
  setTimeout(() => {
    route({ type: 'navigateBack' });
  }, 500);
};

// 定期存入
const pbPeriodical = async (mount) => {
  await appPbRegularSave({
    mount,
    stagesNumber: depositTime.value.term,
    type: payTypeMap.value.cardType == 'balance' ? 1 : 2,
  });
  refershBalance();
};

// 提现到银行卡
const pbWithdrawalsApply = async () => {
  await appPbWithdrawalsApply({
    mount: moneyValue.value,
    account: payTypeMap.value.cardNo,
  });
  uni.$uv.toast('已提交至后台审核，审核通过后打款');
  refershBalance();
};

// 支付
const alipay = async (money, pageType) => {
  uni.showLoading({
    mask: true,
  });
  let params = { description: '盘博-商品购买', total: money };
  const res = await alipayApi(params);
  if (res.code === 200) {
    const orderInfo = res.result;
    uni.requestPayment({
      provider: 'alipay', //固定值为"alipay"
      orderInfo: orderInfo, //此处为服务器返回的订单信息字符串
      success: function (res) {
        uni.hideLoading();
        const rawdata = JSON.parse(res.rawdata);
        const result = JSON.parse(rawdata.result);
        const { total_amount } = result.alipay_trade_app_pay_response;
        if (pageType == 'deposit') {
          refershBalance();
          return;
        }
        pbPeriodical(total_amount);
      },
      fail: function (err) {
        uni.hideLoading();
        uni.$uv.toast('支付失败');
      },
    });
  }
};
</script>

<style scoped lang="scss">
.deposit-card {
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 8rpx 0rpx rgba(12, 100, 127, 0.3);
  padding: 30rpx;
  .deposit-title {
    font-size: 28rpx;
    line-height: 28rpx;
    font-weight: 700;
    color: #333333;
    margin-bottom: 20rpx;
  }
  .card-bank-img {
    width: 28rpx;
    height: 28rpx;
    margin-right: 6rpx;
  }
  .deposit-card-bank {
    font-size: 28rpx;
    line-height: 28rpx;
    font-weight: 400;
    color: #333333;
  }
  .card-icon {
    width: 20rpx;
    height: 34rpx;
  }
  .money-text {
    font-size: 28rpx;
    line-height: 28rpx;
    font-weight: 400;
    color: #333333;
    margin-top: 65rpx;
  }
  .money-input {
    position: relative;
    width: 100%;
    border-bottom: 1rpx solid #17bcef;
    padding: 10rpx 0;
    margin-top: 30rpx;
    .input-left {
      font-size: 48rpx;
      line-height: 48rpx;
      font-weight: 700;
      color: #333333;
    }
    .input-balance {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      font-size: 28rpx;
      line-height: 28rpx;
      font-weight: 400;
      color: #aaaaaa;
    }
  }
  .deposit-time {
    margin-top: 70rpx;

    .deposit-time-text {
      margin-right: 40rpx;
      font-size: 28rpx;
      color: #333333;
      flex-shrink: 0;
    }
    .deposit-tag {
      width: 120rpx;
      height: 60rpx;
      border-radius: 20rpx;
      font-size: 28rpx;
      font-weight: 400;
      line-height: 28rpx;
      margin-right: 10rpx;
      border: 1rpx solid #333333;
      background-color: #fff;
      color: #333333;
      &--active {
        background: #17bcef;
        color: #ffffff;
        border: none;
      }
    }
  }
  .deposit-btn {
    position: absolute;
    bottom: 50rpx;
    left: 0;
  }
}
:deep() {
  .uni-input-placeholder {
    font-size: 32rpx;
    font-weight: 400;
  }
}
</style>
