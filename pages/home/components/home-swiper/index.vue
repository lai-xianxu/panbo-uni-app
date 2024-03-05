<template>
  <view class="swiper-con">
    <view class="bg"></view>
    <uni-swiper-dot
      class="uni-swiper-dot-box"
      @clickItem="clickItem"
      :info="list"
      :current="current"
      mode="round"
      :dots-styles="{
        backgroundColor: 'rgba(83, 200, 249,0.3)',
        border: '1px rgba(83, 200, 249,0.3) solid',
        color: '#fff',
        selectedBackgroundColor: 'rgba(83, 200, 249,0.9)',
        selectedBorder: '1px rgba(83, 200, 249,0.9) solid',
      }"
      field="content"
    >
      <swiper
        class="swiper"
        circular
        :autoplay="false"
        next-margin="40px"
        @change="change"
        :current="swiperDotIndex"
      >
        <swiper-item
          v-for="item in list"
          :key="item.id"
          @click.stop="onClick(item)"
        >
          <view class="swiper-item uni-bg-red">
            <image class="message-card-image" :src="item.imageUrl" />
          </view>
        </swiper-item>
      </swiper>
    </uni-swiper-dot>
  </view>
</template>

<script setup>
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import { ref } from "vue";
const props = defineProps({
  list: {
    default: () => [],
  },
});
const swiperDotIndex = ref(0);
const current = ref(0);
const onClick = (item) => {
  // if (item.eventType == "1") {
  //   route(item.eventValue);
  // } else {
    // route("pages/my/iframe-page/index", {
    //   url: item.eventValue,
    // });
    // plus.runtime.openURL(item.eventValue);
  // }
  // plus.runtime.openWeb(item.eventValue);
};
const clickItem = (e) => {
  swiperDotIndex.value = e;
};
const change = (e) => {
  current.value = e.detail.current;
};
</script>

<style scoped lang="scss">
.swiper-con {
  position: relative;
  .bg {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100rpx;
    border-radius: 100rpx 100rpx 0 0;
    background-color: #f2faff;
    z-index: 0;
  }
}
.swiper {
  height: 375rpx;
  margin-top: 30rpx;
}
.swiper-item {
  //   height: 376rpx;
  text-align: center;
  margin-left: 18rpx;
  border-radius: 20rpx;
  height: 100%;
  overflow: hidden;
}
// .uni-bg-red {
//   background: red;
// }
// .uni-bg-green {
//   background: green;
// }
// .uni-bg-blue {
//   background: blue;
// }
.message-card-image {
  width: 100%;
  height: 100%;
}
:deep() {
  .message-card-image > div {
    background-size: cover !important;
  }
}
</style>
