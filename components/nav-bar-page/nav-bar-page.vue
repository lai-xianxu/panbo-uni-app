<template>
  <view class="nav-bar-page fsc-c">
    <view v-if="isStatus" class="status_bar" />
    <view class="nav-bar-page-content fsc-c">
      <view class="nav-bar" v-if="isNavBar">
        <image
          :src="isWhiteArrow ? leftArrowWhite : leftArrowBlack"
          @click="route({ type: 'navigateBack' })"
        />
      </view>
      <view
        class="page-content"
        :class="contentClass"
        :style="{ padding: padding }"
      >
        <slot />
      </view>
    </view>
  </view>
</template>

<script setup>
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import leftArrowBlack from '@/static/common/left-arrow.png';
import leftArrowWhite from '@/static/common/left-arrow-w.png';

const props = defineProps({
  contentClass: {
    type: String,
    default: '',
  },
  isNavBar: {
    type: Boolean,
    default: true,
  },
  padding: {
    type: String,
    default: '',
  },
  isStatus: {
    type: Boolean,
    default: true,
  },
  isWhiteArrow: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.nav-bar-page {
  width: 100%;
  height: 100%;
  .nav-bar-page-content {
    position: relative;
    flex: 1;
    width: 100%;
    height: 0;
    min-height: 0;
    overflow: auto;
    .page-content {
      flex: 1;
      width: 100%;
      height: 0;
      min-height: 0;
      padding: 0 30rpx;
    }
    .nav-bar {
      width: 100%;
      padding: 38rpx 33rpx 33rpx;
      image {
        width: 22rpx;
        height: 36rpx;
        cursor: pointer;
      }
    }
  }
}
</style>
