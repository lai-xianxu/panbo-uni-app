<template>
  <view class="tab-wrap">
    <view
      class="tab-wrap-item"
      :class="{ active: modelValue == item.id, dot: item.isDot }"
      v-for="item in list"
      :key="item.name"
      @click.stop="onClick(item)"
      >
      <view style="position: relative; z-index: 2;">
        {{ item.name }}
      </view>
      <image
        class="act-image"
        v-if="modelValue == item.id"
        src="@/static/home/tab-active.png"
      ></image>
    </view>
  </view>
</template>

<script setup>
const emit = defineEmits(["update:modelValue", "onTabChange"]);

const props = defineProps({
  modelValue: "",
  list: {
    default: () => [],
  },
});
const onClick = (item) => {
  emit("update:modelValue", item.id);
  emit("onTabChange", item.id);
};
</script>

<style scoped lang="scss">
.tab-wrap {
  display: flex;
  height: 30rpx;
  align-items: center;
  &-item {
    position: relative;
    font-size: 30rpx;
    color: #777777;
    transition: 0.2s;
    margin-right: 34rpx;
    padding-right: 6rpx;
    &.active {
      position: relative;
      font-size: 32rpx;
      color: #333333;
      font-weight: 500;
      .act-image {
        position: absolute;
        bottom: 4rpx;
        left: 0;
        // right: 0;
        width: 100%;
        height: 10rpx;
      }
    }
    &.dot {
      position: relative;
      &::after {
        position: absolute;
        content: " ";
        width: 24rpx;
        height: 24rpx;
        background: #f56c6c;
        border-radius: 50%;
        right: -10rpx;
        top: 0;
      }
    }
  }
}
</style>
