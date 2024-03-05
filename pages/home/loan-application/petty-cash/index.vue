<template>
  <view class="petty-cash">
    <view class="petty-cash-info">
      <view class="petty-cash-con">
        <view class="petty-cash-item">
          <view class="petty-cash-item-label">借款时间</view>
          <view class="petty-cash-item-value">{{ form.loanDate }}</view>
        </view>
        <view class="petty-cash-item">
          <view class="petty-cash-item-label">还款时间</view>
          <view class="petty-cash-item-value">{{ form.repaymentDate }}</view>
        </view>
        <view class="petty-cash-item">
          <view class="petty-cash-item-label">借款金额</view>
          <view class="petty-cash-item-value">{{ form.loanAmount }}</view>
        </view>
        <view class="petty-cash-item">
          <view class="petty-cash-item-label">利息金额</view>
          <view class="petty-cash-item-value">{{ interestAmount }}</view>
        </view>
        <view class="petty-cash-item flex-row">
          <view class="petty-cash-item-label">工作单位</view>
          <view class="petty-cash-item-value flex1">
            <uni-data-select
              v-model="form.workUnits"
              :localdata="companyList"
              label="请选择"
            ></uni-data-select>
          </view>
        </view>
      </view>
      <view class="borrow-sub-btn" @click.stop="submit">提交申请</view>
      <view class="agree-radio">
        <uv-checkbox-group v-model="checkboxValue">
          <uv-checkbox
            shape="circle"
            :disabled="false"
            :name="true"
            iconSize="22"
          >
            <view class="flex-row">
              同意并签署
            <view class="file" @click.stop="onViewContract"
              >《备用金电子合同》</view
            >
            </view>
          </uv-checkbox>
        </uv-checkbox-group>
      </view>
    </view>
    <view class="borrow-title" v-if="list?.length">
      <view class="title-suffix">历史备用金记录</view>
      <view class="more-btn" @click.stop="onViewMore"
        >更多记录
        <image
          src="@/static/common/right-arrow.png"
          class="right-arrow"
        />
      </view>
    </view>
    <template v-if="list?.length">
      <HistoricalRecordList :list="list" @onRenewList="onRenewList"/>
    </template>
    <uv-toast ref="toast"></uv-toast>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import HistoricalRecordList from "../components/historical-record-list/index.vue";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import { onLoad } from "@dcloudio/uni-app";
import dayjs from "@/uni_modules/uv-ui-tools/libs/util/dayjs.js";
import {
  pbLoanManagement,
  pbLoanManagementList,
  pbRecruitmentCompany,
  getInterestRate
} from "@/api/home";

const checkboxValue = ref("");
const form = ref({
  loanType: "1", // 备用金
  workUnits: "", // 借款单位
  loanAmount: "500", // 借款金额
  // interestAmount: "23", // 利息金额
  loanDate: dayjs(new Date()).format("YYYY-MM-DD"), // 借款日期
  repaymentDate: dayjs().add(7, "day").format("YYYY-MM-DD"), // 还款日期
});

const toast = ref();
const list = ref([]);
const getList = async () => {
  const data = await pbLoanManagementList({
    loanType: "1", //借款
    pageNo: 1,
    pageSize: 2,
  });
  list.value = data?.result?.records || [];
};

const companyList = ref([]);
const initCompany = async () => {
  const data = await pbRecruitmentCompany();
  companyList.value = data?.result || [];
};
const restRateList = ref([]);
const initRestRate = async () => {
  const data = await getInterestRate({ adjustmentType: 4 });
  restRateList.value = data?.result || [];
};
onLoad(async () => {
  getList();
  initCompany();
  initRestRate();
});

const interestAmount = computed(() => {
  const rate = restRateList.value.find((res) => res.adjustmentType == 4) || {};
  return rate?.amount
    ? ((rate?.amount?.split(".")?.[0] / 100) * form.value.loanAmount)?.toFixed(
        2
      )
    : "0.00";
});

const onViewMore = () => {
  route("pages/home/loan-application/historical-record/index", { loanType: 1 });
};
const submit = async () => {
  const { workUnits } = form.value;
  if (!workUnits) {
    toast.value.show({
      type: "warning",
      message: "工作单位不能为空",
      position: "top",
      icon: "error-circle",
    });
    return;
  }
  if (!checkboxValue.value[0]) {
    toast.value.show({
      type: "warning",
      message: "请同意并签署《借款电子合同》",
      position: "top",
      icon: "error-circle",
    });
    return;
  }
  await pbLoanManagement({
    ...form.value,
    interestAmount: interestAmount.value
  });
  form.value.workUnits = "";
  toast.value.show({
    type: "success",
    message: "备用金申请成功!",
    position: "top",
  });
  getList();
};
const onViewContract = () => {
  route("pages/my/iframe-page/index");
};
const onRenewList = () => {
  getList();
}
</script>

<style scoped lang="scss">
.petty-cash-info {
  background: #ffffff;
  box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
  border-radius: 20rpx;
  padding: 30rpx;
  .borrow-sub-btn {
    width: 600rpx;
    height: 80rpx;
    background: linear-gradient(0deg, #17bcef 0%, #378cfd 100%);
    box-shadow: 0rpx 4rpx 8rpx 0rpx rgba(13, 101, 128, 0.3);
    border-radius: 40rpx;
    font-size: 28rpx;
    color: #ffffff;
    line-height: 80rpx;
    text-align: center;
    cursor: pointer;
    margin-top: 70rpx;
  }
  .agree-radio {
    display: flex;
    justify-content: center;
    margin-top: 32rpx;
    color: #333333;
    .file {
      color: #17bcef;
    }
  }
  .petty-cash-item {
    margin-bottom: 25rpx;
    display: flex;
    align-items: center;
    &:last-child {
      margin-bottom: 0;
    }
    &-label {
      font-size: 28rpx;
      color: #1a1a1a;
      margin-right: 40rpx;
      flex-shrink: 0;
    }
    &-value {
      font-size: 28rpx;
      color: #333333;
      .repayment-time {
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        &-item {
          width: 120rpx;
          height: 60rpx;
          border: 1px solid #1a1a1a;
          border-radius: 20rpx;
          text-align: center;
          line-height: 60rpx;
          color: #1a1a1a;
          margin: 0 10rpx 10rpx 0;
          flex-wrap: wrap;

          &.active {
            background: #17bcef;
            font-size: 28rpx;
            color: #ffffff;
            border: none;
          }
        }
      }
      .select-com {
        width: 300rpx;
        height: 60rpx;
        border: 1px solid #1a1a1a;
        border-radius: 20rpx;
        text-align: center;
        line-height: 60rpx;
        color: #1a1a1a;
      }
    }
  }
}
.borrow-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 30rpx 0;
}
.more-btn {
  font-size: 28rpx;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  .right-arrow {
    height: 22rpx;
    width: 16rpx;
    margin-left: 8rpx;
  }
}
:deep(.uv-border) {
  border: 1px solid #1a1a1a !important;
}
:deep(.uv-input) {
  box-sizing: border-box;
  height: 60rpx !important;
  border-radius: 20rpx !important;
  width: 300rpx;
}
:deep(.uv-checkbox-group) {
  justify-content: center;
}
:deep {
  .uni-select {
    border: 1rpx solid #1a1a1a;
    border-radius: 20rpx;
    font-size: 24rpx;
  }
}
</style>
