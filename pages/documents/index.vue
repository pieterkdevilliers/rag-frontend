<template>
    <div class="grid grid-cols-4 gap-5">
        <div v-for="folder in folders.folders">
            <p>Folder ID: {{ folder.id }}</p>
            <p>Folder Name: {{ folder.folder_name }}</p>
            <NuxtLink :to="`/documents/folders/${folder.id}`">View User</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">

import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

const account_unique_id = authStore.uniqueAccountId
const apiAuthorizationToken = useRuntimeConfig().public.apiAuthorizationToken;
    // Fetch folders data with headers
const { data: folders, error } = await useFetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/folders/${account_unique_id}`, {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': apiAuthorizationToken,
  }
});

// Check for errors
if (error.value) {
  console.error('Error fetching folders:', error.value);
} else {
  // Check if the response has the expected structure
  if (folders.value) {
    console.log('Folders:', folders.value);
    console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
  } else {
    console.error('Unexpected response format:', folders.value);
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