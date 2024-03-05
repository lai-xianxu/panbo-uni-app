<script setup>
import { watch } from 'vue';
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { useUserStore } from '@/stores/user';

// tabbar刷新事件
const userStore = useUserStore();
watch(
  () => userStore.state_user,
  (val) => {
    if (val?.token) {
      uni.$emit('refreshTabbar');
      console.log('tabbar需要刷新啦');
    }
  },
  {
    deep: true,
  }
);

onLaunch(() => {
  console.log('App Launch');
});
onShow(() => {
  console.log('App Show');
});
onHide(() => {
  console.log('App Hide');
});
</script>

<style lang="scss">
/*每个页面公共css */
@import '@/uni_modules/uni-scss/index.scss';
/* icons */
@import '@/static/icons/customicons.css';
/* 全局scss */
@import '@/uni.scss';
/* 原子scss */
@import '@/static/scss/quick_style.scss';
@import '@/static/scss/flex.scss';
/* ui-scss */
@import '@/static/scss/uv-ui.scss';
</style>
