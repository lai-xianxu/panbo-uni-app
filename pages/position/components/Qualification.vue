<template>
  <view class="resume-contant flex-column">
    <view class="flex1">
      <view class="field-item">
        <p class="label">添加新的资格证书</p>
        <view class="flex-row cross-center">
          <uv-input
            v-model="form.certificateName"
            placeholder="请输入资格证书"
            border="bottom"
          ></uv-input>
          <span class="add-btn" @click="onAdd">添加</span>
        </view>
      </view>
      <view class="qualifica-wrap flex-row flex-wrap" v-if="list.length">
        <view
          class="qualifica-item flex-center"
          v-for="(item, i) in list"
          :key="item"
        >
          {{ item }}<image class="icon" @click.stop="onDel(i)" src="@/static/common/del.png" />
        </view>
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
      content="确认删除全部资格证书?"
      @confirm="confirmDel"
    ></uv-modal>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { editResumeBaseInfo, getMyResume } from "@/api/recruit";
import { onLoad } from "@dcloudio/uni-app";

const modal = ref();
const form = ref({
  certificateName: "",
});
const list = ref([]);
onLoad(async () => {
  const data = await getMyResume();
  list.value = data?.result?.certificateNameList || [];
});

const onAdd = () => {
  list.value.push(form.value.certificateName);
  form.value.certificateName = "";
};
const onDel = (i) => {
    list.value.splice(i, 1);
}
const onSave = async () => {
  await editResumeBaseInfo({
    certificateName: list.value.join(","),
    type: 4,
  });
  uni.navigateBack({
    delta: 1,
  });
};
const confirmDel = async() => {
  await editResumeBaseInfo({
    certificateName: "",
    type: 4,
  });
  uni.navigateBack({
    delta: 1,
  });
}
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
    .salary {
      padding: 16rpx 0 30rpx;
      color: #333333;
    }
  }
}
.qualifica-wrap {
  .qualifica-item {
    padding: 0 35rpx;
    height: 60rpx;
    background: #17bcef;
    border-radius: 8rpx;
    color: #fff;
    margin: 0 20rpx 20rpx 0;
    .icon {
      width: 24rpx;
      height: 24rpx;
      margin-left: 16rpx;
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
.add-btn {
  font-size: 28rpx;
  color: #17bcef;
}
</style>
