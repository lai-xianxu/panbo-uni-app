<template>
  <view class="flex-column msg-wrap">
    <nav-bar :isNavBar="false" />
    <view class="flex-row cross-center main-between msg-title">
      <view class="flex-row cross-center">
        <image
          class="back"
          src="@/static/common/left-arrow.png"
          @click="route({ type: 'navigateBack' })"
        />
        <span class="name">{{ user.realname }}</span>
      </view>
      <view class="position">{{ user.departName }}・{{ user.postName }}</view>
    </view>
    <view class="flex1 msg-con">
      <scroll-view
        style="height: 100%"
        scroll-y="true"
        upper-threshold="40"
        @scrolltoupper="initData"
      >
        <uv-load-more
          style="padding: 20rpx 0"
          :status="status"
          v-if="status == 'loading'"
        />
        <view
          class="msg-item"
          v-for="item in list"
          :key="item.id"
          :class="{ right: userInfo.id == item.msgFrom }"
        >
          <span class="msg-item-info">{{ item.msgData }}</span>
        </view>
        <p class="tip" v-if="isDeliver">已投递在线简历</p>
      </scroll-view>
    </view>
    <view class="flex0 msg-bottom">
      <view class="flex-row main-around opt-wrap">
        <p
          class="flex-column cross-center main-center opt-wrap-item"
          @click.stop="onSendMsg('phone')"
        >
          <image class="image" src="@/static/home/msg-icon1.png" />
          <span>发送电话</span>
        </p>
        <!-- <p
          class="flex-column cross-center main-center opt-wrap-item"
          @click.stop="onSendMsg('wx')"
        >
          <image class="image" src="@/static/home/msg-icon2.png" />
          <span>发送微信</span>
        </p> -->
        <p
          class="flex-column cross-center main-center opt-wrap-item"
          @click.stop="onSendResume()"
        >
          <image class="image" src="@/static/home/msg-icon3.png" />
          <span>发送简历</span>
        </p>
      </view>
      <view class="flex-row sending-wrap">
        <view class="flex1 sending-search">
          <uv-search
            bgColor="#f7f7f7"
            v-model="content"
            :showAction="false"
            placeholder="新消息"
          >
            <template v-slot:prefix>
              <span></span>
            </template>
          </uv-search>
        </view>
        <view class="flex-center sending" @click.stop="onSendMsg('')">
          <image class="img" src="@/static/home/send-icon.png" />
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
const content = ref("");
import {
  getPbResume,
  seedMsg,
  resumeDelivery,
  isDeliverResumeDelivery,
  pbJobOpening,
} from "@/api/recruit";
import { useUserStore } from "@/stores/user";
import { onLoad } from "@dcloudio/uni-app";

const userStore = useUserStore();
const userInfo = computed(() => userStore.getters_user_info);
const list = ref([]);
let jobOpeningId = "";
let toUserId = "";
let pageNo = 1;
let pageSize = 14;
const status = ref("");

const isDeliver = ref(false);
const initData = async () => {
  if (status.value == "nomore") return;
  const data = await getPbResume({
    jobOpeningId,
    msgTo: toUserId,
    pageNo,
    pageSize,
  });
  if (pageNo == 1) {
    list.value = [];
  }
  pageNo++;
  list.value = [...(data?.result?.records || []), ...list.value];
  if ((data?.result?.records || []).length < pageSize) {
    status.value = "nomore";
  }
};
const user = ref({});
const initUser = async () => {
  const data = await pbJobOpening({
    id: jobOpeningId,
  });
  user.value = data.result;
};

const websoket = ref();
const connectSocket = () => {
  // 监听 WebSocket 连接打开事件
  // uni.onSocketOpen(() => {
  //   console.log("WebSocket 已打开");
  //   uni.showToast({
  //     title: "WebSocket 已打开",
  //     icon: "error",
  //     duration: 2000,
  //   });
  // });
  
  uni.onSocketMessage(function (res) {
    console.log("uni.onSocketMessage",res,  res?.cmd, res?.data?.cmd);
    if (["topic", "user"].includes(res?.cmd || res?.data?.cmd) || res) {
      pageNo = 1;
      status.value = "loading";
      initData();
    }
  });
  const url =
    "http://nas.ump45.top:19007/jeecg-boot"
      ?.replace("https://", "wss://")
      .replace("http://", "ws://") +
    "/websocket/" +
    userInfo.value.id;
  websoket.value = uni.connectSocket({
    url,
    header: {
      "content-type": "application/json",
    },
    success: () => {
      console.log("websoket连接成功");
      uni.onSocketOpen(() => {
        console.log("WebSocket 已打开");
      });
    },
    fail: () => {
      console.log("websoket连接失败");
      uni.showToast({
        title: "websoket连接失败",
        icon: "error",
        duration: 2000,
      });
    },
  });
  // websoket.value.onMessage = (res) => {
  //   console.log("onMessage", res);
  //   uni.showToast({
  //     title: "onMessage",
  //     icon: "error",
  //     duration: 2000,
  //   });
  // };
  // websoket.value.onOpen((res) => {
  //   console.log("WebSocket连接正常打开中...！", res);
  //   uni.showToast({
  //     title: "WebSocket连接正常打开中...！",
  //     icon: "error",
  //     duration: 2000,
  //   });
  // });
  // // 监听 WebSocket 错误事件
  // uni.onSocketError((error) => {
  //   console.log("WebSocket 错误", error);
  //   uni.showToast({
  //     title: "WebSocket 错误",
  //     icon: "error",
  //     duration: 2000,
  //   });
  // });

  // 监听 WebSocket 连接关闭事件
  uni.onSocketClose(() => {
    console.log("WebSocket 已关闭");
  });
};
onBeforeUnmount(() => {
  websoket.value.close({
    success(res) {
      console.log("关闭成功", res);
    },
    fail(err) {
      console.log("关闭失败", err);
    },
  });
});
onLoad((params) => {
  jobOpeningId = params.id;
  toUserId = params.msgTo;
  initData();
  checkIsDeliver();
  initUser();
  connectSocket();
});
const onSendMsg = async (key) => {
  const info = key ? userInfo.value[key] : content.value;
  if (!info) return;
  await seedMsg({
    content: info,
    jobOpeningId,
    toUserId,
  });
  if (key) {
    uni.$uv.toast("电话发送成功");
  }
  if (!key) {
    content.value = "";
  }
  pageNo = 1;
  status.value = "loading";
  initData();
};
const checkIsDeliver = async () => {
  const data = await isDeliverResumeDelivery({ jobId: jobOpeningId });
  isDeliver.value = data.result;
};
const onSendResume = async () => {
  if (isDeliver.value) {
    uni.$uv.toast("已投递在线简历");
    return;
  }
  await resumeDelivery({ jobId: jobOpeningId });
  isDeliver.value = true;
  uni.$uv.toast("简历投递成功");
};
</script>

<style scoped lang="scss">
.msg-wrap {
  height: 100%;
}
.msg-title,
.msg-con {
  padding: 30rpx;
  // overflow: auto;
}
.msg-title {
  .back {
    width: 22rpx;
    height: 36rpx;
    margin-right: 30rpx;
  }
  .name {
    font-size: 32rpx;
    color: #1a1a1a;
  }
  .position {
    font-size: 24rpx;
    color: #808080;
  }
}
.msg-bottom {
  background: #ffffff;
  padding: 20rpx 30rpx 30rpx;
}
.msg-item {
  .msg-item-info {
    display: inline-block;
    padding: 0 20rpx;
    height: 60rpx;
    line-height: 60rpx;
    background: #ffffff;
    border-radius: 8rpx 8rpx 8rpx 0rpx;
    font-size: 24rpx;
    color: #1a1a1a;
    margin-top: 20rpx;
  }
  &.right {
    text-align: right;
    .msg-item-info {
      background: #17bcef;
      color: #ffffff;
      border-radius: 8rpx 8rpx 0rpx 8rpx;
    }
  }
}
.tip {
  margin-top: 40rpx;
  font-size: 24rpx;
  color: #777777;
  text-align: center;
}
.opt-wrap {
  font-size: 24rpx;
  color: #333333;
  .opt-wrap-item {
    height: 120rpx;
    .image {
      width: 40rpx;
      height: 50rpx;
      margin-bottom: 16rpx;
    }
  }
}
.sending {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background: #17bcef;
  .img {
    width: 40rpx;
    height: 32rpx;
  }
}
:deep() {
  .uni-searchbar__box {
    background: inherit !important;
    color: #fff;
    font-size: 24rpx;
    height: 60rpx;
    input {
      color: #fff;
      font-size: 24rpx;
    }
  }
}
.sending-wrap {
  .sending-search {
    background-color: #f7f7f7;
    margin-right: 16rpx;
    border-radius: 10rpx;
    overflow: hidden;
  }
}

:deep(.uv-search__content__input) {
  font-size: 30rpx;
}
.search-icon {
  width: 42rpx;
  height: 42rpx;
  margin: 0 20rpx;
}
:deep(.uv-search__content) {
  height: 80rpx;
}
</style>
