import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    uniqueAccountId: null as string | null, // Initialize as null
  }),
  actions: {
    // Action to set the account ID
    setUniqueAccountId(id: string) {
      this.uniqueAccountId = id;
    },

    // Optional: Clear the account ID (e.g., on logout)
    clearUniqueAccountId() {
      this.uniqueAccountId = null;
    },
  },
  persist: true,
});