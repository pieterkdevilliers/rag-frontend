import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    uniqueAccountId: null as string | null,
    access_token: null as string | null,
  }),
  actions: {
    setUniqueAccountId(id: string) {
      this.uniqueAccountId = id;
    },

    clearUniqueAccountId() {
      this.uniqueAccountId = null;
    },

    setAuthToken(access_token: string) {
      this.access_token = access_token;
    },

    clearAuthToken() {
      this.access_token = null;
    },
  },
  persist: true,
});