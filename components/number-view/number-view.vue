<template>
  <view class="number-view fsc">
    <text :class="{ 'blocl-text': color == 'block' }">{{
      isEye ? number : '****'
    }}</text>
    <image
      v-if="!isEye"
      :src="closeImg[color]"
      class="close-eye"
      @click.stop="onEye"
    />
    <image
      v-else
      :src="readImg[color]"
      class="read-eye"
      @click.stop="onEye"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue';
import closeEye from '@/static/my/close-eye.png';
import closeEyeB from '@/static/my/close-eye-block.png';
import readEye from '@/static/my/read-eye.png';
import readEyeB from '@/static/my/read-eye-block.png';
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const props = defineProps({
  number: {
    type: [Number, String],
    default: 0,
  },
  defaultValue: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: 'white',
  },
});

const closeImg = {
  white: closeEye,
  block: closeEyeB,
};
const readImg = {
  white: readEye,
  block: readEyeB,
};
const isEye = ref(props.defaultValue);

const onEye = () => {
  if (userStore.getters_is_new_user) return;
  isEye.value = !isEye.value
}
</script>

<style scoped lang="scss">
.number-view {
  .close-eye {
    width: 28rpx;
    height: 15rpx;
    margin-left: 22rpx;
  }
  .read-eye {
    width: 30rpx;
    height: 24rpx;
    margin-left: 22rpx;
  }
  text {
    font-size: 48rpx;
    line-height: 48rpx;
    color: #fff;
  }
  .blocl-text {
    font-size: 32rpx;
    line-height: 32rpx;
    color: #333;
  }
}
</style>
