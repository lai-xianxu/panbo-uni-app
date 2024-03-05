<template>
  <view class="resume-contant flex-column">
    <view class="flex1">
      <view class="field-item">
        <p class="label">学校</p>
        <uv-input
          v-model="form.schoolName"
          placeholder="请输入学校"
          border="bottom"
        ></uv-input>
      </view>
      <view class="field-item">
        <p class="label">学历</p>
        <uv-input
          v-model="form.educationLevel"
          placeholder="请输入学历"
          border="bottom"
        ></uv-input>
      </view>
      <view class="field-item">
        <p class="label">专业</p>
        <uv-input
          v-model="form.major"
          placeholder="请输入专业"
          border="bottom"
        ></uv-input>
      </view>
      <view class="field-item">
        <p class="label">入学时间</p>
        <p class="time-range flex-row">
          <span class="flex1" @click.stop="onOpen('admissionDate')">{{
            form.admissionDate
          }}</span>
          <span class="line">-</span>
          <span class="flex1" @click.stop="onOpen('graduationDate')">{{
            form.graduationDate
          }}</span>
        </p>
      </view>
    </view>
    <view class="resume-contant-footer flex0 flex-center">
      <p class="del-btn flex-center" @click.stop="modal?.open()">删除</p>
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
  </view>
</template>

<script setup>
import { ref } from "vue";
import {
  addEducation,
  getMyResume,
  updateEducation,
  deleteByEducation,
} from "@/api/recruit";
import { onLoad } from "@dcloudio/uni-app";
import dayjs from "@/uni_modules/uv-ui-tools/libs/util/dayjs.js";
const modal = ref();
const datetimePicker = ref();
const time = ref("2015-07");
const form = ref({
  major: "", // 专业
  educationLevel: "", // 学历
  schoolName: "", // 学校
  admissionDate: "2015-07-01", // 入学时间
  graduationDate: "2016-07-01", // 毕业时间
});
let type = ""; //  admissionDate / graduationDate
const info = ref({});
let id = "";

const initData = async () => {
  const data = await getMyResume();
  info.value = data?.result;
  const list = data?.result?.pbEducationExperienceList || [];
  form.value = {...(list.find((res) => res.id == id) || {})};
};
onLoad((params) => {
  id = params.id;
  if(id) initData();
});

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
  if (id) {
    await updateEducation(form.value);
  } else {
    await addEducation(form.value);
  }
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
      width: 400rpx;
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
      padding: 16rpx 0 30rpx;
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
</style>
