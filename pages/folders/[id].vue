<template>
    <div class="grid grid-cols-4 gap-5">
        <div v-for="file in files.files">
            <FileCard :file = "file"/>
        </div>
    </div>
</template>

<script setup lang="ts">
    const { id } = useRoute().params;

    import { useAuthStore } from '~/stores/auth';
    const authStore = useAuthStore();

    const account_unique_id = authStore.uniqueAccountId
    const apiAuthorizationToken = useRuntimeConfig().public.apiAuthorizationToken;
        // Fetch folders data with headers
    const { data: files, error } = await useFetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/files/${account_unique_id}/${id}`, {
    method: 'GET',
    headers: {
        'accept': 'application/json',
        'Authorization': apiAuthorizationToken,
    }
    });

    // Check for errors
    if (error.value) {
    console.error('Error fetching files:', error.value);
    } else {
    // Check if the response has the expected structure
    if (files.value) {
        console.log('Files:', files.value);
        console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
    } else {
        console.error('Unexpected response format:', files.value);
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