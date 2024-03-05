<template>
  <view class="message-list">
    <view
      class="message-list-item"
      v-for="item in list"
      :key="item.id"
      @click.stop="onViewArticle(item)"
    >
    <!-- <view
      class="message-list-item"
      v-for="item in 9"
      @click.stop="onViewArticle"
    > -->
      <view class="message-list-item-info">
        <image
          class="message-list-item-info-img flex0"
          :src="item.avatar"
        />
        <view class="message-list-item-info-text flex1">
          <view class="title">
            <span>{{ item.realname }}</span>
            <span class="position">{{item.departName}}・{{ item.postName }}</span>
          </view>
          <p class="text">
            <span class="tex">{{ item.msgContent }}</span>
            <span class="time">{{ formatTime(item.sendTime) }}</span>
          </p>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import dayjs from "@/uni_modules/uv-ui-tools/libs/util/dayjs.js";
import { editByAnntIdAndUserId } from "@/api/msg";

const props = defineProps({
  list: {
    default: () => [],
  },
});
const onViewArticle = (item) => {
  editByAnntIdAndUserId({"anntId": item.anntId})
  route("pages/position/recruit-msg-detail/index", {
    id: item.jobOpeningId,
    msgTo: item.msgTo
  });
};
const formatTime = (time) => {
  return dayjs(time).format("MM-DD")
}
</script>

<style scoped lang="scss">
.message-list-item {
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  &-info {
    display: flex;
    width: 100%;
  box-sizing: border-box;

    &-text {
      flex: 1;
      overflow: hidden;
      .title {
        font-size: 28rpx;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .position {
          font-size: 24rpx;
          color: #777777;
        }
      }
      .text {
        font-size: 28rpx;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 24rpx;
        // white-space: nowrap;
        //   text-overflow: ellipsis;
        //   /*! autoprefixer: ignore next */
        //   -webkit-box-orient: vertical;
        //   /* autoprefixer: on */
        //   -webkit-line-clamp: 1;
        //   overflow: hidden;
        .tex {
          flex: 1;
          white-space: nowrap;
          text-overflow: ellipsis;
          /*! autoprefixer: ignore next */
          -webkit-box-orient: vertical;
          /* autoprefixer: on */
          -webkit-line-clamp: 1;
          overflow: hidden;
          
        }
        .time {
          flex-shrink: 0;
        }
      }
    }
    &-img {
      flex-shrink: 0;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
      margin-right: 20rpx;
      object-fit: cover;
    }
  }
  &-time {
    font-size: 24rpx;
    margin-top: 20rpx;
    color: #808080;
  }
}
</style>
