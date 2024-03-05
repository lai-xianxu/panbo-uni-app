import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    state_count: 0,
  }),
  getters: {
    getters_count(state) {
      return state.state_count;
    },
  },
  actions: {
    actions_count() {
      this.state_count++;
    },
  },
});
