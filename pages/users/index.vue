<template>
  <div class="flex justify-end mb-4">
    <UButton
      icon="i-heroicons:plus-circle-16-solid"
      variant="outline">
    </UButton>
  </div>
  <div class="grid grid-cols-4 gap-5">
    <div v-for="user in users.users" :key="user.id">
      <UserCard :user = "user"/>
    </div>
  </div>
</template>

<script setup lang="ts">

import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const apiAuthorizationToken = authStore.access_token;
console.log('API Authorization Token:', apiAuthorizationToken);

    // Fetch users data with headers
const { data: users, error } = await useFetch('https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/users', {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${apiAuthorizationToken}`,
  }
});

// Check for errors
if (error.value) {
  console.error('Error fetching users:', error.value);
} else {
  // Check if the response has the expected structure and set the unique account ID
  if (users.value && users.value.users) {
    // const uniqueAccountId = users.value.users[0].account_unique_id;
    // authStore.setUniqueAccountId(uniqueAccountId);
    console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
    
  } else {
    console.error('Unexpected response format:', users.value);
  }
}

</script>

<style scoped>
    h2 {
        color: blue;
        margin-bottom: 20px;
        font-size: 36px;
    }
    p {
        color: green;
        margin: 20px 0;
    }

</style>