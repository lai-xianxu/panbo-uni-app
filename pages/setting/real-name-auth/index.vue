<template>
  <nav-bar-page class="pb-page real-name-auth">
    <view class="real-name-content">
      <uni-forms
        ref="editFormRef"
        :modelValue="formData"
        :rules="formRules"
        :label-width="150"
      >
        <uni-forms-item label="姓名" name="name">
          <uni-easyinput
            type="text"
            v-model="formData.name"
            placeholder="在此输入姓名"
            :clearable="false"
            trim
            :inputBorder="false"
          />
        </uni-forms-item>
        <uni-forms-item label="证件类型" name="documentType">
          <view class="fsc" @click.stop="onChoose">
            <view
              class="select-text"
              :class="{ c333: formData.documentType }"
              >{{ formData.documentType ? pickerLabel : '请选择' }}</view
            >
            <image
              src="@/static/common/right-arrow.png"
              mode="aspectFit"
              class="forms-item-icon"
            />
          </view>
        </uni-forms-item>
        <uni-forms-item label="证件号码" name="documentNo">
          <uni-easyinput
            type="number"
            v-model="formData.documentNo"
            placeholder="在此输入证件号码"
            :clearable="false"
            trim
            :inputBorder="false"
          />
        </uni-forms-item>

        <uni-forms-item label="上传照片"> </uni-forms-item>
        <view class="picture-box fss fw">
          <view
            class="picture-item fcc"
            @click.stop="select_change('frontImgUrl')"
          >
            <image
              v-if="formData.frontImgUrl"
              class="img"
              mode="aspectFill"
              :src="formData.frontImgUrl"
            >
            </image>
            <text v-else>身份证正面照</text>
          </view>
          <view
            class="picture-item fcc"
            @click.stop="select_change('oppositeImgUrl')"
          >
            <image
              v-if="formData.oppositeImgUrl"
              class="img"
              mode="aspectFill"
              :src="formData.oppositeImgUrl"
            >
            </image>
            <text v-else>身份证背面照</text>
          </view>
          <view
            class="picture-item fcc"
            @click.stop="select_change('handImgUrl')"
          >
            <image
              v-if="formData.handImgUrl"
              class="img"
              mode="aspectFill"
              :src="formData.handImgUrl"
            >
            </image>
            <text v-else>手持身份证照</text>
          </view>
        </view>
      </uni-forms>
    </view>

    <uv-button
      :throttleTime="300"
      shape="square"
      text="提交认证"
      class="real-name-auth-btn"
      @click="onSubmit"
    ></uv-button>

    <uv-picker
      ref="pickerRef"
      :columns="columns"
      keyName="label"
      round="30rpx"
      @confirm="confirm"
    ></uv-picker>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import { uploadApi } from '@/utils/upload';
import { appAddSysUserDocument } from '@/api/my';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { appGetUser } from '@/api/login';

// 表单
const formData = ref({
  name: '',
  documentType: '',
  documentNo: '',
  frontImgUrl: '',
  oppositeImgUrl: '',
  handImgUrl: '',
});

const formRules = {
  name: {
    rules: [
      {
        required: true,
        errorMessage: '请输入姓名',
      },
    ],
  },
  documentType: {
    rules: [
      {
        required: true,
        errorMessage: '请选择证件类型',
      },
    ],
  },
  documentNo: {
    rules: [
      {
        required: true,
        errorMessage: '请输入证件号码',
      },
    ],
  },
};

// 证件类型
const pickerRef = ref(null);
const pickerLabel = ref('');
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
const onChoose = () => {
  pickerRef.value.open();
};
const confirm = (e) => {
  formData.value.documentType = e?.value?.[0]?.id || 100;
  pickerLabel.value = e?.value?.[0]?.label;
};

// 身份证 上传
const select_change = (name) => {
  uni.chooseImage({
    count: 1, //默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 相册和拍照
    success: async (res) => {
      const data = await uploadApi(res.tempFilePaths[0]);
      formData.value[name] = data.message;
    },
  });
};

// 修改
const editFormRef = ref(null);
const onSubmit = async () => {
  await editFormRef.value.validate();
  if (!formData.value.frontImgUrl) {
    uni.$uv.toast('请上传身份证正面照');
    return;
  }
  if (!formData.value.oppositeImgUrl) {
    uni.$uv.toast('请上传身份证背面照');
    return;
  }
  if (!formData.value.handImgUrl) {
    uni.$uv.toast('请上传手持身份证照');
    return;
  }
  await appAddSysUserDocument(formData.value);
  await appGetUser();
  uni.$uv.toast('提交成功');
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
    padding: 30rpx 30rpx 0;
    .select-text {
      flex: 1;
      font-size: 28rpx;
      line-height: 28rpx;
      font-weight: 400;
      color: #999;
      text-align: right;
    }
    .forms-item-icon {
      width: 28rpx;
      height: 28rpx;
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
        .img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .real-name-auth-btn {
    position: absolute;
    left: 0;
    bottom: 60rpx;
  }
}
</style>
