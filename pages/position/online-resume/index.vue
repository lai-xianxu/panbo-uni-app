<template>
  <view class="online-resume">
    <nav-bar />
    <view class="flex-row resume-info online-item main-between" @click.stop="onAdd('UserInfo')">
      <view>
        <p class="title">{{ info.sysUserVO?.realname }}</p>
        <p class="resume-item" v-if="baseInfo">{{ baseInfo }}</p>
        <p
          class="flex-row cross-center resume-item"
          v-if="info.sysUserVO?.phone"
        >
          <image class="flex0 image" mode="aspectFit" src="@/static/home/phone.png" />{{
            info.sysUserVO?.phone
          }}
        </p>
        <p class="flex-row cross-center resume-item" v-if="info.wechatId">
          <image class="flex0 image" mode="aspectFit" src="@/static/home/wechat.png" />{{
            info.wechatId
          }}
        </p>
      </view>
      <image
        class="flex0 avatar"
        :src="info.sysUserVO?.avatar || '@/static/common/add-icon.png'"
      />
    </view>
    <view class="online-item"  @click.stop="onAdd('UserInfo')">
      <p class="title">求职状态</p>
      <p>{{ info.jobStatus_dictText }}</p>
    </view>
    <view class="online-item">
      <view class="flex-row main-between line mb18">
        <p class="title">个人简介</p>
        <image
          class="flex0 add-btn"
          v-if="!info.personalResume"
          @click="onAdd('PersonalInfo')"
          src="@/static/common/add-icon.png"
        />
      </view>
      <p v-if="info.personalResume" @click="onAdd('PersonalInfo')">
        {{ info.personalResume }}
      </p>
    </view>
    <view class="online-item">
      <view class="flex-row main-between line mb18">
        <p class="title">求职期望</p>
        <image
          class="flex0 add-btn"
          @click.stop="onAdd('JobHunt')"
          src="@/static/common/add-icon.png"
        />
      </view>
      <view v-if="info.pbJobExpectationList?.length">
        <view
          class="line mb18"
          v-for="item in info.pbJobExpectationList"
          :key="item.id"
          @click.stop="onAdd('JobHunt', item.id)"
        >
          <p class="mb18">
            {{ item.desiredPosition }} {{ item.salaryMin }}-{{
              item.salaryMax
            }}k
          </p>
          <p class="mb18">{{ item.desiredCity_dictText }}</p>
        </view>
      </view>
    </view>
    <view class="online-item">
      <view class="flex-row main-between line mb18">
        <p class="title">工作经历</p>
        <image
          class="flex0 add-btn"
          @click.stop="onAdd('Work')"
          src="@/static/common/add-icon.png"
        />
      </view>
      <view v-if="info?.pbWorkExperienceList?.length">
        <view
          class="line s mb18"
          v-for="item in info.pbWorkExperienceList || []"
          :key="item.id"
          @click.stop="onAdd('Work', item.id)"
        >
          <view class="flex-row main-between mb18">
            <p class="item">{{ item.companyName }}</p>
            <p class="item">
              {{ item.employmentPeriodStart }}-{{ item.employmentPeriodEnd }}
            </p>
          </view>
          <p class="item mb18">{{ item.positionName }}</p>
          <p class="item mb18">{{ item.jobDescription }}</p>
        </view>
      </view>
    </view>
    <view class="online-item">
      <view class="flex-row main-between line mb18">
        <p class="title">教育经历</p>
        <image
          class="flex0 add-btn"
          @click.stop="onAdd('Education')"
          src="@/static/common/add-icon.png"
        />
      </view>
      <view v-if="info?.pbEducationExperienceList?.length">
        <view
          class="line mb18"
          v-for="item in info?.pbEducationExperienceList || []"
          :key="item.id"
          @click.stop="onAdd('Education', item.id)"
        >
          <view class="flex-row main-between mb18">
            <p class="item">{{ item.schoolName }}</p>
            <p class="item">
              {{ item.admissionDate }}-{{ item.graduationDate }}
            </p>
          </view>
          <p class="item mb18">{{ item.major }} {{ item.educationLevel }}</p>
        </view>
      </view>
    </view>
    <view class="online-item">
      <view class="flex-row main-between line mb18">
        <p class="title">资格证书</p>
        <image
          @click.stop="onAdd('Qualification')"
          class="flex0 add-btn"
          src="@/static/common/add-icon.png"
        />
      </view>
      <view class="flex-row" @click.stop="onAdd('Qualification', '2')">
        <view
          class="certificate flex-center"
          v-for="item in info.certificateNameList"
          :key="item"
        >
          {{ item }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { getMyResume } from "@/api/recruit";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import { onShow } from "@dcloudio/uni-app";

const props = defineProps({
  list: {
    default: () => [],
  },
});
const info = ref({});
const initData = async () => {
  const data = await getMyResume();
  info.value = data?.result || {};
};

onShow(() => {
  initData();
});
const baseInfo = computed(() => {
  const arr = [
    info.value.workExperience && info.value.workExperience + "经验",
    info.value.age,
    info.value.education,
  ].filter(Boolean);
  return arr.length ? arr.join("・") : "";
});
const onAdd = (type, id) => {
  const params = {
    type,
  };
  if (id) params.id = id;
  route("pages/position/resume-edit/index", params);
};
</script>

<style scoped lang="scss">
.online-resume {
  padding: 0 30rpx;
  color: #333333;
  font-size: 28rpx;
  .title {
    font-weight: bold;
    color: #333333;
    padding-bottom: 20rpx;
  }
}
.online-item {
  width: 100%;
  background: #ffffff;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 8rpx 0 rgba(12, 100, 127, 0.3);
  padding: 30rpx;
  margin-bottom: 20rpx;
  .resume-item {
    margin-bottom: 20rpx;
    color: #777777;
    &:last-child {
      margin-bottom: 0;
    }
    .image {
      width: 28rpx;
      height: 24rpx;
      margin-right: 10rpx;
    }
  }
  .avatar {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-left: 20rpx;
  }
  .line {
    border-bottom: 1rpx solid #17bcef;
  }
}
.mb18 {
  margin-bottom: 18rpx;
}
.certificate {
  height: 60rpx;
  background: #17bcef;
  border-radius: 8rpx;
  padding: 0 8rpx;
  color: #ffffff;
  margin-right: 10rpx;
  &:last-child {
    margin-right: 0;
  }
}
.add-btn {
  width: 32rpx;
  height: 32rpx;
}
</style>
