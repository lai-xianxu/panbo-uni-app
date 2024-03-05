import { useUserStore } from '@/stores/user';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';

// vm可获取全局的一些变量
export const request = (vm) => {
  uni.$uv.http.setConfig((config) => {
    /* config 为默认全局配置*/
    config.baseURL = 'http://113.250.177.237:8080';
    return config;
  });

  // 请求拦截
  uni.$uv.http.interceptors.request.use(
    (config) => {
      config.data = config.data || {};
      const userStore = useUserStore();
      if (!config?.custom?.skipToken && !userStore.getters_user_token) {
        // uni.$uv.toast('请先登录');
        route({
          type: 'redirect',
          url: 'pages/login/index',
        });
        return;
      }
      config.header['X-Access-Token'] = userStore.getters_user_token || '';
      // 打开loading
      if (config?.custom?.loading) {
        uni.showLoading({
          mask: true,
        });
      }
      return config;
    },
    (config) => {
      return Promise.reject(config);
    }
  );

  // 响应拦截
  uni.$uv.http.interceptors.response.use(
    (response) => {
      const data = response.data;
      // 关闭loading
      if (response?.config?.custom?.loading) {
        uni.hideLoading();
      }
      if (data.success === false) {
        uni.$uv.toast(data.message);
        return Promise.reject(response);
      }
      return data === undefined ? {} : data;
    },
    (response) => {
      // 关闭loading
      if (response?.config?.custom?.loading) {
        uni.hideLoading();
      }
      const userStore = useUserStore();
      if ([401, 500].includes(response?.data?.code)) {
        uni.$uv.toast(response?.data?.message || 'Token失效，请重新登录');
        userStore.state_user = {};
        route({
          type: 'redirect',
          url: 'pages/login/index',
        });
        // route('pages/login/index');
      }
      return Promise.reject(response);
    }
  );
};
