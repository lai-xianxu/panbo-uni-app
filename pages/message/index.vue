<template>
  <view class="message">
    <view class="message-title">
      <nav-bar :isNavBar="false" />
      <view class="message-title-nav">
        <tab :list="tabList" v-model="active" @onTabChange="onTabChange" />
      </view>
    </view>
    <!-- <view class="message-con" v-if="list?.length"> -->
    <view class="message-con">
      <scroll-view
        style="height: 100%"
        scroll-y="true"
        lower-threshold="20"
        @scrolltolower="initData"
      >
        <template v-if="list?.length">
          <component :is="components[active]" :list="list" />
        </template>
        <uv-load-more style="padding: 20rpx 0" :status="status" />
      </scroll-view>
    </view>
    <!--  -->
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import CommonMessageList from "./components/CommonMessageList.vue";
import RecruitmentMsgList from "./components/RecruitmentMsgList.vue";
import { getMyMessage, getMsgStatus } from "@/api/msg";
import { onLoad, onShow } from "@dcloudio/uni-app";

const components = {
  1: CommonMessageList,
  2: CommonMessageList,
  3: RecruitmentMsgList,
};
const messageStatus = ref([]);
const msgStatus = async () => {
  const data = await getMsgStatus();
  messageStatus.value = data.result;
};
const active = ref("2");
const list = ref([]);
let pageNo = 1;
let pageSize = 10;
const status = ref("");

const initData = async () => {
  if (status.value == "nomore") return;
  if (pageNo == 1) {
    list.value = [];
  }
  const data = await getMyMessage({
    pageNo,
    pageSize,
    msgCategory: active.value,
  });
  pageNo++;
  msgStatus();
  list.value = [...list.value, ...(data?.result?.records || [])];
  if ((data?.result?.records || []).length < pageSize) {
    status.value = "nomore";
  }
};
const onTabChange = () => {
  status.value = "loading";
  pageNo = 1;
  initData();
};

const tabList = computed(() => {
  return [
    {
      name: "招聘信息",
      id: "3",
      isDot: messageStatus.value?.find((res) => res.msgCategory == "3")?.msgRed,
    },
    {
      name: "系统消息",
      id: "2",
      isDot: messageStatus.value?.find((res) => res.msgCategory == "2")?.msgRed,
    },
    {
      name: "公告消息",
      id: "1",
      isDot: messageStatus.value?.find((res) => res.msgCategory == "1")?.msgRed,
    },
  ];
});

onLoad(() => {
  uni.$on("refreshTabbar", () => {
    pageNo = 1;
    initData();
  });
  initData();
});
onShow(() => {
  if (uni.getStorageSync("storageMessageData")) {
    pageNo = 1;
    active.value = 2;
    status.value = "loading";
    initData();
    uni.setStorageSync("storageMessageData", "");
  }
  msgStatus();
});
</script>

<style scoped lang="scss">
.message {
  display: flex;
  height: 100%;
  flex-direction: column;
  box-sizing: border-box;
  .message-title {
    flex-shrink: 0;
    &-nav {
      padding: 36rpx 32rpx 40rpx;
    }
  }
  .message-con {
    flex: 1;
    height: 0;
    padding: 0 30rpx 30rpx;
    box-sizing: border-box;

    &-con {
      margin-top: 32rpx;
    }
  }
}
</style>
