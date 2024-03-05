<template>
  <nav-bar-page class="setting">
    <view class="setting-content">
      <view class="setting-operate">
        <view
          class="setting-operate-item fsbc ao7"
          v-for="item in operiteList"
          :key="item.image"
          @click.stop="onJump(item)"
        >
          <view class="fsc">
            <image
              class="operate-item-image"
              :src="item.image"
              mode="aspectFit"
            />
            <text>{{ item.text }}</text>
          </view>
          <image
            class="operate-item-right-arrow"
            src="@/static/common/right-arrow.png"
          />
        </view>
      </view>
      <view class="setting-footer">
        <button class="footer-button" @click.stop="onSwitchAccount">
          切换账号
        </button>
        <button
          class="footer-button footer-button--gray"
          @click.stop="onLogOut"
        >
          退出登录
        </button>
      </view>
    </view>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import xiaoxitongzhi from '@/static/setting/xiaoxitongzhi.png';
import denglumima from '@/static/setting/denglumima.png';
import jiaoyimima from '@/static/setting/jiaoyimima.png';
import shoujihao from '@/static/setting/shoujihao.png';
import shoushimima from '@/static/setting/shoushimima.png';
import shimingrenzheng from '@/static/setting/shimingrenzheng.png';
// import yinsiguanli from '@/static/home/home-nav-icon2.png';
// import agreement from '@/static/home/home-nav-icon3.png';
// import privacy from '@/static/home/home-nav-icon1.png';
import xinyongka from '@/static/my/xinyongka.png';
import dianzihetong from '@/static/my/dianzihetong.png';
import yinhangka from '@/static/my/yinhangka.png';
import zaixianjianli from '@/static/my/zaixianjianli.png';
import wodetoudi from '@/static/my/wodetoudi.png';
import invite from '@/static/my/invite.png';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';
import { appCancel, appReport } from '@/api/my';

const userStore = useUserStore();

// 初始化
onShow(() => {
  if (!userStore.getters_user_token) {
    route('pages/login/index');
  }
});

const operiteList = ref([
  {
    image: xiaoxitongzhi,
    text: '消息通知',
    path: 'pages/setting/notify/index',
  },
  {
    image: denglumima,
    text: '修改登录密码',
    path: 'pages/setting/edit-info/index',
    params: {
      type: 'password',
    },
  },
  {
    image: jiaoyimima,
    text: '修改交易密码',
    path: 'pages/setting/edit-info/index',
    params: {
      type: 'transactionPassword',
    },
  },
  {
    image: shoujihao,
    text: '更换手机号',
    path: 'pages/setting/edit-info/index',
    params: {
      type: 'phone',
    },
  },
  {
    image: shoushimima,
    text: '设置手势密码',
    path: 'pages/setting/gesture-password/setting-gesture1/index',
  },
  {
    image: shimingrenzheng,
    text: '实名认证',
    path: 'pages/setting/real-name-auth/index',
  },
  // {
  //   key: 'report',
  //   image: xinyongka,
  //   text: '招聘举报',
  // },
  {
    key: 'privacyManage',
    image: dianzihetong,
    text: '隐私管理',
  },
  {
    key: 'agreement',
    image: yinhangka,
    text: '服务协议',
  },
  {
    key: 'privacy',
    image: zaixianjianli,
    text: '隐私政策',
  },
  {
    key: 'userManual',
    image: wodetoudi,
    text: '用户手册',
  },
  {
    key: 'logout',
    image: invite,
    text: '用户注销',
  },
]);

const onJump = async (item) => {
  if (item.key == 'privacyManage') {
    openSystemSetting();
    return;
  }
  if (item.key == 'agreement') {
    route('pages/login/web-view/index', {
      url: '/static/agreement.html',
    });
    return;
  }
  if (item.key == 'privacy') {
    plus.runtime.openWeb('http://site.skyun.com.cn/privacy.html');
    return;
  }
  if (item.key == 'userManual') {
    plus.runtime.openWeb('https://kdocs.cn/l/cuwWoAKxJNZc');
    return;
  }
  if (item.key == 'logout') {
    await appCancel();
    onLogOut();
    return;
  }
  if (item.key == 'report') {
    await appReport();
    return;
  }
  if (
    item.path == 'pages/setting/gesture-password/setting-gesture1/index' &&
    userStore.getters_is_gestures_password == 200
  ) {
    route('pages/setting/notify/index', { type: 'gesture' });
    return;
  }
  if (
    item.path == 'pages/setting/real-name-auth/index' &&
    userStore.getters_user_info?.isRealAuth > 0
  ) {
    uni.$uv.toast('您已实名认证');
    return;
  }
  route(item.path, item.params ? item.params : {});
};

const openSystemSetting = () => {
  // #ifdef APP-PLUS
  if (plus.os.name == 'Android') {
    var main = plus.android.runtimeMainActivity();
    var pkName = main.getPackageName();
    var uid = main.getApplicationInfo().plusGetAttribute('uid');
    var Intent = plus.android.importClass('android.content.Intent');
    var Build = plus.android.importClass('android.os.Build');
    //android 8.0引导
    if (Build.VERSION.SDK_INT >= 26) {
      var intent = new Intent('android.settings.PRIVACY_SETTINGS');
      intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
    } else if (Build.VERSION.SDK_INT >= 21) {
      //android 5.0-7.0
      var intent = new Intent('android.settings.PRIVACY_SETTINGS');
      intent.putExtra('app_package', pkName);
      intent.putExtra('app_uid', uid);
    } else {
      //(<21)其他--跳转到该应用管理的详情页
      intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
      var uri = Uri.fromParts('package', mainActivity.getPackageName(), null);
      intent.setData(uri);
    }
    // 跳转到该应用的系统通知设置页
    main.startActivity(intent);
  } else if (plus.os.name == 'iOS') {
    var app = plus.ios.invoke('UIApplication', 'sharedApplication');
    var setting = plus.ios.invoke('NSURL', 'URLWithString:', 'app-settings:');
    plus.ios.invoke(app, 'openURL:', setting);
    plus.ios.deleteObject(setting);
    plus.ios.deleteObject(app);
  }
};

// 切换账号
const onSwitchAccount = () => {
  route('pages/login/index', { phone: userStore.getters_user_info?.phone });
};

// 登出
const onLogOut = () => {
  userStore.state_user = {};
  onSwitchAccount();
};
</script>

<style scoped lang="scss">
.setting {
  position: relative;
  width: 100%;
  height: 100%;
  .setting-content {
    padding: 0 30rpx;
    .setting-operate {
      width: 100%;
      background: #ffffff;
      box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
      border-radius: 20rpx;
      padding: 16rpx 0;
      .setting-operate-item {
        padding: 24rpx 30rpx;
        .operate-item-image {
          width: 40rpx;
          height: 40rpx;
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
  .setting-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 60rpx 75rpx;
    .footer-button {
      margin-top: 40rpx;
      width: 100%;
      height: 80rpx;
      background: linear-gradient(0deg, #17bcef 0%, #378cfd 100%);
      box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
      border-radius: 40rpx;
      font-size: 28rpx;
      color: #ffffff;
      &--gray {
        background: #aaaaaa;
      }
    }
  }
}
</style>
