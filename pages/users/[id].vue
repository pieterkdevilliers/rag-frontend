<template>
    <div>
        <p>User ID: {{ user.user.id }}</p>
        <p>User Email: {{ user.user.user_email }}</p>
        <p>Account Unique ID: {{ user.user.account_unique_id }}</p>
    </div>
</template>

<script setup lang="ts">
const { id } = useRoute().params;
const account = useRoute().query.account;

const apiAuthorizationToken = useRuntimeConfig().public.apiAuthorizationToken;
    // Fetch users data with headers
const { data: user, error } = await useFetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/users/${account}/${id}`, {
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