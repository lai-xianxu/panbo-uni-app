<template>
  <view class="status_bar" />
  <!-- <uni-nav-bar height="0" :border="false" statusBar /> -->
  <view class="nav-bar" v-if="isNavBar">
    <image
      :src="wLeftArrow ? wLeftArrowIcon : leftArrowIcon"
      @click="route({ type: 'navigateBack' })"
    />
  </view>
</template>

<script setup>
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import leftArrowIcon from "@/static/common/left-arrow.png";
import wLeftArrowIcon from "@/static/common/left-arrow-w.png";

const props = defineProps({
  isNavBar: {
    type: Boolean,
    default: true,
  },
  wLeftArrow: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.nav-bar {
  width: 100%;
  padding: 38rpx 33rpx 33rpx;
  image {
    width: 22rpx;
    height: 36rpx;
    cursor: pointer;
  }
}
</style>
