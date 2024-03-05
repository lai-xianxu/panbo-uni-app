<template>
  <view class="home-nav-wrap">
    <view
      v-for="item in list"
      :key="item.name"
      @click="onView(item)"
      class="home-nav-wrap-item"
    >
      <image class="icon" :src="item.icon" />
      <view class="name">{{ item.name }}</view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import icon1 from "@/static/home/home-nav-icon1.png";
import icon2 from "@/static/home/home-nav-icon2.png";
import icon3 from "@/static/home/home-nav-icon3.png";
import icon4 from "@/static/home/home-nav-icon4.png";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import { getOneByType } from "@/api/home";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();
const info1 = ref({});
const info2 = ref({});
const initData = async () => {
  const data = await getOneByType({
    type: "2",
  });
  const data1 = await getOneByType({
    type: "1",
  });
  info1.value = data.result;
  info2.value = data1.result;
};
initData();
const list = computed(() => {
  let arr = [
    {
      name: "社会保险",
      icon: icon1,
      // url: info2.value.url
      path: "pages/home/social-insurance/index",
    },
    {
      name: "商业保险",
      icon: icon2,
      path: "pages/home/commercial-insurance/index",
    },
    {
      name: "收款码",
      icon: icon3,
      type: 1,
      path: "pages/home/collection-code/index",
    },
    {
      name: "申请借款",
      icon: icon4,
      path: "pages/home/loan-application/index",
      hidden: userStore.getters_is_new_user
    },
  ];
  return arr.filter(res => !res.hidden)
});
const onView = (item) => {
  if (item.type == 1) {
    if (userStore.state_user?.userInfo?.isRealAuth > 0) {
      route(item.path);
    } else {
      uni.showModal({
        title: "未实名认证",
        content: "立即去我的设置-实名认证 ? ",
        confirmText: "去实名认证",
        success(res) {
          if (res.confirm) {
            route("pages/setting/real-name-auth/index")
          }
        },
      });
    }
    return;
  }
  if (item.path) {
    route(item.path);
  } else {
    // plus.runtime.openURL(item.url);
    // route("pages/my/iframe-page/index", {
    //   url: item.url,
    // });
    // const webview = plus.webview.create(item.url, "newWebview");
    // webview.show();
    plus.runtime.openWeb(item.url);
  }
};
</script>

<style scoped lang="scss">
.home-nav-wrap {
  padding: 0 50rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  &-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 120rpx;
    height: 120rpx;
    .icon {
      width: 60rpx;
      height: 60rpx;
    }
    .name {
      font-size: 28rpx;
    }
  }
}
</style>
