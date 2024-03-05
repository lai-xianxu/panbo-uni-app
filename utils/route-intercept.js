import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { useUserStore } from '@/stores/user';

const list = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab'];

const hasPermission = (url) => {
  const userStore = useUserStore();
  if (url.indexOf('pages/login') !== -1 || userStore.getters_user_token) {
    return true;
  }
  return false;
};

const routeIntercept = () => {
  list.forEach((item) => {
    uni.addInterceptor(item, {
      invoke(e) {
        if (!hasPermission(e.url)) {
          route({
            type: 'redirect',
            url: 'pages/login/index',
          });
          return false;
        }
        return true;
      },
    });
  });
};

export default routeIntercept;
