<template>
  <view class="resume-contant flex-column">
    <view class="flex1">
      <view class="field-item">
        <!-- <p class="label">工作城市</p> -->
        <uv-textarea
          v-model="personalResume"
          placeholder="请输入个人简介"
          border="bottom"
          height="500"
          maxlength="500"
        ></uv-textarea>
      </view>
    </view>
    <view class="resume-contant-footer flex0 flex-center">
      <p class="del-btn flex-center" @click.stop="modal?.open()">删除</p>
      <p class="save-btn flex-center" @click.stop="onSave">保存</p>
    </view>
    <uv-modal
      ref="modal"
      title="提示"
      showCancelButton
      content="确认删除个人简介?"
      @confirm="confirmDel"
    ></uv-modal>
  </view>
</template>

<script setup>
import { ref } from "vue";
import {  getMyResume, editResumeBaseInfo } from "@/api/recruit";
import { onLoad } from "@dcloudio/uni-app";
const modal = ref();

const form = ref({
  desiredPosition: "", // 期望职位
  salaryMin: "3", // 最低薪资
  salaryMax: "4", // 最高薪资
});
const personalResume = ref("");
const info = ref({});
const initData = async (id) => {
  const data = await getMyResume();
  personalResume.value = data?.result?.personalResume;
};
onLoad((params) => {
  initData();
});

const onSave = async () => {
  await editResumeBaseInfo({
    personalResume: personalResume.value,
    type: 2,
  });
  uni.navigateBack({
    delta: 1,
  });
};
const confirmDel = async () => {
  await editResumeBaseInfo({
    personalResume: "",
    type: 2,
  });
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
    // &::after {
    //   position: absolute;
    //   right: 0;
    //   bottom: 0;
    //   left: 0;
    //   height: 1rpx;
    //   content: "";
    //   background-color: #17bcef;
    //   transform: scaleY(0.5);
    // }
    .label {
      font-size: 28rpx;
      padding-left: 4rpx;
      color: #777777;
    }
    .salary {
      padding: 16rpx 0 30rpx;
      color: #333333;
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
  .uv-border-bottom {
    border-bottom-width: 0 !important;
  }
}
</style>
