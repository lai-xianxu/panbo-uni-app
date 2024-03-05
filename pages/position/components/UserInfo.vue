<template>
  <view class="resume-contant flex-column">
    <view class="flex1" style="overflow: auto;">
      <view class="field-item avatar-wrap flex-row main-between cross-center">
        <p class="label">头像</p>
        <image @click.stop="onChooseAvatar" :src="form.avatar" class="avatar" />
      </view>
      <view class="field-item">
        <p class="label">姓名</p>
        <uv-input
          v-model="form.realname"
          placeholder="请输入姓名"
          border="bottom"
        ></uv-input>
      </view>
      <view class="field-item">
        <p class="label">参加工作时间</p>
        <p class="time-range flex-row">
          <span
            class="flex1"
            :class="{ please: !form.startWorkingDate }"
            @click.stop="onOpen('startWorkingDate')"
            >{{ form.startWorkingDate || "请选择参选工作时间" }}</span
          >
        </p>
      </view>
      <view class="field-item">
        <p class="label">手机号码</p>
        <uv-input
          v-model="form.phone"
          placeholder="请输入手机号"
          border="bottom"
        ></uv-input>
      </view>
      <view class="field-item">
        <p class="label">微信号</p>
        <uv-input
          v-model="form.wechatId"
          placeholder="请输入微信号"
          border="bottom"
        ></uv-input>
      </view>
      <view class="field-item">
        <p class="label">出生年月</p>
        <p class="time-range flex-row">
          <span
            class="flex1"
            :class="{ please: !form.startWorkingDate }"
            @click.stop="onOpen('birthday')"
            >{{ form.birthday || "请选择出生年月" }}</span
          >
        </p>
      </view>
      <view class="field-item">
        <p class="label" @click="onOpenPicker">求职状态</p>
        <uv-input
          @click="onOpenPicker"
          :modelValue="form.jobStatus_dictText"
          placeholder="请选择求职状态"
          border="bottom"
          >{{ form.jobStatus_dictText }} ></uv-input
        >
      </view>
    </view>
    <view class="resume-contant-footer flex0 flex-center">
      <!-- <p class="del-btn flex-center" @click.stop="modal?.open()">删除</p> -->
      <p class="save-btn flex-center" @click.stop="onSave">保存</p>
    </view>
    <uv-datetime-picker
      ref="datetimePicker"
      v-model="time"
      mode="date"
      :minDate="631123200000"
      @confirm="confirm"
    >
    </uv-datetime-picker>
    <uv-modal
      ref="modal"
      title="提示"
      showCancelButton
      content="确认删除次教育经历?"
      @confirm="confirmDel"
    ></uv-modal>
    <jp-cropper-watermark
      :url="avatar"
      mode="fixed"
      :width="100"
      :height="100"
      @cancel="oncancel"
      @ok="handleCrop"
    ></jp-cropper-watermark>
    <uv-picker
      ref="tradePicker"
      :columns="tradeList"
      :defaultIndex="[defaultIndex]"
      keyName="text"
      visibleItemCount="8"
      @confirm="onTradeConfirm"
    ></uv-picker>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { uploadApi } from '@/utils/upload';

import {
  addEducation,
  getMyResume,
  updateEducation,
  deleteByEducation,
  editResumeBaseInfo,
  jobStatusDict
} from "@/api/recruit";
import { onLoad } from "@dcloudio/uni-app";
import dayjs from "@/uni_modules/uv-ui-tools/libs/util/dayjs.js";
const modal = ref();
const datetimePicker = ref();
const time = ref("1990-07-01");
let copyAvatar = "";
const form = ref({
  avatar: "",
  realname: "", // 姓名
  startWorkingDate: "", // 参加工作时间
  phone: "", //
  wechatId: "", // 微信号
  birthday: "", // 出生年月
});
let type = ""; //  admissionDate / graduationDate
const info = ref({});
let id = "";
const avatar = ref("")
const tradePicker = ref()
const tradeList = ref([])

// 上传
const onChooseAvatar = () => {
  uni.chooseImage({
    count: 1, //默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 相册和拍照
    success: async (res) => {
      form.value.avatar = res.tempFilePaths[0];
      avatar.value = form.value.avatar;
    },
  });
};

// 裁剪并修改
const handleCrop = async (e) => {
  const data = await uploadApi(e.base64 || e.path);
  oncancel();
  form.value.avatar = data.message;
};
const oncancel = () => {
    avatar.value = '';
    form.value.avatar = copyAvatar;
};

const initData = async () => {
  const data = await getMyResume();
  info.value = data?.result;
  form.value = {
    avatar: info.value?.sysUserVO?.avatar,
    realname: info.value?.sysUserVO?.realname, // 姓名
    startWorkingDate: info.value?.startWorkingDate, // 参加工作时间
    phone: info.value?.sysUserVO?.phone, //
    wechatId: info.value?.wechatId, // 微信号
    birthday: info.value?.sysUserVO?.birthday, // 出生年月
    jobStatus_dictText: info.value?.jobStatus_dictText,
    jobStatus: info.value?.jobStatus,
  };
  copyAvatar = info.value?.sysUserVO?.avatar
};
onLoad(async () => {
  const data = await jobStatusDict();
  tradeList.value = [data.result];
  initData();
});
const defaultIndex = computed(() => {
  return tradeList.value[0]?.findIndex(res => res.value == form.value.jobStatus)
})

const onOpen = (key) => {
  type = key;
  time.value = form.value[key];
  datetimePicker.value?.open();
};
const confirm = (e) => {
  form.value[type] = dayjs(+e.value).format("YYYY-MM-DD");
  console.log("confirm", e, form.value);
};
const onSave = async () => {
  await editResumeBaseInfo({
    ...form.value,
    type: 1,
  });
  uni.navigateBack({
    delta: 1,
  });
};
const confirmDel = async () => {
  if (id) {
    await deleteByEducation({ id });
  }
  uni.navigateBack({
    delta: 1,
  });
};
const onOpenPicker = () => {
  tradePicker.value?.open();
};
const onTradeConfirm = (res) => {
  console.log(res, 937467)
  form.value.jobStatus_dictText = res.value?.[0]?.text;
  form.value.jobStatus = res.value?.[0]?.value
};
</script>

<style scoped lang="scss">
.resume-contant {
  padding: 30rpx;
  &-footer {
    color: #ffffff;
    .del-btn {
      width: 200rpx;
      height: 80rpx;
      background: #aaaaaa;
      border-radius: 40rpx;
      box-shadow: -4rpx 0rpx 8rpx 4rpx rgba(119, 119, 119, 0.3);
    }
    .save-btn {
      width: 100%;
      height: 80rpx;
      background: linear-gradient(0deg, #17bcef 0%, #378cfd 100%);
      border-radius: 40rpx;
      box-shadow: -4rpx 0rpx 8rpx 4rpx rgba(12, 100, 127, 0.3);
      margin-left: 20rpx;
    }
  }
  .field-item {
    margin-bottom: 24rpx;
    position: relative;
    &::after {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 1rpx;
      content: "";
      background-color: #17bcef;
      transform: scaleY(0.5);
    }
    .label {
      font-size: 28rpx;
      padding-left: 4rpx;
      color: #777777;
    }
    .time-range {
      padding: 16rpx 10rpx 30rpx;
      color: #333333;
      .line {
        margin-right: 20rpx;
      }
    }
  }
}

:deep {
  .uv-input {
    padding: 16rpx 0 30rpx !important;
    border: none !important;
    .uni-input-input {
      color: #333333;
      font-size: 28rpx;
    }
  }
}
.avatar-wrap {
  padding: 0 0 30rpx;
}
.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  overflow: hidden;
}
.please {
  font-size: 20rpx;
}
:deep() {
    .uv-input .uni-input-input {
        font-size: 30rpx;
    }

}

</style>
