<template>
  <view class="resume-contant flex-column">
    <view class="flex0">
      <nav-bar />
      <p class="title-suffix">{{ data[type]?.label }}</p>
    </view>
    <view class="flex1 resume-info">
      <!-- <Education /> -->
      <component :is="data[type]?.name"></component>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import { getMyResume } from "@/api/recruit";
import Education from "../components/Education.vue";
import Work from "../components/Work.vue";
import Qualification from "../components/Qualification.vue";
import JobHunt from "../components/JobHunt.vue";
import PersonalInfo from "../components/PersonalInfo.vue";
import UserInfo from "../components/UserInfo.vue";

import { onLoad } from "@dcloudio/uni-app";

const label = ref("");
const data = computed(() => {
  return {
    Work: {
      label: `${label.value}工作经历`,
      name: Work,
    },
    Education: {
      label: `${label.value}教育经历`,
      name: Education,
    },
    JobHunt: {
      label: `${label.value}求职期望`,
      name: JobHunt,
    },
    Qualification: {
      label: `${label.value}资历证书`,
      name: Qualification,
    },
    PersonalInfo: {
      label: `编辑个人简介`,
      name: PersonalInfo,
    },
    UserInfo: {
      label: `个人信息`,
      name: UserInfo,
    }
  };
});

const type = ref("");
onLoad((params) => {
  label.value = params.id ? "编辑" : "新增";
  type.value = params.type;
});
//   const props = defineProps({
//     list: {
//       default: () => [],
//     },
//   });
//   const info = ref({});
//   const initData = async () => {
//     const data = await getMyResume();
//     info.value = data?.result || {};
//   };
//   initData();
</script>

<style scoped lang="scss">
.title-suffix {
  padding: 0 30rpx;
}
.resume-contant {
  height: 100%;
  .resume-info {
    box-shadow: -4rpx 0rpx 8rpx 4rpx rgba(12, 100, 127, 0.3);
    box-sizing: border-box;
    overflow: auto;
    margin: 30rpx;
    background: #fff;
    border-radius: 20rpx;
  }
}
</style>
