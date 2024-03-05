<template>
  <nav-bar-page class="edit-info">
    <view class="edit-info-save" @click.stop="onSave">保存</view>
    <uv-input
      v-model="userName"
      placeholder="请输入内容"
      border="bottom"
    ></uv-input>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import { appUpdateUser, appGetUser } from '@/api/login';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const userName = ref(userStore.getters_user_info?.username || '');
const onSave = async () => {
  await appUpdateUser({
    userName: userName.value,
    type: 1,
  });
  const { result } = await appGetUser();
  userStore.state_user.userInfo = { ...userStore.getters_user_info, ...result };
  uni.$uv.toast('修改成功');
  setTimeout(() => {
    route({ type: 'navigateBack' });
  }, 500);
};
</script>

<style scoped lang="scss">
.edit-info {
  .edit-info-save {
    position: absolute;
    right: 30rpx;
    top: 30rpx;
    font-size: 26rpx;
    border-radius: 8rpx;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
    background: linear-gradient(0deg, #17bcef 0%, #25a8f5 100%);
    padding: 6rpx 12rpx;
    color: #fff;
  }
}
</style>
