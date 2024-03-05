<template>
  <uv-popup ref="popupRef" mode="center" @change="change">
    <view class="pb-popup pb-page">
      <view class="popup-header fsbc">
        <image
          src="@/static/common/del.png"
          class="header-left"
          @click.stop="onClose"
        />
        <view class="header-center">信用卡办理申请授权书</view>
        <view></view>
      </view>

      <view class="popup-content" v-html="agreementText"></view>

      <view class="popup-footer">
        <view class="footer-liner"></view>
        <uv-button
          :throttleTime="300"
          shape="square"
          :text="`确认`"
          @click="onSave"
        ></uv-button>
      </view>
    </view>
  </uv-popup>
</template>

<script setup>
import { ref, watch } from 'vue';
import { appGetAgreement } from '@/api/login';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
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
      getAgreement();
      popupRef.value.open();
    } else {
      onClose();
    }
  }
);
const change = (val) => {
  emit('update:modelValue', val.show);
};

// 授权书文案
const agreementText = ref('');
const getAgreement = async () => {
  const { result } = await appGetAgreement();
  agreementText.value = result.text.replace(/\n/g, '<br>');
};

const onSave = () => {
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
    padding: 30rpx;
    font-size: 28rpx;
    line-height: 28rpx;
    overflow: auto;
  }
  .popup-footer {
    position: relative;
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
