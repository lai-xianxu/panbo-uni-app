<template>
  <view class="search-wrap1 flex-column">
    <tab
      :list="tabList"
      v-model="active"
      @onTabChange="onTabChange"
      class="tab_wrap"
    ></tab>
    <view class="flex1 search_con">
      <view v-if="active == 1">
        <view v-if="allResult.pbInformationPageVO">
          <view class="flex-row main-between cross-center header">
            <view class="title">
              <span class="key">{{ keyword }}</span> - 咨询
            </view>
            <!-- <span class="all_btn">全部></span> -->
          </view>
          <homeMsgList :list="[allResult.pbInformationPageVO]" />
        </view>
        <view v-if="allResult.announcementModel">
          <view class="flex-row main-between cross-center header">
            <view class="title">
              <span class="key">{{ keyword }}</span> - 公告
            </view>
            <!-- <span class="all_btn">全部></span> -->
          </view>
          <CommonMessageList :list="[allResult.announcementModel]" />
        </view>
        <view v-if="allResult.jobOpeningListVO">
          <view class="flex-row main-between cross-center header">
            <view class="title">
              <span class="key">{{ keyword }}</span> - 职位
            </view>
            <!-- <span class="all_btn">全部></span> -->
          </view>
          <PositionList :list="[allResult.jobOpeningListVO]" />
        </view>
        <view v-if="allResult.appModel">
          <view class="flex-row main-between cross-center header">
            <view class="title">
              <span class="key">{{ keyword }}</span> - 消息
            </view>
            <!-- <span class="all_btn">全部></span> -->
          </view>
          <RecruitmentMsgList :list="[allResult.appModel]" />
        </view>
        <uv-empty
          v-if="
            !allResult.pbInformationPageVO &&
            !allResult.announcementModel &&
            !allResult.jobOpeningListVO &&
            !allResult.appModel
          "
          mode="list"
          text="这里什么都没有找到，换个关键词试试吧~"
          marginTop="100"
        ></uv-empty>
      </view>
      <view v-else>
        <template v-if="list?.length">
          <component :is="components[active]" :list="list" />
        </template>
        <uv-load-more style="padding: 20rpx 0" :status="status" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import { getMyMessage } from "@/api/msg";
import { allSearch } from "@/api/home";
import { getInformationList } from "@/api/advice";

import CommonMessageList from "../../../message/components/CommonMessageList.vue";
import RecruitmentMsgList from "../../../message/components/RecruitmentMsgList.vue";
import PositionList from "../../../position/position-list/index.vue";
import homeMsgList from "../../components/home-msg-list/index.vue";
import { getRecruitmentList } from "@/api/recruit";

const components = {
  2: homeMsgList,
  3: CommonMessageList,
  4: PositionList,
  5: CommonMessageList,
};
const props = defineProps({
  keyword: {
    type: String,
    default: "",
  },
});

const active = ref("1");
const tabList = ref([
  {
    name: "全部",
    id: "1",
  },
  {
    name: "咨询",
    id: "2",
  },
  {
    name: "公告",
    id: "3",
  },
  {
    name: "职位",
    id: "4",
  },
  {
    name: "消息",
    id: "5",
  },
]);
const list = ref([]);
let pageNo = 1;
let pageSize = 3;
const status = ref("");
const initData = async () => {
  const api =
    active.value == 2
      ? getInformationList
      : active.value == 4
      ? getRecruitmentList
      : getMyMessage;
  if (status.value == "nomore") return;
  const params =
    active.value == 2
      ? {
          pageNo,
          pageSize,
          screening: "",
          content: props.keyword
        }
      : active.value == 4
      ? {
          pageNo,
          pageSize,
          screening: "",
          jobTitle: props.keyword,
        }
      : {
          pageNo,
          pageSize,
          msgCategory: active.value,
          content: props.keyword
        };
  if (pageNo == 1) {
    list.value = [];
  }
  if(active.value == 5) {
    params.msgCategory = "3"
  }
  if(active.value == 3) {
    params.msgCategory = "1"
  }
  const data = await api(params);
  pageNo++;
  list.value = [...list.value, ...(data?.result?.records || [])];
  if ((data?.result?.records || []).length < pageSize) {
    status.value = "nomore";
  }
};

const onTabChange = () => {
  status.value = "loading";
  pageNo = 1;
  if (active.value == 1) {
    onSearch();
  } else {
    initData();
  }
};

const allResult = ref({});
const onSearch = async () => {
  const data = await allSearch({
    content: props.keyword,
  });
  allResult.value = data.result;
};

watch(
  () => props.keyword,
  () => {
    onTabChange()
  },
  {
    immediate: true,
  }
);
</script>

<style scoped lang="scss">
.search-wrap1 {
  color: #333333;
  font-size: 28rpx;
  height: 100%;
}
.search_con {
  height: 0;
  overflow: auto;
}
.tab_wrap {
  margin: 20rpx 0 30rpx;
}
.header {
  padding: 30rpx 12rpx;
  .title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    .key {
      color: #17bcef;
    }
  }
  .all_btn {
    font-size: 28rpx;
    color: #aaaaaa;
  }
}
:deep() {
  .home-msg-item {
    margin-top: 0;
    margin-bottom: 20rpx;
  }
}
</style>
