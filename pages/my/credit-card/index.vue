<template>
  <nav-bar-page class="credit-card pb-page" isWhiteArrow>
    <view class="credit-card-eontent">
      <div class="card-form">
        <uni-forms
          ref="formRef"
          :modelValue="formData"
          :rules="formRules"
          :label-width="100"
        >
          <view class="real-header m20">个人信息</view>
          <uni-forms-item label="姓名" name="userName">
            <uni-easyinput
              type="text"
              v-model="formData.userName"
              placeholder="请在此输入申请人姓名"
              :clearable="false"
              trim
              :inputBorder="false"
            />
          </uni-forms-item>
          <uni-forms-item label="身份证号码" name="documentNo">
            <uni-easyinput
              type="number"
              v-model="formData.documentNo"
              placeholder="请在此输入申请人身份证"
              :clearable="false"
              trim
              :inputBorder="false"
            />
          </uni-forms-item>
          <uni-forms-item label="手机号码" name="phone">
            <uni-easyinput
              type="number"
              v-model="formData.phone"
              placeholder="请在此输入申请人手机号"
              :clearable="false"
              trim
              :inputBorder="false"
            />
          </uni-forms-item>
          <view class="fec">
            <view class="fcc get-code" @click.stop="onGetCode">获取验证码</view>
          </view>
          <uni-forms-item label="验证码" name="code">
            <uni-easyinput
              type="number"
              v-model="formData.code"
              placeholder="请在此输入验证码"
              :clearable="false"
              trim
              :inputBorder="false"
            />
          </uni-forms-item>
        </uni-forms>

        <uni-forms
          ref="formAddressRef"
          :modelValue="formData"
          :rules="formRules"
          :label-width="100"
        >
          <view class="real-header m20">发卡地址</view>
          <uni-forms-item label="寄卡地址" name="provinceId">
            <view class="fsc" @click.stop="pickerShow = true">
              <view class="select-text" :class="{ c333: areaLabel }">{{
                areaLabel || '请选择省、市、区'
              }}</view>
              <image
                src="@/static/common/right-arrow.png"
                mode="aspectFit"
                class="forms-item-icon"
              />
            </view>
          </uni-forms-item>
          <uni-forms-item label="详细地址" name="detailAddress">
            <uni-easyinput
              v-model="formData.detailAddress"
              placeholder="请在此输入收卡详细地址"
              :clearable="false"
              trim
              :inputBorder="false"
            />
          </uni-forms-item>
        </uni-forms>

        <view class="tip-card">
          <view class="real-header m20">温馨提示</view>
          <view class="tip-text">
            1.点击“提交申请”即表示同意
            <text class="text-a" @click.stop="popupShow = true"
              >《信用卡办理申请授权书》</text
            >。<br />2.信用卡仅限本人使用，您的申卡信息将会传递给发
            卡银行用于审核信
          </view>
        </view>
      </div>

      <uv-button
        :throttleTime="300"
        shape="square"
        text="提交申请"
        style="margin-top: 30rpx"
        @click="submit"
      ></uv-button>
    </view>

    <empower-popup v-model="popupShow" />
    <area-picker v-model="pickerShow" @confirm="onAreaConfirm" />
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import { appAddPdUserCardApply } from '@/api/my';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { appSms } from '@/api/login';
import EmpowerPopup from './empower-popup/index.vue';
import AreaPicker from './area-picker/index.vue';

const popupShow = ref(false);
const pickerShow = ref(false);

const formData = ref({
  userName: '',
  documentNo: '',
  phone: '',
  code: '',
  provinceId: '',
  cityId: '',
  areaId: '',
  detailAddress: '',
});

const formRules = {
  userName: {
    rules: [
      {
        required: true,
        errorMessage: '请输入申请人姓名',
      },
    ],
  },
  documentNo: {
    rules: [
      {
        required: true,
        errorMessage: '请在此输入申请人身份证',
      },
    ],
  },
  phone: {
    rules: [
      {
        required: true,
        errorMessage: '请在此输入申请人手机号',
      },
    ],
  },
  code: {
    rules: [
      {
        required: true,
        errorMessage: '请在此输入验证码',
      },
    ],
  },
  provinceId: {
    rules: [
      {
        required: true,
        errorMessage: '请选择省、市、区',
      },
    ],
  },
  detailAddress: {
    rules: [
      {
        required: true,
        errorMessage: '请在此输入收卡详细地址',
      },
    ],
  },
};

// 获取验证码
const onGetCode = async () => {
  if (!formData.value.phone) {
    uni.$uv.toast('请输入手机号码');
    return;
  }
  await appSms({
    phone: formData.value.phone,
    smsMode: 3,
  });
};

// 地址确认
const areaLabel = ref('');
const onAreaConfirm = (val) => {
  console.log('val:', val);
  formData.value.provinceId = val[0].id;
  formData.value.cityId = val[1].id;
  formData.value.areaId = val[2].id;
  areaLabel.value = val.map((e) => e.name)?.join('/');
};

const formRef = ref(null);
const formAddressRef = ref(null);
const submit = async () => {
  addressValidate();
  await formRef.value.validate();
  if (!isAddressValidate.value) {
    return;
  }
  await appAddPdUserCardApply(formData.value);
  formData.value = {
    userName: '',
    documentNo: '',
    phone: '',
    code: '',
    provinceId: '',
    cityId: '',
    areaId: '',
    detailAddress: '',
  };
  areaLabel.value = '';
  uni.$uv.toast('申请成功');
};

// 地址填写验证
const isAddressValidate = ref(false);
const addressValidate = async () => {
  await formAddressRef.value.validate().catch(() => {
    isAddressValidate.value = false;
  });
  isAddressValidate.value = true;
};
</script>

<style scoped lang="scss">
.credit-card {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('@/static/my/credit-card-bg.png') no-repeat;
  background-size: cover;
  .credit-card-eontent {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 30rpx 50rpx;
    // margin-top: 600rpx;
    .card-form {
      height: 600rpx;
      overflow: auto;
    }
  }
  .fec {
    margin: 15rpx 0;
  }
  .get-code {
    display: inline-flex;
    padding: 0 20rpx;
    height: 60rpx;
    background: #17bcef;
    border-radius: 8rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #ffffff;
  }
  .select-text {
    flex: 1;
    font-size: 28rpx;
    line-height: 28rpx;
    font-weight: 400;
    color: #999;
    text-align: right;
  }
  .forms-item-icon {
    width: 26rpx;
    height: 26rpx;
    margin-left: 5rpx;
    margin-bottom: 2rpx;
  }
  .m20 {
    margin: 15rpx 0;
  }
  .tip-card {
    width: 100%;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
    border-radius: 20rpx;
    padding: 20rpx 30rpx 40rpx;
    margin-top: 30rpx;
    .tip-text {
      font-size: 28rpx;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      line-height: 48rpx;
      margin-top: 5rpx;
      .text-a {
        color: #5dcbf2;
      }
    }
  }
}
:deep(.uni-forms) {
  width: 100%;
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
  border-radius: 20rpx;
  padding: 20rpx 30rpx;
  margin-top: 30rpx;
}
</style>
