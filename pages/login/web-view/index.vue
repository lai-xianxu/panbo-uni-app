<template>
  <view>
    <web-view
      style="background-color: #fff"
      :src="url"
      :update-title="false"
    ></web-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
// 初始化
const url = ref('');
onLoad((params) => {
  url.value = params.url || '';
  if (params.title) {
    setTimeout(() => {
      uni.setNavigationBarTitle({
        title: params.title,
      });
    });
  }
});
</script>

<style lang="scss"></style>
