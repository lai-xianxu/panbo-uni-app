<template>
  <view class="social-con">
    <nav-bar />
    <view class="title title-suffix">社会保险信息</view>
    <render-card class="content" :list="list"/>
  </view>
</template>

<script setup>
import { ref } from "vue";
const list = ref([
  {
    label: "证件类型",
    value: "身份证",
  },
  {
    label: "证件号码",
    value: "321199347723974845",
  },
  {
    label: "姓名",
    value: "李凯",
  },
  {
    label: "联系电话",
    value: "1984849995454",
  },
  {
    label: "民族",
    value: "汉",
  },
  {
    label: "户口性质",
    value: "农村户口",
  },
  {
    label: "户口所在地",
    value: "贵阳",
  },
  {
    label: "账户类型",
    value: "灵活职工社保",
  },
  {
    label: "国籍",
    value: "中国",
  },
  {
    label: "文化程度",
    value: "初中",
  },
  {
    label: "参加工作时间",
    value: "2023-5-6",
  },
  {
    label: "市",
    value: "贵阳市",
  },
  {
    label: "区/县",
    value: "开阳县",
  },
  {
    label: "农民工标识",
    value: "是",
  },
  {
    label: "退役军人标识",
    value: "是",
  },
  {
    label: "参保地行政区划",
    value: "贵州省",
  },
]);
</script>

<style scoped lang="scss">
.social-con {
  padding: 0 0 50rpx;
  display: flex;
  height: 100%;
  flex-direction: column;
}
.title {
  font-size: 32rpx;
  color: #333333;
  margin-bottom: 30rpx;
  padding-left: 30rpx;
}
.content {
  margin: 0 30rpx;
}
</style>
