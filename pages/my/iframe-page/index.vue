<template>
  <view class="iframe-page fss-c">
    <nav-bar :isNavBar="false"></nav-bar>
    <view class="iframe-content">
      <web-view
        v-if="pageType == 'url'"
        :src="pdfUrl"
        :fullscreen="false"
        :webview-styles="{
          width: '100%',
          height: '100%'
        }"
      />
      <!-- <iframe
        v-if="pageType == 'url'"
        :src="pdfUrl"
        frameborder="0"
        style="width: 100%; height: inherit"
      ></iframe> -->

      <iframe
        v-if="pageType == 'contract'"
        v-for="item in pdfUrlList"
        :key="item.id"
        :src="srcCom(item)"
        frameborder="0"
        style="width: 100%; height: inherit"
      ></iframe>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { appGetPdContract } from '@/api/my';
import { onLoad } from '@dcloudio/uni-app';

const pageType = ref('');
const pdfUrl = ref('');
onLoad((params) => {
  if (params.url) {
    pageType.value = 'url';
    pdfUrl.value = params.url;
    return;
  }
  pageType.value = 'contract';
  getPdContract();
});

// 获取电子合同
const pdfUrlList = ref([]);
const getPdContract = async () => {
  const { result } = await appGetPdContract();
  const list = result?.map(e => e.pdfUrl)
  // list.push('http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf')
  pdfUrlList.value = list;
};

// 链接匹配
const srcCom = (url) => {
  // http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf
  const viewUrl = './././hybrid/html/web/viewer.html?file=';
  let src = '';
  if (url.toLowerCase().endsWith('.pdf')) {
    src = viewUrl + url;
  }
  return src + '#toolbar=0';
};
</script>

<style lang="scss">
.iframe-page {
  width: 100%;
  height: 100%;
  background-color: #f2f2f2;
  .iframe-content {
    width: 100%;
    flex: 1;
    height: calc(100% - var(--status-bar-height));
    overflow: auto;
  }
}
</style>
