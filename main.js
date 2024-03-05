// #ifndef VUE3
import Vue from 'vue';
import App from './App';
import { request } from '@/utils/request';

Vue.config.productionTip = false;
App.mpType = 'app';
// 统一 vue2 API Promise 化返回格式与 vue3 保持一致
try {
  function isPromise(obj) {
    return (
      !!obj &&
      (typeof obj === 'object' || typeof obj === 'function') &&
      typeof obj.then === 'function'
    );
  }
  uni.addInterceptor({
    returnValue(res) {
      if (!isPromise(res)) {
        return res;
      }
      return new Promise((resolve, reject) => {
        res.then((res) => {
          if (res[0]) {
            reject(res[0]);
          } else {
            resolve(res[1]);
          }
        });
      });
    },
  });
} catch (error) {}
const app = new Vue({
  ...App,
});
app.$mount();
request(app);
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue';
import App from './App.vue';
import * as Pinia from 'pinia';
import uvUI from '@/uni_modules/uv-ui-tools';
import { request } from '@/utils/request';
import { createUnistorage } from './uni_modules/pinia-plugin-unistorage';
import routeIntercept from '@/utils/route-intercept';

export function createApp() {
  const app = createSSRApp(App);
  // 状态管理
  const store = Pinia.createPinia();
  // 持久化
  store.use(createUnistorage());
  app.use(store);
  app.use(uvUI);
  request(app);
  // 全局路由拦截
  routeIntercept();

  return {
    app,
    Pinia, // 此处必须将 Pinia 返回
  };
}
// #endif
