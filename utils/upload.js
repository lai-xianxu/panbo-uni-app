import { useUserStore } from '@/stores/user';
export const uploadApi = (file) => {
  return new Promise((resolve, reject) => {
    const userStore = useUserStore();
    uni.uploadFile({
      url: 'http://113.250.177.237:8080/jeecg-boot/sys/common/appUpload',
      filePath: file,
      name: 'file',
      formData: {},
      header: {
        'X-Access-Token': userStore.getters_user_token,
      },
      success: (res) => {
        return resolve(JSON.parse(res.data));
      },
      fail: (err) => {
        return reject(err);
      },
    });
  });
};
