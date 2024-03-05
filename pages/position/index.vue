<template>
  <view class="position-wrap flex-column">
    <nav-bar :isNavBar="false" />
    <view class="position-search">
      <uv-search
        shape="round"
        bgColor="#ffffff"
        v-model="keyword"
        :showAction="false"
      >
        <template v-slot:prefix>
          <image
            slot="searchIcon"
            class="search-icon"
            src="@/static/home/search.png"
          />
        </template>
      </uv-search>
      <view class="orien" @click.stop="onPositioning">
        <span class="name">{{ jobCity.title || jobCity.name }}</span>
        <image class="image" src="@/static/common/arrow-down.png" />
      </view>
    </view>
    <view class="message-title-nav">
      <tab :list="tabList" v-model="active" @onTabChange="onTabChange" />
    </view>
    <view
      class="flex1 position-content"
      v-if="status == 'loading' || list?.length"
    >
      <scroll-view
        style="height: 100%"
        scroll-y="true"
        lower-threshold="20"
        @scrolltolower="getData"
      >
        <PositionList :list="list" />
        <uv-load-more style="padding: 20rpx 0" :status="status" />
      </scroll-view>
    </view>
    <uv-empty
      v-if="!list?.length && status != 'loading'"
      mode="list"
      marginTop="100"
    ></uv-empty>
    <uv-notify ref="notifyRef"></uv-notify>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue';
import PositionList from './position-list/index.vue';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { getRecruitmentList } from '@/api/recruit';
import { onShow, onLoad } from '@dcloudio/uni-app';

const jobCity = ref({});
const notifyShow = ref(true);
const notifyRef = ref(null);
onLoad(() => {
  uni.$on('refreshTabbar', () => {});
  uni.getLocation({
    type: 'gcj02',
    geocode: true,
    success: function (res) {
      if (res?.address?.cityCode && res?.address?.city) {
        uni.setStorageSync(
          'jobCity',
          JSON.stringify({
            title: res?.address?.city,
            value: res?.address?.cityCode,
          })
        );
      }
    },
    complete() {
      notifyShow.value = false;
    },
  });
});
watch(
  () => [notifyShow.value, notifyRef.value],
  () => {
    setTimeout(() => {
      if (notifyShow.value) {
        notifyRef.value.show({
          type: 'warning',
          message: '为了提供更贴近您所在地区的职位推荐，我们需要获取您的位置信息',
          duration: 10000,
          safeAreaInsetTop: true,
        });
      } else {
        notifyRef.value.close();
      }
    }, 600);
  },
  {
    immediate: true,
    deep: true,
  }
);
onShow(() => {
  const cityStore = uni.getStorageSync('jobCity');
  console.log(cityStore, 'cityStore', jobCity.value);
  const city = cityStore
    ? JSON.parse(cityStore)
    : {
        title: '上海',
        value: '3101',
      };
  uni.setStorageSync('jobCity', JSON.stringify(city));
  if (city?.value != jobCity.value?.value) {
    jobCity.value = city;
    onTabChange();
  }
});
const keyword = ref('');
const active = ref('1');
const status = ref('loading');
const tabList = ref([
  {
    name: '推荐',
    id: '1',
  },
  {
    name: '最新',
    id: '2',
  },
  {
    name: '最热',
    id: '3',
  },
]);
const list = ref([]);
let pageNo = 1;
let pageSize = 12;
const onPositioning = () => {
  route('pages/position/positioning/index');
};
const getData = async () => {
  if (status.value == 'nomore') return;
  if (pageNo == 1) {
    list.value = [];
  }
  const data = await getRecruitmentList({
    pageNo,
    pageSize,
    screening: active.value,
    jobTitle: keyword.value,
    // jobCity: jobCity.value.value,
  });
  pageNo++;
  list.value = [...list.value, ...(data?.result?.records || [])];
  if ((data?.result?.records || []).length < pageSize) {
    status.value = 'nomore';
  }
};
// getData();
const onTabChange = () => {
  pageNo = 1;
  status.value = 'loading';
  getData();
};
watch(
  () => keyword.value,
  () => {
    onTabChange();
  }
);
</script>

<style scoped lang="scss">
:deep(.uv-search__content) {
  height: 80rpx;
}
.position-wrap {
  padding: 15rpx 30rpx;
  height: 100%;
  box-sizing: border-box;
  .position-content {
    overflow: auto;
    padding-top: 30rpx;
  }
}
.position-search {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
  .orien {
    display: flex;
    align-items: center;
    margin-left: 26rpx;
    .image {
      width: 26rpx;
      height: 16rpx;
    }
    .name {
      margin-right: 10rpx;
      //   font-size: 32rpx;
      color: #333333;
    }
  }
}
:deep(.uv-search__content__input) {
  font-size: 30rpx;
}
.search-icon {
  width: 42rpx;
  height: 42rpx;
  margin: 0 20rpx;
}
</style>
