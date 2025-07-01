import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    uniqueAccountId: null as string | null,
    access_token: null as string | null,
    account_organisation: null as string | null,
    docs_count: null as number | null,
    subs_status: null as boolean | null,
    processed_docs_count: null as number | null,
  }),
  getters: {
    // This getter will return true if there's a token, false otherwise.
    isLoggedIn(state): boolean {
      return !!state.access_token;
    },
  },
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

    setAccountOrganisation(account_organisation: string) {
      this.account_organisation = account_organisation;
    },

    clearAccountOrganisation() {
      this.account_organisation = null;
    },

    setDocsCount(docs_count: number) {
      this.docs_count = docs_count;
    },

    clearDocsCount() {
      this.docs_count = null;
    },

    setSubsStatus(subs_status: boolean) {
      this.subs_status = subs_status;
    },

    clearSubsStatus() {
      this.subs_status = null;
    },

    setProcessedDocsCount(processed_docs_count: number) {
      this.processed_docs_count = processed_docs_count;
    },

    clearProcessedDocsCount() {
      this.processed_docs_count = null;
    },
  },
  persist: true,
});