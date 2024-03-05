<template>
  <view class="flex-column transfer">
    <nav-bar />
    <view class="flex1 transfer-wrap flex-column main-between">
      <view>
        <view class="flex-row main-between user">
          <view>
            <p class="title">余额转账给个人</p>
            <p class="name">用户名称({{ user.realName }})</p>
          </view>
          <image class="avatar" :src="user.avatar" />
        </view>
        <view class="money">
          <p class="money-label">金额</p>
          <uv-search
            placeholder=""
            bgColor="#ffffff"
            v-model="keyword"
            :showAction="false"
          >
            <template v-slot:prefix><span class="money-icon">¥</span></template>
          </uv-search>
        </view>
      </view>
      <p class="btn flex-center" @click.stop="onSub">确认转账</p>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onShow } from "@dcloudio/uni-app";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import { transfer } from "@/api/home";

const keyword = ref("844");
let password = ref("");
const inShurSub = async () => {
  await transfer({
    pwd: password.value,
    ...info.value,
    money: keyword.value,
  });
  uni.$uv.toast("转账成功");
  setTimeout(() => {
    route({ type: "navigateBack" });
  }, 500);
};
onShow(() => {
  const psw = uni.getStorageSync("scanPsw");
  if (psw?.length == 6) {
    password.value = psw;
    uni.clearStorageSync("scanPsw");
    inShurSub();
  }
});
const info = ref({});
const user = ref({})
onLoad(async (params) => {
  const { id, idCard, username, path } = params;
  if (!id) return;
  if (id) {
    info.value = { id, idCard, username };
    const data = await uni.$uv.http.get(path, {
      params: { id, idCard, username },
    });
    user.value = data.result
  }
});

const onSub = () => {
  route("pages/my/bank-card/pay-password-check/index", {
    from: "scanCode",
  });
};
</script>

<style scoped lang="scss">
.transfer {
  height: 100%;
  box-sizing: border-box;
  color: #333333;
  font-size: 28rpx;
}
.transfer-wrap {
  box-sizing: border-box;
  padding: 30rpx;
  margin: 0 30rpx 30rpx;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: -4rpx 0rpx 8rpx 4rpx rgba(12, 100, 127, 0.3);
}
.user {
  .title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 20rpx;
  }
  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
  }
}
.money {
  margin-top: 65rpx;
  border-bottom: 1px solid #17bcef;
  padding-bottom: 16rpx;
  .money-label {
    margin-bottom: 30rpx;
  }
}
.btn {
  width: 600rpx;
  height: 80rpx;
  background: linear-gradient(0deg, #17bcef 0%, #378cfd 100%);
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
  border-radius: 40rpx;
  margin-bottom: 85rpx;
  color: #ffffff;
}
:deep(.uni-input-input) {
  font-size: 48rpx;
  font-weight: bold;
  color: #333333;
}
.money-icon {
  font-size: 48rpx;
  font-weight: 700;

  color: #333333;
  margin: 0 10rpx;
}
</style>
