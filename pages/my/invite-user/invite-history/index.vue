<template>
  <nav-bar-page class="invite-history">
    <div class="history-content fss-c">
      <div class="history-title">已成功邀请用户：<text>{{ total }}</text> 人</div>
      <div class="history-card">
        <div class="card-item" v-for="item in list" :key="item.invitedUserId">
          <div class="fsbc">
            <div class="left-user">用户名称 <span v-if="item.invitedName">（{{item.invitedName}}）</span></div>
            <div class="right-status" v-if="item.inviteStatus == 1">已成功邀请</div>
            <div class="right-status error" v-if="!item.inviteStatus">拒绝邀请</div>
            <div class="right-status error" v-if="item.inviteStatus == 2">未入职</div>

          </div>
          <div class="invite-time">{{ item.inviteTime }}</div>
        </div>
      </div>
    </div>
  </nav-bar-page>
</template>

<script setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";

import { getMyInviteList } from "@/api/company";
const list = ref([]);
onLoad(async () => {
  const data = await getMyInviteList({ pageNo: 1, pageSize: 30 });
  list.value = data?.result?.records || [];
  console.log(data, 9347346);
});
const total = computed(() => {
  return list.value?.filter(res => res.inviteStatus == 1)?.length
})
</script>

<style scoped lang="scss">
.invite-history {
  .history-content {
    height: 100%;
    padding-bottom: 50rpx;
  }
  .history-title {
    font-size: 28rpx;
    line-height: 28rpx;
    font-weight: 400;
    color: #333333;
    text {
      color: #17bcef;
      font-weight: 600;
    }
  }
  .history-card {
    width: 100%;
    flex: 1;
    background: #ffffff;
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
    border-radius: 20rpx;
    margin-top: 30rpx;
    padding: 30rpx;
    overflow: auto;
    .card-item {
      padding-bottom: 30rpx;
      width: 620rpx;
      border-bottom: 1rpx solid #17bcef;
      margin-bottom: 30rpx;
      .left-user {
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 400;
        color: #333333;
      }
      .right-status {
        font-size: 28rpx;
        line-height: 28rpx;
        font-weight: 400;
        color: #17bcef;
        &.error {
          color: #ee4343;
        }
      }
      .invite-time {
        margin-top: 20rpx;
        font-size: 24rpx;
        line-height: 24rpx;
        font-weight: 400;
        color: #777777;
      }
    }
  }
}
</style>
