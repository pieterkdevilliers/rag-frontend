<template>
    <div>
      <UserDetailCard :user = "user"/>
        <!-- <p>User ID: {{ user.user.id }}</p>
        <p>User Email: {{ user.user.user_email }}</p> -->
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const account_unique_id = authStore.uniqueAccountId
const { id } = useRoute().params;

const apiAuthorizationToken = authStore.access_token;
    // Fetch users data with headers
const { data: user, error } = await useFetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/users/${account_unique_id}/${id}`, {
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
  // Check if the response has the expected structure
  if (user.value) {
    console.log('User:', user.value);
  } else {
    console.error('Unexpected response format:', user.value);
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