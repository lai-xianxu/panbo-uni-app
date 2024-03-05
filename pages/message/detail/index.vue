<template>
  <view class="article">
    <nav-bar />
    <view class="article-con">
      <view class="article-title"> {{ msg.titile }} </view>
      <view class="article-sub-title">{{ msg.sendTime }}</view>
      <view class="article-info">{{ msg.msgAbstract }}</view>
      <view class="article-info" v-html="msg.msgContent">
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed} from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { getInformatioByid } from "@/api/advice";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const id = ref("");
const info = ref({});

const msg = computed(() => {
    return userStore.getters_common_msg
})
onLoad((params) => {
  // id.value = params.id;
  // const init = async () => {
  //   const data = await getInformatioByid({
  //     id: id.value,
  //   });
  //   info.value = data.result;
  // };
  // init();
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
  .article-info {
    margin-bottom: 10rpx;
  }
}
:deep() {
  img {
    width: 100% !important;
    height: auto !important;
  }
}
</style>
