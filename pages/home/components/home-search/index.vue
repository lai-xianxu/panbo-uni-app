<template>
  <view>
    <nav-bar :isNavBar="false" />
    <view class="home-search">
      <view class="home-search-con">
        <uni-search-bar
          class="uni-search-bar"
          v-model="searchValue"
          :cancelButton="false"
          clearButton="none"
          placeholder=" "
        >
          <template v-slot:searchIcon>
            <image
              slot="searchIcon"
              class="search-icon"
              src="@/static/common/home-search.png"
            />
          </template>
        </uni-search-bar>
        <span class="search-btn" @click.stop="onSearch">搜索</span>
      </view>
      <image
        @click.stop="scanCode"
        class="sweep"
        src="@/static/common/sweep.png"
      />
    </view>
    <uv-modal
      ref="modal"
      title=""
      :content="invitedText"
      showCancelButton
      @confirm="confirm"
      @cancel="cancel"
    ></uv-modal>
  </view>
</template>

<script setup>
import { ref, computed } from "vue";
import route from "@/uni_modules/uv-ui-tools/libs/util/route.js";
import { getInviteInvite } from "@/api/company";

const modal = ref();
const searchValue = ref("");
// const onScanCode = () => {
//   route("pages/home/scan-code/index");
// };
function parseQuery(str) {
  const queryString = str.split("?")[1];
  const keyValuePairs = queryString.split("&");
  const queryParams = {};
  keyValuePairs.forEach((pair) => {
    const [key, value] = pair.split("=");
    const decodedKey = decodeURIComponent(key.replace(/\+/g, " "));
    const decodedValue = decodeURIComponent((value || "").replace(/\+/g, " "));
    queryParams[decodedKey] = decodedValue;
  });

  return queryParams;
}
const onSearch = () => {
  route("pages/home/search/index", {
    keyword: searchValue.value,
  });
};
const inviteInfo = ref({});
const scanCode = () => {
  uni.scanCode({
    //是否只能从相机扫码,不能从相册扫码
    onlyFromCamera: false,
    //规定扫码类型  字节跳动小程序不支持此参数
    // barcode就是一维码(条形码)  qrcode就是(er)维码
    // datamatrix就是Data Matrix码   pdf417就是PDF417条码
    scanType: ["barCode", "qrCode", "datamatrix", "pdf417"],
    // 是否启动自动识别字符编码功能
    autoDecodeCharset: false,
    // 是否开启自动放大功能  仅 App-Android (3.5.4+) 支持
    autoZoom: false,
    // 是否支持手动输入条形码  仅飞书小程序（V3.14.0）支持
    barCodeInput: false,
    success: async (res) => {
      console.log(res, "scanCode-success");
      // uni.$uv.toast(JSON.stringify(res));
      const arr = res.result?.split("?");
      if (res?.result?.includes("id") && res?.result?.includes("name")) {
        inviteInfo.value = parseQuery("a?" + res.result);
        modal.value?.open();
        // uni.$uv.toast(
        //   JSON.stringify({
        //     invitedUserId: inviteInfo.value.id,
        //     inviteStatus: "1",
        //   })
        // );
      } else if (arr?.length == 2) {
        const params = {
          path: arr[0],
          ...parseQuery(res.result),
        };
        route("pages/home/transfer-accounts/index", params);
      }
    },
    fail: (error) => {
      console.log("扫码失败了", error);
      // route("pages/home/transfer-accounts/index", {
      //   id: "1693507132680445954",
      //   idCard: "460201197912101344",
      //   username: "6nmh27pp2y",
      //   path: "/jeecg-boot/app/scan/getUserInfo"
      // });
    },
  });
};
const invitedText = computed(() => {
  return `是否要绑定成为 ${inviteInfo.value.name} 的被邀请用户`;
});
const cancel = async () => {
  await getInviteInvite({
    inviteUserId: inviteInfo.value.id,
    inviteStatus: "0",
  });
};
const confirm = async () => {
  // uni.$uv.toast(
  //   JSON.stringify({
  //     invitedUserId: inviteInfo.value.id,
  //     inviteStatus: "1",
  //   })
  // );
  await getInviteInvite({
    inviteUserId: inviteInfo.value.id,
    inviteStatus: "1",
  });
  uni.$uv.toast("绑定成功");
};
</script>

<style scoped lang="scss">
.home-search {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 15rpx 30rpx 0;
  &-con {
    background: rgba(181, 238, 255, 0.36) !important;
    border-radius: 80rpx;
    display: flex;
    padding: 0 34rpx 0 10rpx;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    overflow: hidden;
    .uni-search-bar {
      flex: 1;
    }
    .search-btn {
      font-size: 28rpx;
      color: #fff;
    }
    .search-icon {
      width: 40rpx;
      height: 40rpx;
    }
  }
  .sweep {
    flex-shrink: 0;
    width: 42rpx;
    height: 42rpx;
    margin-left: 32rpx;
  }
}
:deep() {
  .uni-searchbar__box {
    box-sizing: border-box;
    background: inherit !important;
    color: #fff;
    font-size: 24rpx;
    height: 100%;
    justify-content: flex-start;
    input {
      color: #fff;
      font-size: 24rpx;
    }
  }
  .uni-searchbar {
    padding: 10rpx !important;
    height: 80rpx;
    box-sizing: border-box;
  }
}
</style>
