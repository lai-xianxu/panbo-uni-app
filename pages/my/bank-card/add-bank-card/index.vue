<template>
  <nav-bar-page class="pb-page real-name-auth">
    <view class="real-header">添加银行卡</view>
    <view class="real-name-content">
      <uni-forms
        ref="editFormRef"
        :modelValue="formData"
        :rules="formRules"
        :label-width="120"
      >
        <uni-forms-item label="卡号" name="cardNo">
          <view class="fsc">
            <uni-easyinput
              type="number"
              v-model="formData.cardNo"
              placeholder="输入本人银行卡号"
              :clearable="false"
              trim
              :inputBorder="false"
            />
          </view>
        </uni-forms-item>
        <uni-forms-item label="卡类型" name="cardType">
          <view class="fsc" @click.stop="onChoose('bank')">
            <view class="select-text" :class="{ c333: formData.cardType }">{{
              formLabel.cardName || '请选择'
            }}</view>
            <image
              src="@/static/common/right-arrow.png"
              mode="aspectFit"
              class="forms-item-icon"
            />
          </view>
        </uni-forms-item>
        <uni-forms-item label="国家/地区" name="areaId">
          <view class="fsc" @click.stop="onChoose('area')">
            <view class="select-text" :class="{ c333: formData.areaId }">{{
              formLabel.areaName || '请选择'
            }}</view>
            <image
              src="@/static/common/right-arrow.png"
              mode="aspectFit"
              class="forms-item-icon"
            />
          </view>
        </uni-forms-item>
        <uni-forms-item label="手机号码" name="phone">
          <view class="fsc">
            <uni-easyinput
              type="number"
              v-model="formData.phone"
              placeholder="输入手机号码"
              :clearable="false"
              trim
              :inputBorder="false"
            />
          </view>
        </uni-forms-item>
      </uni-forms>
    </view>
    <uv-button
      :throttleTime="300"
      shape="square"
      text="绑定银行卡"
      class="real-name-auth-btn"
      @click="onSubmit"
    ></uv-button>

    <IndexList v-model="typeShow" :type="popupType" @select="onSelect" />

    <uv-picker
      ref="pickerRef"
      :columns="columns"
      keyName="cardTypeDis"
      round="30rpx"
      @confirm="confirm"
    ></uv-picker>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { onLoad } from '@dcloudio/uni-app';
import IndexList from '../index-list/index.vue';
import { appAddPdUserCard, appGetCardType } from '@/api/my';

const transactionPassword = ref('');
onLoad((params) => {
  transactionPassword.value = params.transactionPassword;
});

// 表单
const formData = ref({
  cardNo: '',
  phone: '',
  cardType: '',
  areaId: '',
  useType: 1, // 储蓄卡
});
const formLabel = ref({
  cardName: '',
  areaName: '',
});

const formRules = {
  phone: {
    rules: [
      {
        required: true,
        errorMessage: '请输入手机号码',
      },
    ],
  },
  cardNo: {
    rules: [
      {
        required: true,
        errorMessage: '请输入卡号',
      },
    ],
  },
  cardType: {
    rules: [
      {
        required: true,
        errorMessage: '请选择卡类型',
      },
    ],
  },
  areaId: {
    rules: [
      {
        required: true,
        errorMessage: '请选择国家/地区',
      },
    ],
  },
};

// 选择
const typeShow = ref(false);
const popupType = ref('');
const onChoose = (type) => {
  if (type == 'bank') {
    pickerRef.value.open();
    return;
  }
  popupType.value = type;
  typeShow.value = true;
};

const onSelect = (e) => {
  if (e.type == 'bank') {
    // formData.value.cardType = e.value.value;
    // formLabel.value.cardName = e.value.label;
  } else {
    formData.value.areaId = e.value.id;
    formLabel.value.areaName = e.value.areaName;
  }
};

// 证件类型
const pickerRef = ref(null);
const columns = ref([
  [
    {
      label: '身份证',
      id: 100,
    },
    {
      label: '护照',
      id: 200,
    },
  ],
]);
const getCardType = async () => {
  const { result } = await appGetCardType();
  columns.value = [result.pdUserCardDtoList];
};
getCardType();
const confirm = (e) => {
  formData.value.cardType = e?.value?.[0]?.cardType || '';
  formLabel.value.cardName = e?.value?.[0]?.cardTypeDis || '';
};

// 修改
const editFormRef = ref(null);
const onSubmit = async () => {
  await editFormRef.value.validate();
  await appAddPdUserCard({
    ...formData.value,
    transactionPassword: transactionPassword.value,
  });
  uni.$uv.toast('绑定成功');
  setTimeout(() => {
    route({ type: 'navigateBack' });
  }, 500);
};
</script>

<style scoped lang="scss">
.real-name-auth {
  position: relative;
  .real-name-content {
    width: 100%;
    background: #ffffff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 8rpx 0rpx rgba(12, 100, 127, 0.3);
    padding: 30rpx;
    .select-text {
      flex: 1;
      font-size: 28rpx;
      line-height: 28rpx;
      font-weight: 400;
      color: #999;
    }
    .picture-box {
      .picture-item {
        width: 267rpx;
        height: 200rpx;
        background: #f7f7f7;
        border-radius: 20rpx;
        font-size: 28rpx;
        font-weight: 400;
        color: #aaaaaa;
        line-height: 36rpx;
        margin-right: 30rpx;
        margin-bottom: 30rpx;
      }
    }
    .forms-item-icon {
      width: 28rpx;
      height: 28rpx;
    }
  }
  .real-name-auth-btn {
    margin-top: 60rpx;
  }
}
:deep() {
  .uni-forms {
    .uni-forms-item {
      .uni-easyinput__content {
        text-align: left;
        .uni-input-placeholder,
        .uni-input-input {
          text-align: left;
        }
      }
      .uni-forms-item__error {
        left: 0;
        right: inherit;
      }
    }
  }
}
</style>
