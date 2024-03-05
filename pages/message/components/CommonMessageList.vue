<template>
  <view class="message-list">
    <view
      class="message-list-item"
      v-for="item in list"
      :key="item.id"
      @click.stop="onViewArticle(item)"
    >
      <view class="message-list-item-info">
        <view class="message-list-item-info-text">
          <p class="title">{{ item.title || item.titile }}</p>
          <p class="title">{{ item.msgAbstract }}</p>
          <p class="text" v-html="item.msgContent"></p>
        </view>
        <!-- <image
          class="message-list-item-info-img"
          src="@/static/home/text2.png"
        /> -->
      </view>
      <p class="message-list-item-time">{{ item.sendTime }}</p>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import { editByAnntIdAndUserId } from "@/api/msg";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

const props = defineProps({
  list: {
    default: () => [],
  },
});
const onViewArticle = (item) => {
  editByAnntIdAndUserId({ anntId: item.anntId });
  userStore.actions_common_msg(item);
  route("pages/message/detail/index", { id: item.id });
};
</script>

<style scoped lang="scss">
.message-list-item {
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  &-info {
    display: flex;
    &-text {
      flex: 1;
      .title {
        font-size: 28rpx;
        color: #1a1a1a;
        margin-bottom: 10rpx;
      }
      .text {
        font-size: 28rpx;
        color: #808080;
        // margin-top: 12rpx;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // display: -webkit-box;
        // /*! autoprefixer: ignore next */
        // -webkit-box-orient: vertical;
        // /* autoprefixer: on */
        // -webkit-line-clamp: 3;
      }
    }
    &-img {
      flex-shrink: 0;
      width: 200rpx;
      height: 150rpx;
      border-radius: 10rpx;
      margin-left: 20rpx;
    }
  }
  &-time {
    font-size: 24rpx;
    margin-top: 20rpx;
    color: #808080;
  }
}
</style>
