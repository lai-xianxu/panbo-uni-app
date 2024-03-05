<template>
  <view class="position-detail flex-column">
    <nav-bar />
    <view class="flex1" style="overflow: auto">
      <view class="position-info position-item">
        <view class="flex-row main-between">
          <p class="title">{{ info.jobTitle }}</p>
          <p class="money">{{ info.salary }}</p>
        </view>
        <view v-if="info.jobCity" class="flex-row demand-item cross-center">
          <image
            class="flex0 image"
            mode="aspectFit"
            src="@/static/my/company-icon1.png"
          />
          {{ info.jobAddress }}
        </view>
        <view
          class="flex-row demand-item cross-center"
          v-if="info.jobExperience"
        >
          <image
            class="flex0 image"
            mode="aspectFit"
            src="@/static/my/company-icon3.png"
          />
          {{ info.jobExperience_dictText }}
        </view>
        <view
          class="flex-row demand-item cross-center"
          v-if="info.educationRequired_dictText"
        >
          <image
            class="flex0 image"
            mode="aspectFit"
            src="@/static/my/company-icon2.png"
          />
          {{ info.educationRequired_dictText }}
        </view>

        <view class="flex-row company" @click.stop="onViewCompany">
          <image
            class="flex0 image"
            mode="aspectFit"
            :src="info.companyVO?.logoUrl"
          />
          <view class="flex-column main-around">
            <p>{{ info.companyVO?.companyName }}</p>
            <p>{{ info.companyVO?.companySize_dictText }}</p>
          </view>
        </view>
      </view>
      <view class="position-det position-item" @click="onJumpDetail">
        <p class="title">职位详情</p>
        <view class="flex-row position-tab">
          <p class="position-tab-item flex-center">{{ info.jobTags }}</p>
        </view>
        <p
          class="dec ov3"
          v-html="info.jobDescription?.replace(/\n/g, '<br>')"
        ></p>
      </view>
      <view
        style="width: 100%; height: 240px"
        v-if="info.location && info.location?.split(',')?.length == 2"
      >
        <map
          style="width: 100%; height: 100%"
          :latitude="info.location.split(',')?.[1]"
          :longitude="info.location.split(',')?.[0]"
          @markertap="openMap"
          @tap="openMap"
          :markers="[
            {
              id: 1,
              latitude: info.location.split(',')?.[1],
              longitude: info.location.split(',')?.[0],
              iconPath: 'https://hellouniapp.dcloud.net.cn/static/location.png',
            },
            {
              id: 2,
              latitude: info.location.split(',')?.[1],
              longitude: info.location.split(',')?.[0],
              iconPath: 'https://hellouniapp.dcloud.net.cn/static/location.png',
            },
          ]"
        ></map>
      </view>
    </view>
    <view class="flex-row position-opt flex-center">
      <p class="position-opt-item flex-center" @click.stop="onViewOnline">
        编辑简历
      </p>
      <p class="position-opt-item flex-center" @click.stop="onSendMsg">
        发送消息
      </p>
    </view>
    <uv-notify ref="notifyRef"></uv-notify>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getJobyById } from '@/api/recruit';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';

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
        let Intent = plus.android.importClass('android.content.Intent');
        let Settings = plus.android.importClass('android.provider.Settings');
        let intent = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
        let main = plus.android.runtimeMainActivity();
        main.startActivity(intent);
      }
    },
  });
};

const info = ref({});
let id = '';
onLoad((params) => {
  id = params.id;
  const init = async () => {
    const data = await getJobyById({
      id: params.id,
    });
    info.value = data.result;
  };
  init();
});
const onSendMsg = () => {
  route('pages/position/recruit-msg-detail/index', {
    id,
    msgTo: info.value.msgTo,
  });
};
const onViewOnline = () => {
  route('pages/position/online-resume/index');
};
const onViewCompany = (item) => {
  route('pages/position/company-detail/index', {
    id: info.value?.companyVO?.id,
  });
};
const onJumpDetail = () => {
  route('pages/position/position-detail/desc-detail/index', {
    id,
  });
};

const notifyShow = ref(false);
const notifyRef = ref(null);
const openMap = () => {
  const location = info.value.location.split(',');
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
    immediate: true,
    deep: true,
  }
);
</script>

<style scoped lang="scss">
.position-detail {
  padding: 0 30rpx 30rpx;
  color: #333333;
  font-size: 28rpx;
  box-sizing: border-box;
  height: 100%;
  .position-item {
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
    border-radius: 20rpx;
    margin-bottom: 18rpx;
    padding: 22rpx 30rpx;
  }
  .title {
    font-weight: bold;
    color: #333333;
  }
}
.position-info {
  .demand-item {
    margin-top: 8rpx;
    color: #777777;
    .image {
      width: 26rpx;
      height: 28rpx;
      margin-right: 10rpx;
    }
  }
  .company {
    margin-top: 10rpx;
    .image {
      width: 100rpx;
      height: 100rpx;
      margin-right: 30rpx;
      border-radius: 10rpx;
    }
  }
  .money {
    color: #17bcef;
  }
}
.position-det {
  .title {
    font-weight: 500;
  }
  .position-tab {
    margin: 12rpx 0;
    .position-tab-item {
      background: #17bcef;
      height: 40rpx;
      padding: 0 8rpx;
      font-size: 24rpx;
      color: #ffffff;
      margin-right: 10rpx;
      border-radius: 8rpx;
    }
  }
  .dec {
    color: #777777;
  }
}
.position-address {
  width: 690rpx;
  height: 300rpx;
  border-radius: 20rpx;
}

.position-opt {
  margin-top: 50rpx;
  .position-opt-item {
    width: 300rpx;
    height: 80rpx;
    background: linear-gradient(0deg, #17bcef 0%, #378cfd 100%);
    border-radius: 40rpx;
    box-shadow: 0 4rpx 8rpx 0 rgba(12, 100, 127, 0.3);
    color: #ffffff;
    &:first-child {
      margin-right: 24rpx;
    }
  }
}
:deep() {
  .nav-bar {
    padding: 30rpx 0;
  }
}
</style>
