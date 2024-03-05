import { defineStore } from 'pinia';

export const useRepayStore = defineStore('repay', {
  state: () => ({
    state_repay_obj: {},
    state_repay_refresh: false,
  }),
  getters: {
    getters_repay_obj(state) {
      return state.state_repay_obj;
    },
    getters_repay_refresh(state) {
      return state.state_repay_refresh;
    },
  },
});
