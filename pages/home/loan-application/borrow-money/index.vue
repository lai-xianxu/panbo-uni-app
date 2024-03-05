<template>
  <view class="borrow-wrap">
    <view class="borrow-info">
      <view class="borrow-info-con">
        <view class="borrow-info-item">
          <view class="borrow-info-item-label">借款时间</view>
          <view class="borrow-info-item-value">{{ form.loanDate }}</view>
        </view>
        <view class="borrow-info-item">
          <view class="borrow-info-item-label">还款时间</view>
          <view class="borrow-info-item-value">
            <view class="repayment-time">
              <view
                class="repayment-time-item"
                :class="{ active: form.repaymentDateType == item.type }"
                v-for="item in dateList"
                :key="item.type"
                @click.stop="onDateChange(item)"
                >{{ item.name }}</view
              >
            </view>
          </view>
        </view>
        <view class="borrow-info-item">
          <view class="borrow-info-item-label">借款金额</view>
          <view class="borrow-info-item-value">
            <uv-input
              placeholder="请输入"
              type="digit"
              v-model="form.loanAmount"
              fontSize="16"
              border="surround"
            ></uv-input>
          </view>
        </view>
        <view class="borrow-info-item">
          <view class="borrow-info-item-label">利息金额</view>
          <view class="borrow-info-item-value">{{ interestAmount }}</view>
        </view>
        <view class="borrow-info-item flex-row">
          <view class="borrow-info-item-label">工作单位</view>
          <view class="borrow-info-item-value flex1">
            <uni-data-select
              v-model="form.workUnits"
              :localdata="companyList"
              @change="change"
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
              同意并签署<view class="file" @click.stop="onViewContract"
                >《借款电子合同》</view
              >
            </view>
          </uv-checkbox>
        </uv-checkbox-group>
      </view>
    </view>
    <view class="borrow-title" v-if="list?.length">
      <view class="title-suffix">历史借款记录</view>
      <view class="more-btn" @click.stop="onViewMore"
        >更多记录
        <image
          src="@/static/common/right-arrow.png"
          class="right-arrow"
        />
      </view>
    </view>
    <template v-if="list?.length">
      <HistoricalRecordList :list="list" @onRenewList="onRenewList" />
    </template>
    <uv-toast ref="toast"></uv-toast>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";

import {
  pbLoanManagement,
  pbLoanManagementList,
  getInterestRate,
  pbRecruitmentCompany,
} from "@/api/home";
import HistoricalRecordList from "../components/historical-record-list/index.vue";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import { onLoad } from "@dcloudio/uni-app";
import dayjs from "@/uni_modules/uv-ui-tools/libs/util/dayjs.js";

const checkboxValue = ref("");
const toast = ref();
const form = ref({
  loanType: "2", //借款
  workUnits: "", // 借款单位
  loanAmount: "", // 借款金额
  // interestAmount: "23", // 利息金额
  loanDate: dayjs(new Date()).format("YYYY-MM-DD"), // 借款日期
  // repaymentDate: "1", // 还款日期
  repaymentDateType: 3,
});
const workUnits = ref("");
const dateList = [
  {
    type: "1",
    name: "一个月",
  },
  {
    type: "3",
    name: "三个月",
  },
  {
    type: "6",
    name: "六个月",
  },
  {
    type: "12",
    name: "一年",
  },
];

const list = ref([]);
const getList = async () => {
  const data = await pbLoanManagementList({
    loanType: "2", //借款
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
  const data = await getInterestRate({ adjustmentType: 1 });
  restRateList.value = data?.result || [];
};
onLoad(async () => {
  getList();
  initCompany();
  initRestRate();
});

const interestAmount = computed(() => {
  const rate = restRateList.value.find(
    (res) => res.term == form.value.repaymentDateType
  );
  return rate?.amount
    ? ((rate?.amount?.split(".")?.[0] / 100) * form.value.loanAmount)?.toFixed(
        2
      )
    : "0.00";
});

const onDateChange = (item) => {
  form.value.repaymentDateType = item.type;
};

const onViewMore = () => {
  route("pages/home/loan-application/historical-record/index", { loanType: 2 });
};

const submit = async () => {
  const { loanAmount, workUnits } = form.value;
  if (!loanAmount) {
    toast.value.show({
      type: "warning",
      message: "借款金额不能为空",
      position: "top",
      icon: "error-circle",
    });
    return;
  }
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
    interestAmount: interestAmount.value,
  });
  toast.value.show({
    type: "success",
    message: "借款申请成功!",
    position: "top",
  });
  form.value.loanAmount = "";
  getList();
};
const onViewContract = () => {
  route("pages/my/iframe-page/index");
};
const onRenewList = () => {
  getList();
};
</script>

<style scoped lang="scss">
.borrow-info {
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
  .borrow-info-item {
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
          border: 1rpx solid #1a1a1a;
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
        border: 1rpx solid #1a1a1a;
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
  border: 1rpx solid #1a1a1a !important;
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
  .uv-input__content__field-wrapper__field {
    font-size: 24rpx !important;
    input::placeholder {
      font-size: 20rpx !important;
    }
  }
  .uni-select {
    border: 1rpx solid #1a1a1a;
    border-radius: 20rpx !important;
    font-size: 30rpx !important;
    height: 60rpx !important;
    .uni-select__input-placeholder {
      color: rgb(196, 200, 207);
      font-size: 20rpx;
    }
    .uni-icons {
      font-size: 28rpx !important;
    }
    .uni-select__input-text {
    font-size: 24rpx !important;
    }
    .uni-select__selector-item {
      line-height: 50rpx;
      font-size: 22rpx;
    }
  }
  .uni-label-text {
    display: none;
  }
}
</style>
