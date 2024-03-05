<script setup>
import { onLoad } from '@dcloudio/uni-app';
import route from '@/uni_modules/uv-ui-tools/libs/util/route.js';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

// 初始化
onLoad(() => {
  if (userStore.getters_user_token) {
    route({
      type: 'switchTab',
      url: 'pages/home/index',
    });
  } else {
    route('pages/login/index');
  }
});
</script>
