<template>
  <view class="search-wrap flex-column">
    <view class="status_bar" />
    <view class="flex-row cross-center search-title">
      <image
        src="@/static/common/left-arrow.png"
        class="image"
        @click="route({ type: 'navigateBack' })"
      />
      <uv-search
        shape="round"
        bgColor="#ffffff"
        v-model="keyword"
        :showAction="false"
      >
        <template v-slot:prefix>
          <image
            slot="searchIcon"
            class="search-icon"
            src="@/static/home/search.png"
          />
        </template>
      </uv-search>
    </view>
    <view v-if="keyword" class="flex1 content">
      <searchWrap :keyword="keyword"/>
    </view>
    <view v-if="!keyword">
      <!-- <view>
        <view class="history-title flex-row main-between">
          <p class="title-suffix">搜索历史</p>
          <image src="@/static/home/del.png " class="image" />
        </view>
        <view class="key-wrap flex-row flex-wrap">
          <p class="key-item flex-center">工资</p>
          <p class="key-item flex-center">借款</p>
        </view>
      </view> -->
      <view class="recommend" v-if="list.length">
        <p class="title-suffix">猜你喜欢</p>
        <view>
          <homeMsgList :list="list"></homeMsgList>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import homeMsgList from "../components/home-msg-list/index.vue";
import searchWrap from "./components/search-wrap.vue";
import { onLoad } from '@dcloudio/uni-app';

import { getInformationList } from "@/api/advice";

const keyword = ref("");
onLoad((params) => {
  keyword.value = params.keyword;
})
const list = ref([]);
const getInformation = async () => {
  const data = await getInformationList({
    pageNo: 1,
    pageSize: 3,
    screening: "1",
  });
  list.value = data?.result?.records || [];
};
getInformation();
</script>

<style scoped lang="scss">
.search-wrap {
  padding: 0 30rpx;
  color: #333333;
  font-size: 28rpx;
  height: 100%;
  box-sizing: border-box;
}
.search-title {
  padding: 15rpx 0;
  .image {
    width: 22rpx;
    height: 36rpx;
    flex-shrink: 0;
    margin-right: 34rpx;
  }
}
.history-title {
  margin-top: 20rpx;
  .image {
    width: 30rpx;
    height: 30rpx;
  }
}
.key-wrap {
  margin-top: 20rpx;
  .key-item {
    width: 152rpx;
    height: 60rpx;
    background: #ffffff;
    border-radius: 20rpx;
    margin: 0 20rpx 20rpx 0;
  }
}
.recommend {
  margin-top: 180rpx;
}
.content {
  height: 0;
  overflow: auto;
}
:deep(.uv-search__content) {
  height: 80rpx;
}
:deep(.uv-search__content__input) {
  font-size: 30rpx;
}
.search-icon {
  width: 42rpx;
  height: 42rpx;
  margin: 0 20rpx;
}
</style>
