<template>
  <div>
    <h1 class="text-xl text-primary" >Folders</h1>
  </div>
  <div class="flex justify-end mb-4">
    <UButton
      icon="i-heroicons:plus-circle-16-solid"
      variant="outline">
    </UButton>
  </div>
  <div>
    <div class="flex px-3 py-3.5">
        <UInput v-model="q" placeholder="Filter folders..." />
    </div>
    <div class="grid grid-cols-6 gap-5">
    <div v-for="folder in filteredFolders" :key="folder.id">
        <FolderCard :folder="folder" />
    </div>
</div>
  </div>
</template>

<script setup lang="ts">

  definePageMeta({
    layout: 'user-access',
  });
  import { useAuthStore } from '~/stores/auth';
  const authStore = useAuthStore();

  const account_unique_id = authStore.uniqueAccountId
  const apiAuthorizationToken = authStore.access_token;
    // Fetch folders data with headers
  const { data: folders, error } = await useFetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/folders/${account_unique_id}`, {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${apiAuthorizationToken}`,
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

  const q = ref('');

  const filteredFolders = computed(() => {
      if (!q.value) {
          return folders.value.folders
      }
      return folders.value.folders.filter((folder) => {
          return Object.values(folder).some((value) => {
          return String(value).toLowerCase().includes(q.value.toLowerCase())
          })
      })
      })

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