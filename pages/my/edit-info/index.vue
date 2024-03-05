<template>
  <view>
    <nav-bar-page class="edit-info pb-page">
      <view class="edit-info-card">
        <uni-forms ref="editFormRef" :modelValue="formData" :label-width="100">
          <uni-forms-item label="头像">
            <view class="fec" @click.stop="onChooseAvatar">
              <image
                :src="userInfo.avatar ? userInfo.avatar : userAvatar"
                mode="aspectFit"
                class="forms-item-avatar"
              />
              <image
                src="@/static/common/right-arrow.png"
                mode="aspectFit"
                class="forms-item-icon"
              />
            </view>
          </uni-forms-item>
          <!-- <uni-forms-item label="名称">
            <view
              class="fsc"
              @click.stop="route('pages/my/edit-info/edit-input/index')"
            >
              <view class="select-text" :class="{ c333: userInfo.username }">{{
                userInfo.username ? userInfo.username : '请输入'
              }}</view>
              <image
                src="@/static/common/right-arrow.png"
                mode="aspectFit"
                class="forms-item-icon"
              />
            </view>
          </uni-forms-item> -->
        </uni-forms>
      </view>
    </nav-bar-page>
    <jp-cropper-watermark
      :url="formData.avatar"
      mode="fixed"
      :width="100"
      :height="100"
      @cancel="oncancel"
      @ok="handleCrop"
    ></jp-cropper-watermark>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { appUpdateUser, appGetUser } from '@/api/login';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { useUserStore } from '@/stores/user';
import userAvatar from '@/static/my/user-avatar.png';
import { uploadApi } from '@/utils/upload';

const userStore = useUserStore();

const userInfo = computed(() => userStore.getters_user_info || {});
const formData = ref({
  avatar: '',
  userName: '',
});

// 上传
const onChooseAvatar = () => {
  uni.chooseImage({
    count: 1, //默认9
    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], // 相册和拍照
    success: async (res) => {
      formData.value.avatar = res.tempFilePaths[0];
    },
  });
};

// 裁剪并修改
const handleCrop = async (e) => {
  const data = await uploadApi(e.base64 || e.path);
  oncancel();
  await appUpdateUser({
    avatar: data.message,
    type: 1,
  });
  const { result } = await appGetUser();
  userStore.state_user.userInfo = { ...userStore.getters_user_info, ...result };
};
const oncancel = () => {
  formData.value.avatar = '';
};
</script>

<style scoped lang="scss">
.edit-info {
  .edit-info-card {
    width: 100%;
    background: #ffffff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 8rpx 0 rgba(12, 100, 127, 0.3);
    padding: 0 30rpx;
    margin-bottom: 30rpx;
    .select-text {
      flex: 1;
      font-size: 28rpx;
      line-height: 28rpx;
      font-weight: 400;
      color: #999;
      text-align: right;
      margin-right: 20rpx;
    }
    .forms-item-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }
    .forms-item-icon {
      width: 28rpx;
      height: 28rpx;
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
