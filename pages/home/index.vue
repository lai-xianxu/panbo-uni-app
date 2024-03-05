<template>
  <view class="home-wrap">
    <!-- <view class="home-wrap" :class="{ fixed: showUpdatePopup }"> -->
    <view class="home-header">
      <home-search />
      <home-swiper :list="bannerList" />
    </view>
    <home-nav v-if="!userStore.getters_is_new_user" class="hone-nav" />
    <home-message class="home-message" />
    <view class="home-message-wrap">
      <tab :list="tabList" v-model="active" @onTabChange="getInformation" />
      <home-msg-list :list="informationList" />
    </view>

    <!-- <update-popup v-model="showUpdatePopup" :desc="versionDesc" /> -->

    <uv-notify ref="notifyRef"></uv-notify>
  </view>
</template>

<script setup>
import homeSearch from './components/home-search/index.vue';
import homeSwiper from './components/home-swiper/index.vue';
import homeNav from './components/home-nav/index.vue';
import homeMessage from './components/home-message/index.vue';
import homeMsgList from './components/home-msg-list/index.vue';
import { ref, watch } from 'vue';
import { getInformationList } from '@/api/advice';
import { getAppBanner } from '@/api/home';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
// import { appGetVersionInfo } from '@/api/my';
import permision from '@/js_sdk/wa-permission/permission.js';

const userStore = useUserStore();

const active = ref('2');
const tabList = ref([
  {
    name: '最新',
    id: '2',
  },
  {
    name: '最热',
    id: '3',
  },
]);
const informationList = ref([]);
const getInformation = async () => {
  const data = await getInformationList({
    pageNo: 1,
    pageSize: 3,
    screening: active.value,
  });
  informationList.value = data.result.records;
};

const bannerList = ref([]);
const initData = async () => {
  const data = await getAppBanner();
  bannerList.value = data.result;
};

// 热更新
// const showUpdatePopup = ref(false);
// const versionDesc = ref('');
// const getVersionInfo = async () => {
//   const res = await appGetVersionInfo();
//   versionDesc.value = res.result?.describe?.replace(/\n/g, '<br>') || '';
//   // version.value = plus.runtime.version;
//   uni.getSystemInfo({
//     success: function (val) {
//       if (res.result?.version != `${val.appVersion}`) {
//         showUpdatePopup.value = true;
//       }
//     },
//   });
// };

const notifyShow = ref(false);
const notifyRef = ref(null);
const notifyContent = ref('');
// 获取相机权限
const getCameraPermission = async () => {
  notifyContent.value =
    '我们将会用到您的相机权限，用于拍摄照片和录制视频，将会在扫码、上传头像、实名认证等场景使用';
  notifyShow.value = true;
  await permision.requestAndroidPermission('android.permission.CAMERA');
  notifyShow.value = false;
};
// 获取相册权限
const getAlbumPermission = async () => {
  notifyContent.value =
    '我们将会用到您的相册权限，用于上传照片和视频，将会在上传头像、实名认证等场景使用';
  notifyShow.value = true;
  await permision.requestAndroidPermission(
    'android.permission.READ_EXTERNAL_STORAGE'
  );
  notifyShow.value = false;
};
onLoad(() => {
  uni.$on('refreshTabbar', () => {
    initData();
    getInformation();
  });
  initData();
  getInformation();
  getVersionInfo();
});
onShow(async () => {
  if (!userStore.getters_user_token) {
    route('pages/login/index');
  }
  await getCameraPermission();
  setTimeout(async () => {
    await getAlbumPermission();
  }, 700);
});

watch(
  () => [notifyShow.value, notifyRef.value],
  () => {
    setTimeout(() => {
      if (notifyShow.value) {
        notifyRef.value.show({
          type: 'warning',
          message: notifyContent.value,
          duration: 10000,
          safeAreaInsetTop: true,
        });
      } else {
        notifyRef.value.close();
      }
    }, 600);
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style scoped lang="scss">
.home-message-wrap {
  padding: 30rpx;
}
.home-wrap {
  padding-bottom: 120rpx;
}
.home-header {
  background: linear-gradient(0deg, #17bcef, #378cfd);
  // height: 460rpx;
  // height: 0rpx;
}
.hone-nav {
  margin-top: 40rpx;
}
</style>
