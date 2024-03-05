<template>
  <view class="resume-contant flex-column">
    <view class="flex1">
      <view class="field-item">
        <p class="label">公司名称</p>
        <uv-input
          v-model="form.companyName"
          placeholder="请输入公司名称"
          border="bottom"
        ></uv-input>
      </view>
      <view class="field-item">
        <p class="label" @click="onOpenPicker">所属行业</p>
        <uv-input
          @click="onOpenPicker"
          :modelValue="form.trade_dictText"
          placeholder="请输入所属行业"
          border="bottom"
          >{{ form.trade_dictText }} ></uv-input
        >
      </view>
      <view class="field-item">
        <p class="label">在职时间</p>
        <p class="time-range flex-row">
          <span class="flex1" @click.stop="onOpen('employmentPeriodStart')">{{
            form.employmentPeriodStart
          }}</span>
          <span class="line">-</span>
          <span class="flex1" @click.stop="onOpen('employmentPeriodEnd')">{{
            form.employmentPeriodEnd
          }}</span>
        </p>
      </view>
      <view class="field-item">
        <p class="label">职位名称</p>
        <uv-input
          v-model="form.positionName"
          placeholder="请输入职位名称"
          border="bottom"
        ></uv-input>
      </view>
      <view class="field-item">
        <p class="label">工作内容</p>
        <uv-input
          v-model="form.jobDescription"
          placeholder="请输入工作内容"
          border="bottom"
        ></uv-input>
      </view>
    </view>
    <view class="resume-contant-footer flex0 flex-center">
      <p class="del-btn flex-center" @click.stop="modal?.open()">删除</p>
      <p class="save-btn flex-center" @click.stop="onSave">保存</p>
    </view>
    <uv-datetime-picker
      ref="datetimePicker"
      v-model="time"
      mode="date"
      :minDate="631123200000"
      @confirm="confirm"
    >
    </uv-datetime-picker>
    <uv-picker
      ref="tradePicker"
      :columns="tradeList"
      keyName="title"
      visibleItemCount="8"
      @confirm="onTradeConfirm"
    ></uv-picker>
    <uv-modal
      ref="modal"
      title="提示"
      showCancelButton
      content="确认删除次工作经历?"
      @confirm="confirmDel"
    ></uv-modal>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { addWork, getTradeDict, deleteByWork, updateWork, getMyResume} from "@/api/recruit";
import { onLoad } from "@dcloudio/uni-app";
import dayjs from "@/uni_modules/uv-ui-tools/libs/util/dayjs.js";

const modal = ref();
const datetimePicker = ref();
const tradePicker = ref();
const time = ref("2015-07");
const form = ref({
  jobDescription: "",
  positionName: "",
  trade: "",
  trade_dictText: "",
  companyName: "",
  employmentPeriodStart: "2015-07-01", // 入学时间
  employmentPeriodEnd: "2016-07-01", // 毕业时间
});
let id = "";
const curTrade = ref({});
const tradeList = ref([]);
let type = ""; //  admissionDate / graduationDate

const info = ref({});
const initData = async () => {
  const data = await getMyResume();
  info.value = data?.result;
  const list = data?.result?.pbWorkExperienceList || [];
  form.value = list.find((res) => res.id == id);
};
onLoad(async (params) => {
  id = params.id;
  const data = await getTradeDict();
  tradeList.value = [data.result];
  if (id) initData();
});

const onOpen = (key) => {
  type = key;
  time.value = form.value[key];
  datetimePicker.value?.open();
};
const onOpenPicker = () => {
  tradePicker.value?.open();
};
const confirm = (e) => {
  form.value[type] = dayjs(+e.value).format("YYYY-MM-DD");
  console.log("confirm", e, form.value);
};
const onTradeConfirm = (res) => {
  form.value.trade_dictText = res.value?.[0]?.trade_dictText;
  form.value.trade = res.value?.[0]?.value
};
const onSave = async () => {
  if(id) {
    await updateWork({
      ...form.value,
    });
  } else {
    await addWork({ ...form.value });
  }
  
  uni.navigateBack({
    delta: 1,
  });
};

const confirmDel = async () => {
  if (id) {
    // const data = new FormData()
    // data.append("id", id)
    await deleteByWork({id});
  }
  uni.navigateBack({
    delta: 1,
  });
};
</script>

<style scoped lang="scss">
.resume-contant {
  padding: 30rpx;
  &-footer {
    color: #ffffff;
    .del-btn {
      width: 200rpx;
      height: 80rpx;
      background: #aaaaaa;
      border-radius: 40rpx;
      box-shadow: -4rpx 0rpx 8rpx 4rpx rgba(119, 119, 119, 0.3);
    }
    .save-btn {
      width: 400rpx;
      height: 80rpx;
      background: linear-gradient(0deg, #17bcef 0%, #378cfd 100%);
      border-radius: 40rpx;
      box-shadow: -4rpx 0rpx 8rpx 4rpx rgba(12, 100, 127, 0.3);
      margin-left: 20rpx;
    }
  }
  .field-item {
    margin-bottom: 24rpx;
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
    .label {
      font-size: 28rpx;
      padding-left: 4rpx;
      color: #777777;
    }
    .time-range,
    .trade {
      padding: 16rpx 0 30rpx;
      color: #333333;
      .line {
        margin-right: 20rpx;
      }
    }
  }
}

:deep {
  .uv-input {
    padding: 16rpx 0 30rpx !important;
    border: none !important;
    .uni-input-input {
      color: #333333;
      font-size: 28rpx;
    }
  }
}
</style>
