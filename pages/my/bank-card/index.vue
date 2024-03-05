<template>
  <nav-bar-page padding="0 30rpx 0 0" class="pb-page">
    <uv-swipe-action>
      <uv-swipe-action-item
        :options="options"
        v-for="(item, index) in bankCards"
        :key="item.id"
        :index="item.id"
        :name="item.id"
        @click="onClickSwipe"
      >
        <view class="bank-card" :style="{ backgroundColor: item.colour }">
          <view class="fsc">
            <image
              :src="item.img?.replace(/\r\n/g, '')"
              class="bank-card-avatar"
            />
            <view>
              <view class="bank-card-name">{{ item.cardTypeDis }}</view>
              <view class="bank-card-type">{{ item.useTypeDis }}</view>
            </view>
          </view>
          <view class="bank-card-number">{{
            `${item.cardNo}`.replace(/(.{4})/g, '$1 ')
          }}</view>
        </view>
      </uv-swipe-action-item>
    </uv-swipe-action>

    <view class="add-bank-card fcc" @click.stop="onAddCard">
      <image src="@/static/my/add.png" class="add-bank-card-icon" />
      <view>添加银行卡</view>
    </view>
  </nav-bar-page>
</template>

<script setup>
import { ref } from 'vue';
import breakIcon from '@/static/my/break.png';
import { appPdUserCardList, appDeleteCard } from '@/api/my';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { onShow } from '@dcloudio/uni-app';
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

onShow(() => {
  getBankCards();
});

// 滑动操作项
const options = [
  {
    icon: breakIcon,
    text: '解除绑定',
    style: {
      backgroundColor: '#fff',
      color: '#cc0000',
      fontSize: '28rpx',
      flexDirection: 'column',
      padding: '0 20px',
    },
  },
];

// 获取银行卡
const bankCards = ref([]);
const getBankCards = async () => {
  const { result } = await appPdUserCardList();
  bankCards.value = result?.pdUserCardDtoList || [];
};

// 删除银行卡
const onClickSwipe = async (val) => {
  await appDeleteCard({ id: val.name });
  uni.$uv.toast('删除成功');
  getBankCards();
};

// 添加银行卡
const onAddCard = () => {
  if (!userStore.getters_user_info.transactionPassword) {
    uni.$uv.toast('请先设置交易密码');
    return;
  }
  route('pages/my/bank-card/pay-password-check/index');
};
</script>

<style scoped lang="scss">
.bank-card {
  position: relative;
  width: 100%;
  height: 260rpx;
  background: #004f94;
  // background: #ccc;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 8rpx 0 rgba(203, 41, 41, 0.3);
  padding: 30rpx;
  // margin-bottom: 30rpx;
  .bank-card-avatar {
    width: 60rpx;
    height: 60rpx;
    margin-right: 10rpx;
    border-radius: 6rpx;
  }
  .bank-card-name {
    font-size: 28rpx;
    font-weight: 400;
    color: #ffffff;
    line-height: 28rpx;
  }
  .bank-card-type {
    font-size: 24rpx;
    font-weight: 400;
    color: #ffffff;
    line-height: 24rpx;
    margin-top: 10rpx;
  }
  .bank-card-number {
    position: absolute;
    top: 160rpx;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 48rpx;
    font-weight: 400;
    color: #ffffff;
    line-height: 48rpx;
  }
}
.add-bank-card {
  height: 160rpx;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 8rpx 0 rgba(12, 100, 127, 0.3);
  font-size: 28rpx;
  font-weight: 400;
  color: #333333;
  line-height: 28rpx;
  margin-bottom: 60rpx;
  margin-left: 30rpx;
  .add-bank-card-icon {
    width: 30rpx;
    height: 31rpx;
    margin-right: 20rpx;
  }
}
</style>
