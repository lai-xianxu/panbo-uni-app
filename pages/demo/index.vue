<template>
  <view class="container">
    <text>首页</text>
    <!-- 图标 -->
    <uni-icons type="auth-filled" size="30" color="pink"></uni-icons>
    <!-- uv-icon按钮 -->
    <uv-button type="primary" :plain="true" text="镂空"></uv-button>
    <!-- 自动引入组件 -->
    <demo />
  </view>
</template>

<script setup>
// 引入
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
onLoad(() => {
  uni.getSystemInfo({
    success: (res) => {
      console.log(res, 'res');
    },
  });
});

// pinia
import { useCounterStore } from '@/stores/demo';
const counter = useCounterStore();
counter.actions_count();
console.log(counter.getters_count, 'counter.getters_count');
</script>

<style scoped lang="scss">
.container {
  color: $uni-error; // scss变量
  // background: url('@/static/logo.png') no-repeat; // 图片导入
  // background-size: contain; 
}
</style>
