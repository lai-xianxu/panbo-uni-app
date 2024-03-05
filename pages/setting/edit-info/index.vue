<template>
  <nav-bar-page class="edit-info pb-page">
    <view class="edit-info-card">
      <uni-forms
        ref="editFormRef"
        :modelValue="formData"
        :rules="formRules"
        :label-width="150"
      >
        <uni-forms-item label="手机号码" name="phone">
          <uni-easyinput
            type="text"
            v-model="formData.phone"
            placeholder="在此输入手机号码"
            :clearable="false"
            trim
            :inputBorder="false"
          />
        </uni-forms-item>
        <view class="fec">
          <view class="fcc get-code" @click.stop="onGetCode">获取验证码</view>
        </view>
        <uni-forms-item label="验证码" name="smsCode">
          <uni-easyinput
            type="number"
            v-model="formData.smsCode"
            placeholder="在此输入验证码"
            :clearable="false"
            trim
            :inputBorder="false"
          />
        </uni-forms-item>
        <uni-forms-item
          :label="formLabelMap1[pageType].label"
          name="inputValue3"
        >
          <uni-easyinput
            :type="pageType == 'password' ? 'password' : 'number'"
            v-model="formData.inputValue3"
            :placeholder="formLabelMap1[pageType].placeholder"
            :clearable="false"
            trim
            :inputBorder="false"
          />
        </uni-forms-item>
        <uni-forms-item
          :label="formLabelMap2[pageType].label"
          name="inputValue4"
        >
          <uni-easyinput
            :type="pageType == 'password' ? 'password' : 'number'"
            v-model="formData.inputValue4"
            :placeholder="formLabelMap2[pageType].placeholder"
            :clearable="false"
            trim
            :inputBorder="false"
          />
        </uni-forms-item>
      </uni-forms>
    </view>

    <uv-button
      :throttleTime="300"
      shape="square"
      text="确认修改"
      @click="submit"
    ></uv-button>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { appSms, appUpdateUser } from '@/api/login';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const pageType = ref('password');
onLoad((params) => {
  pageType.value = params.type || 'password';
});

// 静态文本
const formLabelMap1 = {
  password: {
    label: '修改新密码',
    placeholder: '在此输入新密码',
  },
  transactionPassword: {
    label: '修改新交易密码',
    placeholder: '在此输入新密码',
  },
  phone: {
    label: '修改新手机号码',
    placeholder: '在此输入新手机号码',
  },
};
const formLabelMap2 = {
  password: {
    label: '再次输入新密码',
    placeholder: '再次输入新密码',
  },
  transactionPassword: {
    label: '再次输入新密码',
    placeholder: '再次输入新密码',
  },
  phone: {
    label: '再次输入新手机号码',
    placeholder: '再次输入新手机号码',
  },
};

// 表单
const formData = ref({
  phone: userStore.getters_user_info.phone,
  smsCode: '',
  inputValue3: '',
  inputValue4: '',
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
  smsCode: {
    rules: [
      {
        required: true,
        errorMessage: '请输入验证码',
      },
    ],
  },
  inputValue3: {
    rules: [
      {
        required: true,
        errorMessage: `请${formLabelMap1[pageType.value].placeholder}`,
      },
    ],
  },
  inputValue4: {
    rules: [
      {
        required: true,
        errorMessage: `请${formLabelMap2[pageType.value].placeholder}`,
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
    smsMode: 0,
  });
};

// 修改
const editFormRef = ref(null);
const submit = async () => {
  await editFormRef.value.validate();
  if (formData.value.inputValue3 !== formData.value.inputValue4) {
    uni.$uv.toast('两次输入的密码不一致');
    return;
  }
  if (
    pageType.value == 'transactionPassword' &&
    formData.value.inputValue3.length !== 6
  ) {
    uni.$uv.toast('交易密码长度为6位');
    return;
  }
  let params = {
    smsCode: formData.value.smsCode,
  };
  if (pageType.value == 'password') {
    params = {
      password: formData.value.inputValue3,
      checkPassword: formData.value.inputValue4,
      type: 2,
      ...params,
    };
  } else if (pageType.value == 'transactionPassword') {
    params = {
      transactionPassword: formData.value.inputValue3,
      checkTransactionPassword: formData.value.inputValue4,
      type: 3,
      ...params,
    };
  } else if (pageType.value == 'phone') {
    params = {
      newPhone: formData.value.inputValue3,
      checkNewPhone: formData.value.inputValue4,
      type: 4,
      ...params,
    };
  }
  await appUpdateUser(params);
  console.log(pageType.value, 'pageType.value');
  if (pageType.value == 'password' || pageType.value == 'phone') {
    uni.$uv.toast('修改成功，请重新登录');
    userStore.state_user = {};
    route('pages/login/index');
    return;
  }
  uni.$uv.toast('修改成功');
  setTimeout(() => {
    route({ type: 'navigateBack' });
  }, 500);
};
</script>

<style scoped lang="scss">
.edit-info {
  .edit-info-card {
    width: 100%;
    background: #ffffff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 8rpx 0 rgba(12, 100, 127, 0.3);
    padding: 30rpx;
    margin-bottom: 30rpx;
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
  }
}
</style>
