<template>
  <view class="article">
    <nav-bar />
    <view class="article-con">
      <view class="article-title">
        {{ info.title }}
      </view>
      <view class="article-sub-title">{{info.userId_dictText}}/{{ info.publishTime }}</view>
      <view class="article-info"  v-html="info.content"></view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getInformatioByid } from "@/api/advice";

const id = ref("");
const info = ref({});
onLoad((params) => {
  id.value = params.id;
  const init = async () => {
    const data = await getInformatioByid({
      id: id.value,
    });
    info.value = data.result;
  };
  init();
});
</script>

<style scoped lang="scss">
.article {
  display: flex;
  height: 100%;
  flex-direction: column;
  .article-con {
    flex: 1;
    overflow: auto;
    padding: 0 30rpx 30rpx;
    box-sizing: border-box;
    &-con {
      margin-top: 32rpx;
    }
  }
  &-title {
    font-size: 32rpx;
    font-weight: bold;

    color: #333333;
  }
  &-sub-title {
    font-size: 28rpx;
    color: #aaaaaa;
    margin: 24rpx 0 16rpx;
  }
}
:deep() {
  img {
    width: 100% !important;
    height: auto !important;
  }
}
</style>
