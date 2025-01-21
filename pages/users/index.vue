<template>
    <div class="grid grid-cols-4 gap-5">
        <div v-for="user in users.users" :key="user.id">
            <p>User ID: {{ user.id }}</p>
            <p>User Email: {{ user.user_email }}</p>
            <p>Account Unique ID: {{ user.account_unique_id }}</p>
            <NuxtLink :to="`/users/${user.id}?account=${user.account_unique_id}`">View User</NuxtLink>

        </div>
    </div>
</template>

<script setup lang="ts">
const apiAuthorizationToken = useRuntimeConfig().public.apiAuthorizationToken;
    // Fetch users data with headers
const { data: users, error } = await useFetch('https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/users', {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': apiAuthorizationToken,
  }
});

// Check for errors
if (error.value) {
  console.error('Error fetching users:', error.value);
} else {
  // Check if the response has the expected structure
  if (users.value && users.value.users) {
    console.log('Users:', users.value.users);
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