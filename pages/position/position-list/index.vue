<template>
  <view class="flex-column">
    <view
      class="position-item"
      v-for="item in list"
      :key="item.id"
      @click.stop="onViewPosition(item)"
    >
      <view class="flex-row main-between position-item-title">
        <span class="position-item-title-name">{{ item.jobTitle }}</span>
        <span class="position-item-title-money">{{
          item.jobExperience_dictText
        }}</span>
      </view>
      <view class="flex-row position-item-tag flex-wrap">
        <span v-if="item.jobAddress" class="tag-item">{{
          item.jobAddress
        }}</span>
        <span v-if="item.jobExperience_dictText" class="tag-item">{{
          item.jobExperience_dictText
        }}</span>
        <span v-if="item.educationRequired_dictText" class="tag-item">{{
          item.educationRequired_dictText
        }}</span>
      </view>
      <view
        class="flex-row position-item-company"
      >
        <image class="flex0 company-image" mode="aspectFit" :src="item?.companyVO?.logoUrl" />
        <view
          class="flex1 flex-column main-around flex-row position-item-company"
        >
          <p class="position-item-company-name">
            {{ item?.companyVO?.companyName }}
          </p>
          <p class="position-item-company-desc">
            {{ item?.companyVO?.description }}
          </p>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";

const props = defineProps({
  list: {
    default: () => [],
  },
});
const onViewCompany = (item) => {
  route("pages/position/company-detail/index", {
    id: item?.companyVO?.id,
  });
};
const onViewPosition = (item) => {
  route("pages/position/position-detail/index", {
    id: item.id,
  });
};
</script>

<style scoped lang="scss">
.position-item {
  margin-bottom: 24rpx;

  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
  border-radius: 20rpx;
  padding: 30rpx;
  &-title {
    margin-bottom: 12rpx;
    &-name {
      font-size: 28rpx;
      font-weight: bold;
      color: #333333;
    }
    &-money {
      font-size: 28rpx;
      color: #17bcef;
    }
  }
  &-tag {
    margin-bottom: 10rpx;
    .tag-item {
      background: #17bcef;
      border-radius: 8rpx;
      font-size: 24rpx;
      color: #ffffff;
      padding: 0 8rpx;
      margin-right: 20rpx;
      margin-bottom: 10rpx;
      &:last-child {
        margin-right: 0;
      }
    }
  }
  &-company {
    .company-image {
      width: 100rpx;
      height: 100rpx;
      border-radius: 10rpx;
      margin-right: 30rpx;
    }
    &-name {
      font-size: 28rpx;
      color: #333333;
    }
    &-desc {
      font-size: 28rpx;
      color: #777777;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      /* autoprefixer: ignore next */
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
    }
  }
}
</style>
