<template>
    <header class="shadow-sm bg-white">
        <nav class="container mx-auto p-4 flex justify-between">
            <NuxtLink v-if="account_unique_id" to="/login">Logout</NuxtLink>
            <NuxtLink class="font-bold" to="/">Private Rag</NuxtLink>
            <h1 class="font-bold">{{ account_organisation }}</h1>
            <ul class="flex gap-4">
                <li><NuxtLink v-if="!account_unique_id" to="/">Home</NuxtLink></li>
                <li v-if="!account_unique_id"><NuxtLink to="/login">Login</NuxtLink></li>
                <li v-if="account_unique_id"><NuxtLink to="/users">Users</NuxtLink></li>
                <li v-if="account_unique_id"><NuxtLink to="/folders">Documents</NuxtLink></li>
            </ul>
        </nav>
    </header>
    <div class="container mx-auto p-4">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

// Make `account_unique_id` reactive by deriving it from the store
const account_unique_id = computed(() => authStore.uniqueAccountId || null);
const account_organisation = ref('');

// Watch for changes in `account_unique_id` and fetch details
watchEffect(async () => {
  if (account_unique_id.value) {
    try {
      const apiAuthorizationToken = authStore.access_token;
      const { data: account, error } = await useFetch(
        `https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/accounts/${account_unique_id.value}`, 
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiAuthorizationToken}`,
          },
        }
      );
      if (account.value?.account) {
        account_organisation.value = account.value.account.account_organisation;
      } else {
        console.error('Failed to fetch account details:', error.value);
      }
    } catch (error) {
      console.error('Error fetching account details:', error);
    }
  } else {
    account_organisation.value = '';
  }
});
</script>

<style scoped>
.router-link-exact-active {
    color: #12b448;

}
</style>