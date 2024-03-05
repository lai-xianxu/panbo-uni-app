<template>
  <nav-bar-page class="notify">
    <view class="notify-content">
      <view class="notify-box fsbc">
        <text>{{ textMap[pageType] }}</text>
        <switch
          :checked="checked"
          color="#17BCEF"
          style="transform: scale(0.8)"
          @change="onChange"
        />
      </view>
    </view>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { appUpdateUser, appGetUser } from '@/api/login';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

const pageType = ref('message');
const checked = ref(false);
onLoad((params) => {
  pageType.value = params.type || 'message';
  if (pageType.value == 'gesture') {
    checked.value = true;
  }
});

onShow(() => {
  if (pageType.value == 'message') {
    getChecked();
  }
});

const textMap = {
  message: '消息通知开关',
  gesture: '手势密码',
};

const onChange = async (e) => {
  if (pageType.value == 'gesture') {
    await appUpdateUser({
      type: 6,
      isGesturesPassword: e.detail.value ? 200 : 100,
    });
    if (!e.detail.value) {
      userStore.state_is_gestures_password = '';
    }
    uni.$uv.toast('设置成功');
    const { result } = await appGetUser();
    userStore.state_user.userInfo = {
      ...userStore.getters_user_info,
      ...result,
    };
    return;
  } else {
    setPermissions();
  }
};

// 获取手机通知权限
const getChecked = () => {
  if (plus.os.name == 'Android') {
    // 判断是Android
    var main = plus.android.runtimeMainActivity();
    var NotificationManagerCompat = plus.android.importClass(
      'android.support.v4.app.NotificationManagerCompat'
    );
    //android.support.v4升级为androidx
    if (NotificationManagerCompat == null) {
      NotificationManagerCompat = plus.android.importClass(
        'androidx.core.app.NotificationManagerCompat'
      );
    }
    var areNotificationsEnabled =
      NotificationManagerCompat.from(main).areNotificationsEnabled();
    checked.value = areNotificationsEnabled;
  } else if (plus.os.name == 'iOS') {
    // 判断是ISO
    var isOn = undefined;
    var types = 0;
    var app = plus.ios.invoke('UIApplication', 'sharedApplication');
    var settings = plus.ios.invoke(app, 'currentUserNotificationSettings');
    if (settings) {
      types = settings.plusGetAttribute('types');
      plus.ios.deleteObject(settings);
    } else {
      types = plus.ios.invoke(app, 'enabledRemoteNotificationTypes');
    }
    plus.ios.deleteObject(app);
    isOn = 0 != types;
    checked.value = isOn;
  }
};
// 设置手机通知权限
function setPermissions() {
  // #ifdef APP-PLUS
  if (plus.os.name == 'Android') {
    var main = plus.android.runtimeMainActivity();
    var pkName = main.getPackageName();
    var uid = main.getApplicationInfo().plusGetAttribute('uid');
    const content = checked.value
      ? '您已经开启通知权限，如需关闭，请前往设置'
      : '您还没有开启通知权限，如需开启，请前往设置';
    uni.showModal({
      title: '通知权限开启提醒',
      content: content,
      showCancel: false,
      confirmText: '去设置',
      success: function (res) {
        if (res.confirm) {
          var Intent = plus.android.importClass('android.content.Intent');
          var Build = plus.android.importClass('android.os.Build');
          //android 8.0引导
          if (Build.VERSION.SDK_INT >= 26) {
            var intent = new Intent(
              'android.settings.APP_NOTIFICATION_SETTINGS'
            );
            intent.putExtra('android.provider.extra.APP_PACKAGE', pkName);
          } else if (Build.VERSION.SDK_INT >= 21) {
            //android 5.0-7.0
            var intent = new Intent(
              'android.settings.APP_NOTIFICATION_SETTINGS'
            );
            intent.putExtra('app_package', pkName);
            intent.putExtra('app_uid', uid);
          } else {
            //(<21)其他--跳转到该应用管理的详情页
            intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
            var uri = Uri.fromParts(
              'package',
              mainActivity.getPackageName(),
              null
            );
            intent.setData(uri);
          }
          // 跳转到该应用的系统通知设置页
          main.startActivity(intent);
        }
      },
    });
  } else if (plus.os.name == 'iOS') {
    const content = checked.value
      ? '您已经开启通知权限，如需关闭，请前往设置'
      : '您还没有开启通知权限，如需开启，请前往设置';
    uni.showModal({
      title: '通知权限开启提醒',
      content: content,
      showCancel: false,
      confirmText: '去设置',
      success: function (res) {
        if (res.confirm) {
          var app = plus.ios.invoke('UIApplication', 'sharedApplication');
          var setting = plus.ios.invoke(
            'NSURL',
            'URLWithString:',
            'app-settings:'
          );
          plus.ios.invoke(app, 'openURL:', setting);
          plus.ios.deleteObject(setting);
          plus.ios.deleteObject(app);
        }
      },
    });
  }
  // #endif
}
</script>

<style scoped lang="scss">
.notify {
  position: relative;
  width: 100%;
  height: 100%;
  .notify-content {
    width: 100%;
    padding: 0 30rpx;
    .notify-box {
      width: 100%;
      height: 128rpx;
      background: #ffffff;
      box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
      border-radius: 20rpx;
      padding: 0 30rpx;
      font-size: 28rpx;
      color: #1a1a1a;
    }
  }
}
</style>
