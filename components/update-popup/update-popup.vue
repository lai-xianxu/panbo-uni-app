<template>
  <uv-popup
    ref="popupRef"
    mode="center"
    :closeOnClickOverlay="false"
    @change="change"
  >
    <view class="pb-popup pb-page">
      <view class="popup-header fsbc">
        <image
          src="@/static/common/del.png"
          class="header-left"
          @click.stop="onClose"
        />
        <image src="@/static/setting/update-header.png" class="header-icon" />
      </view>

      <view
        class="popup-content"
        v-html="desc || '软件有新版本啦，快去更新吧！'"
      ></view>

      <view class="popup-footer">
        <view class="footer-liner"></view>
        <uv-button
          :throttleTime="300"
          shape="square"
          text="立即更新"
          :disabled="btnLocked"
          @click="onSave2"
        ></uv-button>
      </view>

      <view class="fsc footer-progress" v-if="btnLocked">
        <uv-line-progress
          :percentage="progressVal"
          activeColor="#23abf5"
          :showText="false"
          height="30rpx"
        ></uv-line-progress>
        <text>{{ progressVal }}%</text>
      </view>
    </view>
  </uv-popup>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  desc: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

// v-model
const popupRef = ref(null);
const onClose = () => {
  popupRef.value.close();
};
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      popupRef.value.open();
      setTimeout(() => {
        uni.hideTabBar();
      });
    } else {
      onClose();
      uni.showTabBar();
    }
  }
);
const change = (val) => {
  emit('update:modelValue', val.show);
};

const btnLocked = ref(false);
const progressVal = ref(0);
const onSave = () => {
  if (btnLocked.value) return;
  btnLocked.value = true;
  const downloadTask = uni.downloadFile({
    // http://113.250.177.237:8080
    // url: 'http://113.250.177.237:8080/jeecg-boot/app/version/new',
    url: 'http://113.250.177.237:8080/jeecg-boot/sys/common/static/app/panbo.apk',
    success: (res) => {
      if (res.statusCode == 200) {
        // uni.saveFile({
        //   tempFilePath: d.filename, //临时路径
        //   success: function (res) {
        //     uni.setClipboardData({
        //       data: JSON.stringify(res.savedFilePath),
        //       success: function () {
        //         console.log('success');
        //       },
        //     });
        //   },
        // });
        // uni.openDocument({
        //   filePath: res.tempFilePath,
        //   success: (sus) => {
        //     console.log('成功打开');
        //   },
        // });
        uni.$uv.toast('开始安装');
        plus.runtime.install(
          res.tempFilePath + '.apk',
          { force: true },
          () => {
            uni.$uv.toast('最新版本下载完成');
            btnLocked.value = false;
            plus.runtime.restart();
          },
          (e) => {
            uni.$uv.toast('补丁下载失败');
            uni.setClipboardData({
              data: JSON.stringify(e),
              success: function () {
                console.log('success');
              },
            });
            btnLocked.value = false;
          }
        );
      } else {
        uni.$uv.toast('更新失败，请重新下载');
        btnLocked.value = false;
        progressVal.value = 0;
      }
    },
  });

  downloadTask.onProgressUpdate((res) => {
    if (res.progress < 100) {
      progressVal.value = res.progress;
    }
    if (
      res.totalBytesWritten == res.totalBytesExpectedToWrite &&
      res.progress == 100
    ) {
      progressVal.value = res.progress;
    }
  });
};

const onSave2 = () => {
  progressVal.value = 0;
  btnLocked.value = true;
  //开启下载任务
  let dtask = plus.downloader.createDownload(
    'http://113.250.177.237:8080/jeecg-boot/app/version/new',
    {
      method: 'GET',
      filename: '_doc/update/panbo.apk',
    },
    (d, status) => {
      if (status == 200) {
        plus.runtime.install(
          d.filename,
          { force: true },
          () => {
            // uni.$uv.toast('最新版本下载完成');
            btnLocked.value = false;
            plus.runtime.restart();
          },
          (e) => {
            uni.$uv.toast('下载失败，请重新下载');
            btnLocked.value = false;
          }
        );
      } else {
        uni.$uv.toast('下载失败，请重新下载');
        btnLocked.value = false;
      }
    }
  );

  // 下载任务状态变化事件,计算进度条数值
  dtask.addEventListener('statechanged', (task) => {
    if (task.state == 3) {
      let progress = (task.downloadedSize / task.totalSize) * 100;
      progressVal.value = Math.trunc(progress);
    }
  });
  dtask.start();
};
</script>

<style scoped lang="scss">
.pb-popup {
  width: 670rpx;
  background: #ffffff;
  border-radius: 20rpx;
  .popup-header {
    position: relative;
    width: 100%;
    height: 300rpx;
    .header-left {
      position: absolute;
      top: 30rpx;
      left: 30rpx;
      width: 24rpx;
      height: 24rpx;
      z-index: 9;
    }
    .header-icon {
      position: absolute;
      top: -46rpx;
      left: 0;
      width: 100.06%;
      height: 355rpx;
    }
  }
  .popup-content {
    width: 100%;
    max-height: 320rpx;
    padding: 30rpx;
    font-size: 28rpx;
    line-height: 28rpx;
    overflow: auto;
  }
  .popup-footer {
    position: relative;
    margin-top: -70rpx;
    margin-bottom: 30rpx;
    .footer-liner {
      width: 100%;
      height: 100rpx;
      background: linear-gradient(0deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%)
        rgba(255, 255, 255, 0);
    }
  }
  .footer-progress {
    margin-top: 30rpx;
    padding: 0 30rpx;
    margin-bottom: 70rpx;
    text {
      font-size: 28rpx;
      line-height: 28rpx;
      font-weight: 400;
      color: #333333;
      margin-left: 20rpx;
    }
  }
}
:deep() {
  .uv-popup__content {
    border-radius: 20rpx;
  }
}
</style>
