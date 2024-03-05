<template>
  <view class="positioning flex-column">
    <nav-bar />
    <view class="mb24">
      <uv-search
        shape="round"
        bgColor="#ffffff"
        v-model="keyword"
        :showAction="false"
        placeholder="城市搜索"
      >
        <template v-slot:prefix>
          <image
            slot="searchIcon"
            class="search-icon"
            src="@/static/home/search.png"
          />
        </template>
      </uv-search>
    </view>
    <view v-if="cityList.length" class="flex1 content">
      <p
        class="search-city-item"
        v-for="item in cityList"
        :key="item.code"
        @click.stop="onCheckCity(item)"
      >
        {{ item.name }}
      </p>
    </view>
    <uv-empty v-else mode="list" marginTop="100"></uv-empty>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import { getCityList } from "@/api/recruit";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import { onLoad } from "@dcloudio/uni-app";

const keyword = ref("");
// const hotCity = ref([]);
const curCity = ref({});
// const initData = async () => {
//   const data = await getJobHotCity();
//   console.log(data);
//   hotCity.value = data.result;
// };
// initData();

onLoad(() => {
  //   const city = JSON.parse(uni.getStorageSync("jobCity") || "{}");
  //   curCity.value = city;
});

const onCheckCity = (item) => {
  uni.setStorageSync(
    "checkedCity",
    JSON.stringify({
      title: item.name,
      value: item.code,
    })
  );
  uni.navigateBack();
};

const cityList = ref([]);
watch(
  () => keyword.value,
  async (res) => {
    // if (!res) {
    //   cityList.value = [];
    //   return;
    // }
    const data = await getCityList({ name: res });
    cityList.value = data.result;
    console.log(data, 92376743);
  },
  {
    immediate: true
  }
);
</script>

<style scoped lang="scss">
.positioning {
  box-sizing: border-box;
  height: 100%;
  padding: 0 30rpx;
}
.content {
  overflow: auto;
}
.title {
  font-size: 32rpx;
  color: #333333;
}
:deep(.uv-search__content) {
  height: 80rpx;
  font-size: 30rpx;
}
.mb24 {
  margin-bottom: 24rpx;
}
.city-item {
  width: 152rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  background: #17bcef;
  border-radius: 8rpx;
  color: #fff;
  padding: 0 40rpx;
  margin: 0 40rpx 24rpx 0;
}
:deep(.uv-search__content__input) {
  font-size: 30rpx;
}
.search-icon {
  width: 42rpx;
  height: 42rpx;
  margin: 0 20rpx;
}
.positioning-con {
  overflow: auto;
}
.search-city-item {
  height: 80rpx;
  line-height: 80rpx;
  padding-left: 20rpx;
  position: relative;
  &::after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1rpx;
    content: "";
    background-color: #17bcef;
    transform: scaleY(0.5);
  }
  &:last-child::after {
    display: none;
  }
}
</style>
