<template>
  <view class="positioning flex-column">
    <nav-bar />
    <p class="title mb24">当前定位城市: {{ curCity.title || curCity.name }}</p>
    <view class="mb24">
      <uv-search
        shape="round"
        bgColor="#ffffff"
        v-model="keyword"
        :showAction="false"
        placeholder=""
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
    <view class="flex1 positioning-con" v-if="!keyword">
      <view>
        <p class="title mb24">当前/历史访问城市: {{ curCity.title || curCity.name }}</p>
        <view class="city-item" @click.stop="onCheck(curCity)">
          {{ curCity.title || curCity.name }}
        </view>
      </view>
      <view>
        <p class="title mb24">热门城市</p>
        <view class="flex-row flex-wrap">
          <view
            class="city-item"
            v-for="item in hotCity"
            :key="item.value"
            @click.stop="onCheck(item)"
          >
            {{ item.name || item.title }}
          </view>
        </view>
      </view>
    </view>
    <view v-else>
      <view v-if="cityList.length">
        <p class="search-city-item" v-for="item in cityList" :key="item.code" @click.stop="onCheckCity(item)">
          {{ item.name }}
        </p>
      </view>
      <uv-empty v-else mode="list" marginTop="100"></uv-empty>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import { getJobHotCity, getCityList } from "@/api/recruit";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import { onLoad } from "@dcloudio/uni-app";

const keyword = ref("");
const hotCity = ref([]);
const curCity = ref({});
const initData = async () => {
  const data = await getJobHotCity();
  console.log(data);
  hotCity.value = data.result;
};
initData();

onLoad(() => {
  console.log(uni.getStorageSync("jobCity"), "jobCity232")
  const city = JSON.parse(uni.getStorageSync("jobCity") || "{}");
  curCity.value = city;
});

const onCheck = (item) => {
  console.log(item,4545)
  uni.setStorageSync("jobCity", JSON.stringify(item));
  route({
    type: "switchTab",
    url: "pages/position/index",
  });
  
};

const onCheckCity = (item) => {
  onCheck({
    title: item.name,
    value: item.code
  })
}

const cityList = ref([]);
watch(
  () => keyword.value,
  async (res) => {
    if (!res) {
      cityList.value = [];
      return;
    }
    const data = await getCityList({ name: res });
    cityList.value = data.result;
    console.log(data, 92376743);
  }
);
</script>

<style scoped lang="scss">
.positioning {
  box-sizing: border-box;
  height: 100%;
  padding: 0 30rpx;
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
