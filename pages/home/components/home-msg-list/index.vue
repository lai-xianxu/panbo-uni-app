<template>
  <view class="home-msg-list">
    <view>
      <view
        v-for="item in list"
        :key="item.id"
        class="home-msg-item"
        @click.stop="onViewArticle(item)"
      >
        <view class="home-msg-item-info">
          <view class="info">{{ item.title }}</view>
          <view class="time">{{ item.publishTime }}</view>
        </view>
        <image v-if="item.image" class="home-msg-item-img flex0" :src="item.image"></image>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";

const props = defineProps({
  list: {
    default: () => [],
  },
});
const onViewArticle = (item) => {
  route("pages/home/article-detail/index", {
    id: item.id,
  });
};
</script>

<style scoped lang="scss">
.home-msg-item {
  box-sizing: border-box;
  display: flex;
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
  border-radius: 20rpx;
  height: 228rpx;
  padding: 38rpx 30rpx;
  margin-top: 20rpx;
  &-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .info {
      color: #333333;
      font-size: 28rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      /*! autoprefixer: ignore next */
      -webkit-box-orient: vertical;
      /* autoprefixer: on */
      -webkit-line-clamp: 2;
    }
    .time {
      color: #aaaaaa;
      font-size: 24rpx;
    }
  }
  &-img {
    width: 200rpx;
    height: 150rpx;
    margin-left: 50rpx;
    object-fit: cover;
  }
}
</style>
