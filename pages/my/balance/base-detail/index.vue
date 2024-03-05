<template>
  <nav-bar-page class="base-detail">
    <image
      src="@/static/my/filter.png"
      class="filter-icon"
      @click.stop="oneop"
    />
    <view class="real-header">工资详情</view>

    <view
      v-if="baseList?.length"
      class="base-card"
      v-for="item in baseList"
      :key="item.id"
      :class="{ 'base-card--mb': item.show }"
    >
      <image
        v-if="item.grantState == 200"
        class="card-fafang"
        src="@/static/my/fafang.png"
      ></image>
      <view class="fsbc">
        <view class="card-text">{{ item.belongTime }}</view>
        <view class="card-borrow" @click.stop="onLoan">去借钱></view>
      </view>
      <view class="fsc mt60">
        <view class="card-text">实发工资</view>
        <number-view
          :number="item.realityWages"
          defaultValue
          color="block"
          class="ml30"
        />
      </view>
      <image
        src="@/static/common/left-arrow.png"
        class="open-icon"
        @click.stop="item.show = !item.show"
      />

      <uv-transition :show="item.show">
        <view class="card-base-con">
          <view class="card-line"></view>
          <view class="base-con">
            <view class="fsbc">
              <view class="card-base-text">基本工资 {{ item.basicWages }}</view>
              <view class="card-base-text">岗位工资 {{ item.postWages }}</view>
            </view>
            <view class="fsbc mt30">
              <view class="card-base-text"
                >社保代扣 -{{ item.socialSecurity }}</view
              >
              <view class="card-base-text"
                >考勤扣款 -{{ item.attendance }}</view
              >
            </view>
            <image
              src="@/static/common/left-arrow.png"
              class="close-icon"
              @click.stop="item.show = !item.show"
            />
          </view>
          <image src="@/static/my/juchi.png" class="base-con-img" />
        </view>
      </uv-transition>
    </view>

    <empty v-else />

    <Filter v-model="popupShow" @confirm="onConfirm" />
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import Filter from './components/filter.vue';
import { appGetPdWagesDetailList } from '@/api/my';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';

const popupShow = ref(false);
const oneop = () => {
  popupShow.value = true;
};

// 查询工资详情
const params = ref({
  endTime: '',
  startTime: '',
  grantState: '',
  maxAmt: '',
  minAmt: '',
});
const baseList = ref([]);
const getPdWagesDetailList = async () => {
  const { result } = await appGetPdWagesDetailList(params.value);
  result?.pdWagesDetailDtoList?.filter((e) => {
    e.show = false;
  });
  baseList.value = result?.pdWagesDetailDtoList || [];
};
getPdWagesDetailList();

// 去借钱
const onLoan = () => {
  route('pages/home/loan-application/index');
};

const onConfirm = (val) => {
  params.value = val;
  getPdWagesDetailList();
};
</script>

<style scoped lang="scss">
.base-detail {
  .filter-icon {
    position: absolute;
    top: 35rpx;
    right: 30rpx;
    width: 40rpx;
    height: 41rpx;
  }
  .base-card {
    position: relative;
    width: 100%;
    height: 220rpx;
    background: #ffffff;
    border-radius: 20rpx;
    box-shadow: 0rpx 4rpx 8rpx 0 rgba(12, 100, 127, 0.3);
    margin-bottom: 35rpx;
    padding: 30rpx 30rpx 15rpx;
    &--mb {
      margin-bottom: 210rpx;
    }
    .card-fafang {
      position: absolute;
      top: -10rpx;
      right: 26rpx;
      width: 110rpx;
      height: 121rpx;
    }
    .card-text {
      font-size: 28rpx;
      line-height: 28rpx;
      font-weight: 400;
      color: #333333;
    }
    .card-borrow {
      font-size: 24rpx;
      line-height: 24rpx;
      font-weight: 400;
      color: #17bcef;
    }
    .open-icon {
      position: absolute;
      bottom: 15rpx;
      left: 50%;
      width: 16rpx;
      height: 26rpx;
      transform: translateX(-50%) rotate(-90deg);
    }
    .close-icon {
      width: 16rpx;
      height: 26rpx;
      margin-top: 30rpx;
      margin-left: 50%;
      transform: translateX(-50%) rotate(90deg);
    }
    .card-base-con {
      position: relative;
      z-index: 1;
    }
    .card-line {
      width: 650rpx;
      height: 10rpx;
      background: #17bcef;
      border-radius: 5rpx;
      margin-top: 30rpx;
      margin-left: -10rpx;
    }

    .base-con {
      width: 628rpx;
      background: #ffffff;
      padding: 30rpx 30rpx 0;
      margin-top: -5rpx;
      .card-base-text {
        font-size: 24rpx;
        line-height: 24rpx;
        font-weight: 400;
        color: #333333;
      }
    }
    .base-con-img {
      width: 628rpx;
      height: 51rpx;
    }
  }
}
</style>
