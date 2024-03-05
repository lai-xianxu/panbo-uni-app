<template>
  <view class="my">
    <nav-bar :isNavBar="false" />
    <view class="my-header-bg"></view>
    <view class="my-white-bg"></view>
    <image
      class="my-setting"
      src="@/static/my/setting.png"
      @click.stop="route('pages/setting/index')"
    />

    <view class="my-user fsc-c">
      <image
        class="my-user-avatar"
        :src="userInfo?.avatar || userAvatar"
        @click.stop="route('pages/my/edit-info/index')"
      />
      <!-- <view
        class="my-user-name"
        @click.stop="route('pages/my/edit-info/index')"
        >{{ userInfo?.username }}</view
      > -->
      <!-- <view
        class="my-user-text"
        @click.stop="route('pages/my/edit-info/index')"
        >{{ userInfo?.id }}</view
      > -->
    </view>

    <view
      v-if="!userStore.getters_is_new_user"
      class="my-card fsbs"
      @click.stop="route('pages/my/balance/index')"
    >
      <image class="my-card-left" src="@/static/my/tip.png" />
      <view class="my-card-center fsc-c">
        <view class="my-card-center-top">账户余额（元）</view>
        <number-view :number="balanceData.balance" class="mt30" />
      </view>
      <view
        class="my-card-right fsc"
        @click.stop="route('pages/my/balance/deposit/index')"
      >
        <image src="@/static/my/amount-money.png" />
        <text>存入</text>
      </view>
    </view>

    <image
      :src="advertMap?.imgUrl || advert"
      mode="aspectFill"
      class="my-advert"
      :style="{
        'margin-top': userStore.getters_is_new_user ? '222rpx' : '22rpx',
      }"
      @click.stop="onAdvert(advertMap?.url)"
    />
    <view class="my-operate">
      <view
        class="my-operate-item fsbc ao7"
        v-for="item in operiteList.filter((e) => e.show)"
        :key="item.image"
        @click.stop="onJump(item)"
      >
        <view class="fsc">
          <image class="operate-item-image" :src="item.image" />
          <text>{{ item.text }}</text>
        </view>
        <image
          class="operate-item-right-arrow"
          src="@/static/common/right-arrow.png"
        />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import xinyongka from '@/static/my/xinyongka.png';
import dianzihetong from '@/static/my/dianzihetong.png';
import yinhangka from '@/static/my/yinhangka.png';
import zaixianjianli from '@/static/my/zaixianjianli.png';
import wodetoudi from '@/static/my/wodetoudi.png';
import invite from '@/static/my/invite.png';
import userAvatar from '@/static/my/user-avatar.png';
import { useUserStore } from '@/stores/user';
import {
  appBalanceGet,
  appGetPdAdvertisementConfigurationList,
} from '@/api/my';
import { isInviteAuth } from '@/api/company';
import advert from '@/static/my/advert.png';
import { onLoad } from '@dcloudio/uni-app';

const userStore = useUserStore();
const userInfo = computed(() => userStore.getters_user_info);

const operiteList = ref([
  {
    image: xinyongka,
    text: '信用卡办理',
    path: 'pages/my/credit-card/index',
    show: !userStore.getters_is_new_user,
  },
  {
    image: dianzihetong,
    text: '电子合同',
    path: 'pages/my/iframe-page/index',
    show: true,
  },
  {
    image: yinhangka,
    text: '银行卡管理',
    path: 'pages/my/bank-card/index',
    show: !userStore.getters_is_new_user,
  },
  {
    image: zaixianjianli,
    text: '在线简历',
    path: 'pages/position/online-resume/index',
    show: true,
  },
  {
    image: wodetoudi,
    text: '我的投递',
    path: 'pages/my/my-delivery/index',
    show: true,
  },
  {
    image: invite,
    text: '邀请用户',
    path: 'pages/my/invite-user/index',
    show: true,
  },
]);

// 获取余额
const balanceData = computed(() => userStore.getters_balance_data);

// 获取广告
const advertMap = ref('');
const getAdvert = async () => {
  const { result } = await appGetPdAdvertisementConfigurationList({
    type: 200,
  });
  advertMap.value = result?.pdAdvertisementConfigurationDtos?.[0];
};
// 打开广告
const onAdvert = (url) => {
  plus.runtime.openWeb(url);
};

// 跳转
const onJump = async (item) => {
  const { result } = await isInviteAuth();
  if (item.path == 'pages/my/invite-user/index' && !result) {
    uni.$uv.toast('暂无邀请权限');
    return;
  }
  route(item.path);
};

onLoad(() => {
  uni.$on('refreshTabbar', () => {
    userStore.actions_get_balance_data();
    getAdvert();
  });
  userStore.actions_get_balance_data();
  getAdvert();
});
</script>

<style scoped lang="scss">
.my {
  position: relative;
  overflow: auto;
  height: 100%;
  padding: 0 30rpx 90rpx;
  .my-header-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(440rpx + var(--status-bar-height));
    background: linear-gradient(0deg, #17bcef, #378cfd);
  }
  .my-white-bg {
    position: absolute;
    top: calc(var(--status-bar-height) + 380rpx);
    left: 0;
    width: 100%;
    height: 60rpx;
    background-color: #f2faff;
    border-top-left-radius: 60rpx;
    border-top-right-radius: 60rpx;
  }

  .my-setting {
    position: absolute;
    top: calc(var(--status-bar-height) + 58rpx);
    right: 27rpx;
    width: 42rpx;
    height: 38rpx;
    z-index: 2;
    cursor: pointer;
  }
  .my-user {
    position: relative;
    margin-top: 60rpx;
    z-index: 1;
    .my-user-avatar {
      width: 141rpx;
      height: 141rpx;
      border-radius: 50%;
    }
    .my-user-name {
      font-size: 32rpx;
      line-height: 32rpx;
      color: #fff;
      margin-top: 22rpx;
    }
    .my-user-text {
      font-size: 24rpx;
      line-height: 24rpx;
      color: #fff;
      margin-top: 20rpx;
    }
  }
  .my-card {
    position: relative;
    width: 100%;
    height: 214rpx;
    background: url('@/static/my/my-bg.png') no-repeat;
    background-size: 100%;
    border-radius: 22rpx;
    z-index: 1;
    margin-top: 40rpx;

    .my-card-left {
      width: 30rpx;
      height: 30rpx;
      border-radius: 50%;
      margin: 30rpx 80rpx 0 30rpx;
    }
    .my-card-center {
      margin-top: 48rpx;
      color: #ffffff;

      .my-card-center-top {
        font-size: 28rpx;
        line-height: 28rpx;
      }
    }
    .my-card-right {
      background: url('@/static/my/juxing.png') no-repeat;
      background-size: 100%;
      width: 140rpx;
      height: 80rpx;
      margin-top: 67rpx;
      image {
        margin-left: 11rpx;
        width: 50rpx;
        height: 50rpx;
      }
      text {
        margin-left: 9rpx;
        font-size: 28rpx;
        line-height: 28rpx;
        color: #ffffff;
      }
    }
  }
  .my-advert {
    width: 100%;
    height: 300rpx;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
    border-radius: 20rpx;
    margin-top: 22rpx;
  }
  .my-operate {
    width: 100%;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
    border-radius: 20rpx;
    padding: 16rpx 0;
    margin-top: 22rpx;
    .my-operate-item {
      padding: 24rpx 30rpx;
      .operate-item-image {
        width: 46rpx;
        height: 36rpx;
      }
      text {
        font-size: 28rpx;
        line-height: 28rpx;
        color: #333333;
        margin-left: 20rpx;
      }
      .operate-item-right-arrow {
        width: 20rpx;
        height: 34rpx;
      }
    }
  }
}
</style>
