<template>
  <view class="fcs w100">
    <uv-empty :mode="mode" :marginTop="marginTop" :text="text"></uv-empty>
  </view>
</template>

<script setup>
const props = defineProps({
  mode: {
    type: String,
    default: 'list',
  },
  marginTop: {
    type: String,
    default: '100',
  },
  text: {
    type: String,
    default: '列表为空',
  },
});
</script>

<style scoped lang="scss"></style>
