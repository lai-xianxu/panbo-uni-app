<template>
  <uv-popup ref="popupRef" mode="center" @change="change">
    <view class="pb-popup pb-page">
      <view class="popup-header fsbc">
        <image
          src="@/static/common/del.png"
          class="header-left"
          @click.stop="onClose"
        />
        <view class="header-center">请选择支付方式</view>
        <view></view>
      </view>

      <view class="popup-content">
        <view class="pay-type" v-for="item in radioOptions" :key="item.cardType">
          <view class="fsbc" @click.stop="radioValue = item">
            <view class="fsc">
              <image :src="item.img" class="pay-img" />
              <text>{{ item.cardTypeDis }}</text>
            </view>
            <image
              :src="
                radioValue?.cardType == item.cardType
                  ? radioActiveIcon
                  : radioIcon
              "
              class="pay-radio"
            />
          </view>
        </view>
      </view>

      <view class="popup-footer">
        <view class="footer-liner"></view>
        <uv-button
          :throttleTime="300"
          shape="square"
          text="确定"
          @click="onSave"
        ></uv-button>
      </view>
    </view>
  </uv-popup>
</template>

<script setup>
import { ref, watch } from 'vue';
import { appPdUserCardList } from '@/api/my';
import wechat from '@/static/common/wechat.png';
import alipay from '@/static/common/alipay.png';
import amountMoney from '@/static/my/amount-money.png';
import radioIcon from '@/static/common/radio.png';
import radioActiveIcon from '@/static/common/radio-active.png';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue', 'save']);

// v-model
const popupRef = ref(null);
const onClose = () => {
  popupRef.value.close();
};
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      popupRef.value.open();
    } else {
      onClose();
    }
  }
);
const change = (val) => {
  emit('update:modelValue', val.show);
};

// 获取选项
const radioOptions = ref([
  // {
  //   cardTypeDis: '微信',
  //   cardType: 'wxpay',
  //   img: wechat,
  // },
  {
    cardTypeDis: '支付宝',
    cardType: 'alipay',
    img: alipay,
  },
]);
const radioValue = ref({});
const getCardType = async () => {
  if (props.type == 'withdraw') {
    const { result } = await appPdUserCardList();
    radioOptions.value = result.pdUserCardDtoList;
  }
  if (props.type == 'periodical') {
    radioOptions.value = [
      {
        cardTypeDis: '余额',
        cardType: 'balance',
        img: amountMoney,
      },
      ...radioOptions.value,
    ];
  }
  // const { result } = await appPdUserCardList();
  // radioOptions.value = [
  //   ...(props.type == 'withdraw' ? [] : radioOptions.value),
  //   ...result.pdUserCardDtoList,
  // ];
  radioValue.value = radioOptions.value[0];
  // 初始化
  emit('save', radioValue.value);
};
getCardType();

// 选择
const onSave = () => {
  emit('save', radioValue.value);
  onClose();
};
</script>

<style scoped lang="scss">
.pb-popup {
  width: 670rpx;
  background: #ffffff;
  .popup-header {
    width: 100%;
    height: 100rpx;
    background: linear-gradient(0deg, #17bcef 0%, #378cfd 100%);
    padding: 0 30rpx;
    .header-left {
      width: 24rpx;
      height: 24rpx;
    }
    .header-center {
      font-size: 28rpx;
      font-weight: 400;
      color: #ffffff;
    }
  }
  .popup-content {
    width: 100%;
    max-height: 495rpx;
    padding: 0 30rpx 30rpx;
    overflow: auto;
    .pay-type {
      padding: 30rpx;
      border-bottom: 1rpx solid #2dc2f0;
      text {
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 400;
        color: #333333;
        margin-left: 10rpx;
      }
      .pay-img {
        width: 36rpx;
        height: 36rpx;
      }
      .pay-radio {
        width: 32rpx;
        height: 32rpx;
      }
    }
  }
  .popup-footer {
    margin-top: -70rpx;
    margin-bottom: 30rpx;
    .footer-liner {
      width: 100%;
      height: 100rpx;
      background: linear-gradient(0deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%)
        rgba(255, 255, 255, 0);
    }
  }
}
:deep() {
  .uv-popup__content {
    border-radius: 20rpx;
    overflow: hidden;
  }
}
</style>
