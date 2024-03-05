<template>
  <view class="message">
    <view class="message-wrap" v-if="msgList?.length">
      <image class="message-wrap-icon" src="@/static/home/home-msg.png" />
      <view class="message-wrap-info">
        <view
          class="message-wrap-info-item"
          v-for="item in msgList"
          :key="item.id"
          @click.stop="onClickMsg"
        >
          <view class="info">账户入账{{ foramtCon(item.msgContent) }}</view>
          <view class="time">{{ formatTime(item.sendTime) }}</view>
        </view>
        <!-- <view class="message-wrap-info-item">
          <view class="info">账户入账83483</view>
          <view class="time">1小时前</view>
        </view> -->
      </view>
    </view>
    <view class="message-card">
      <image
        class="message-card-image"
        @click.stop="onClick(item)"
        v-for="item in list"
        :src="item.imgUrl"
        :key="item.imgUrl"
      />
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { getConfigurationList } from "@/api/home";
import { getMyMessage } from "@/api/msg";
import dayjs from "@/uni_modules/uv-ui-tools/libs/util/dayjs.js";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";

const msgList = ref([]);
const list = ref([]);
const initData = async () => {
  const data = await getConfigurationList({ type: 100 });
  list.value = data?.result?.pdAdvertisementConfigurationDtos || [];
  const info = await getMyMessage({
    pageNo: 1,
    pageSize: 2,
    msgCategory: 2,
  });
  msgList.value = info?.result?.records || [];
};
initData();

const foramtCon = (str) => {
  const arr = str?.split("：");
  return arr?.[1];
};
const onClick = (item) => {
  // route("pages/my/iframe-page/index", {
  //   url: item.url,
  // });
  plus.runtime.openWeb(item.url);
};
const formatTime = (time) => {
  return dayjs(time).format("MM-DD");
};
const onClickMsg = () => {
  route({
    type: "switchTab",
    url: "pages/message/index",
  });
  uni.setStorageSync("storageMessageData", "jump");
};
</script>

<style scoped lang="scss">
.message {
  padding: 0 30rpx;
  margin-top: 30rpx;
}
.message-wrap {
  box-sizing: border-box;
  height: 150rpx;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx 22rpx 30rpx 32rpx;
  display: flex;
  &-icon {
    width: 80rpx;
    height: 90rpx;
    flex-shrink: 0;
  }
  &-info {
    flex: 1;
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 0;
    min-width: 0;
    &-item {
      display: flex;
      justify-content: space-between;
      .info {
        color: #333333;
        font-size: 28rpx;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
      .time {
        color: #aaaaaa;
        font-size: 24rpx;
        flex-shrink: 0;
      }
    }
  }
}
.message-card {
  display: flex;
  justify-content: space-between;
  margin-top: 30rpx;
  &-image {
    width: 336rpx;
    height: 200rpx;
    border-radius: 20rpx;
  }
}
:deep() {
  .message-card-image > view {
    background-size: cover !important;
  }
}
</style>
