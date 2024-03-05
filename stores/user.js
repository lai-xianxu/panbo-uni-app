import { defineStore } from "pinia";
import { appBalanceGet } from "@/api/my";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      state_user: {},
      state_is_gestures_password: "",
      state_balance_data: {},
      state_common_msg: {},
    };
  },
  getters: {
    // 用户信息和token
    getters_user(state) {
      return state.state_user;
    },
    // 用户token
    getters_user_token(state) {
      return state.state_user?.token;
    },
    // 用户信息
    getters_user_info(state) {
      return state.state_user?.userInfo;
    },
    // 是否新用户
    getters_is_new_user(state) {
      return !state.state_user?.userInfo?.orgCode;
    },
    // 用户是否配置手势密码
    getters_is_gestures_password(state) {
      return state.state_is_gestures_password;
    },
    // 用户余额
    getters_balance_data(state) {
      return state.state_balance_data;
    },
    getters_common_msg(state) {
      return state.state_common_msg;
    },
  },
  actions: {
    // 获取余额
    async actions_get_balance_data() {
      const { result } = await appBalanceGet();
      this.state_balance_data = result;
      return result;
    },
    actions_common_msg(msg) {
      this.state_common_msg = msg;
    },
  },
  // 持久化
  unistorage: {
    key: "pb-store",
    paths: ["state_user", "state_is_gestures_password", "state_balance_data"],
  },
});
