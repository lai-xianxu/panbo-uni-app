<template>
  <view class="company-detail">
    <nav-bar />
    <view class="company-item company-info">
      <view class="company flex-row main-between">
        <view class="flex-column main-around">
          <p class="title">{{ info.companyName }}</p>
          <p class="company-tag" v-if="baseInfo">{{ baseInfo }}</p>
        </view>
      </view>
      <view class="flex-row company-treatment">
        <view class="flex-center company-treatment-item" v-if="info.workTime">
          <image
            class="flex0 company-treatment-item-image"
            src="@/static/home/time.png"
          />
          {{ info.workTime }}
        </view>
        <view class="flex-center company-treatment-item" v-if="info.workSystem">
          <image
            class="flex0 company-treatment-item-image"
            src="@/static/home/calendar.png"
          />
          {{ info.workSystem }}
        </view>
      </view>
    </view>
    <view
      class="company-item company-address flex-row main-between cross-center"
    >
      <view class="flex-column main-around">
        <p class="title">公司地址</p>
        <p>{{ info.location }}</p>
      </view>
      <view
        class="navigation flex-center"
        v-if="info.location_dictText"
        @click.stop="openMap"
      >
        <image
          class="flex0 image"
          mode="aspectFit"
          src="@/static/home/navigation.png"
        />
        导航
      </view>
    </view>
    <view class="company-item">
      <p class="title">公司介绍</p>
      <p>{{ info.description }}</p>
    </view>
    <view class="company-item company-pic" v-if="info.companyAlbum?.length">
      <p class="title">公司相册</p>
      <view class="flex-row company-pic-wrap">
        <uv-swiper :list="info.companyAlbum"></uv-swiper>

        <!-- <image class="flex0 image" src="@/static/home/text2.png" /> -->
        <!-- <image class="flex0 image" src="@/static/home/text2.png" /> -->
      </view>
    </view>
    <view class="company-item company-industry">
      <p class="title">工商信息</p>
      <view class="industry-item">
        <view class="industry-item-info flex-row main-between">
          <p>公司全称</p>
          <p>{{ info.companyName }}</p>
        </view>
        <view
          v-if="info.legalRepresentative"
          class="industry-item-info flex-row main-between"
        >
          <p>法定代表人</p>
          <p>{{ info.legalRepresentative }}</p>
        </view>
        <view
          v-if="info.registeredCapital"
          class="industry-item-info flex-row main-between"
        >
          <p>注册资本</p>
          <p>{{ info.registeredCapital }}</p>
        </view>
        <view
          v-if="info.registrationDate"
          class="industry-item-info flex-row main-between"
        >
          <p>成立日期</p>
          <p>{{ info.registrationDate }}</p>
        </view>
      </view>
    </view>
    <view class="company-item" v-if="info.openingVOList?.length">
      <p class="title">更多岗位</p>
      <PositionList :list="info.openingVOList" />
    </view>

    <uv-notify ref="notifyRef"></uv-notify>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import PositionList from '../position-list/index.vue';
import { onLoad } from '@dcloudio/uni-app';
import { getCompanyById } from '@/api/company';
let system = uni.getSystemInfoSync(); // 获取系统信息
/**检查是否打开GPS功能（android）**/
const checkOpenGPSServiceByAndroid = () => {
  // 定位权限未开启，引导设置
  uni.showModal({
    title: '温馨提示',
    content: '您已拒绝定位,请开启',
    confirmText: '去设置',
    success(res) {
      if (res.confirm) {
        //打开授权设置
        // uni.getSystemInfo({
        //   success(res) {
        //     if (res.platform == "ios") {
        //       //IOS
        //       plus.runtime.openURL("app-settings://");
        //     } else if (res.platform == "android") {
        //安卓
        // let main = plus.android.runtimeMainActivity();
        // let Intent = plus.android.importClass("android.content.Intent");
        // let mIntent = new Intent("android.settings.ACTION_SETTINGS");
        // main.startActivity(mIntent);
        let Intent = plus.android.importClass('android.content.Intent');
        let Settings = plus.android.importClass('android.provider.Settings');
        let intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        let main = plus.android.runtimeMainActivity();
        main.startActivity(intent);
        //   }
        // },
        // });
      }
    },
  });
};

const info = ref({});
onLoad((params) => {
  const init = async () => {
    const data = await getCompanyById({
      id: params.id,
    });
    info.value = data?.result || {};
  };
  init();
});

const baseInfo = computed(() => {
  const arr = [
    info.value.financingStatus_dictText,
    info.value.companySize_dictText,
    info.value.trade_dictText,
  ].filter(Boolean);
  return arr.length ? arr.join('・') : '';
});
const list = ref([
  {
    id: 1,
  },
  {
    id: 3,
  },
]);
const notifyShow = ref(false);
const notifyRef = ref(null);
const openMap = () => {
  const location = info.value.location_dictText.split(',');
  uni.showLoading({
    title: '定位中',
  });
  notifyShow.value = true;
  uni.getLocation({
    success() {
      uni.hideLoading();
      uni.openLocation({
        latitude: +location[1],
        longitude: +location[0],
        scale: 15,
        fail: (fail) => {
          checkOpenGPSServiceByAndroid();
        },
      });
    },
    fail: (fail) => {
      uni.hideLoading();
      checkOpenGPSServiceByAndroid();
    },
    complete() {
      notifyShow.value = false;
    },
  });
};

watch(
  () => [notifyShow.value, notifyRef.value],
  () => {
    setTimeout(() => {
      if (notifyShow.value) {
        notifyRef.value.show({
          type: 'warning',
          message: '为了定位公司的位置，我们需要获取您的位置信息',
          duration: 10000,
          safeAreaInsetTop: true,
        });
      } else {
        notifyRef.value.close();
      }
    }, 600);
  },
  {
    deep: true,
  }
);
</script>

<style scoped lang="scss">
.company-detail {
  padding: 0 30rpx;
  color: #333333;
  font-size: 28rpx;
}
.company-item {
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  padding: 30rpx;
  .title {
    font-weight: bold;
    color: #333333;
    margin-bottom: 14rpx;
  }
}
.company-info {
  .company-tag {
    color: #777777;
  }
  .company-image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 10rpx;
    margin-left: 20rpx;
  }
  .company-treatment {
    margin-top: 60rpx;
  }

  .company-treatment-item {
    margin-right: 40rpx;
    &:last-child {
      margin-right: 0;
    }
    .company-treatment-item-image {
      width: 32rpx;
      height: 32rpx;
      margin-right: 10rpx;
    }
  }
}
.company-address {
  .navigation {
    font-size: 28rpx;
    color: #17bcef;
    width: 152rpx;
    height: 60rpx;
    border: 1px solid #17bcef;
    border-radius: 30rpx;
    .image {
      width: 22rpx;
      height: 27rpx;
      margin-right: 10rpx;
    }
  }
}
.company-pic {
  .company-pic-wrap {
    overflow: auto;
  }
  .image {
    width: 615rpx;
    height: 127rpx;
    margin-right: 10rpx;
  }
}
.company-industry {
  .industry-item {
    margin-bottom: 20rpx;
    &:last-child {
      margin-bottom: 0;
    }
    &-info {
      margin-bottom: 10rpx;
    }
  }
}
:deep() {
  .nav-bar {
    padding: 30rpx 0;
  }
}
</style>
