<template>
    <div>
        <h1 class="text-xl text-primary" >Documents</h1>
    </div>
    <div class="flex justify-end mb-4">
    <UButton
      icon="i-heroicons:plus-circle-16-solid"
      variant="outline">
    </UButton>
    </div>
    <div>
        <div class="flex px-3 py-3.5">
            <UInput v-model="q" placeholder="Filter documents..." />
        </div>

        <UTable :rows="filteredRows" :columns="columns">
            <template #name-data="{ row }">
            <span :class="[selected.find(file => file.id === row.id) && 'text-primary-500 dark:text-primary-400']">{{ row.name }}</span>
            </template>

            <template #actions-data="{ row }">
            <UDropdown :items="items(row)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-solid" />
            </UDropdown>
            </template>
        </UTable>
    </div>
</template>

<script setup lang="ts">

    definePageMeta({
    layout: 'user-access',
    });
    const { id } = useRoute().params;

    import { useAuthStore } from '~/stores/auth';
    const authStore = useAuthStore();

    const account_unique_id = authStore.uniqueAccountId
    const apiAuthorizationToken = authStore.access_token;
        // Fetch folders data with headers
    const { data: files, error } = await useFetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/files/${account_unique_id}/${id}`, {
    method: 'GET',
    headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${apiAuthorizationToken}`,
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


    const columns = [{
        key: 'id',
        label: 'ID',
        class: 'text-primary'
        }, {
        key: 'file_name',
        label: 'File Name',
        class: 'text-primary'
        }, {
        key: 'included_in_source_data',
        label: 'Included in source data',
        class: 'text-primary'
        }, {
        key: 'already_processed_to_source_data',
        label: 'Already processed to source data',
        class: 'text-primary'
        }, {
        key: 'actions',
        class: 'text-primary'
        }];


    const items = row => [
    [{
        label: 'Edit',
        icon: 'i-heroicons-pencil-square-solid',
        click: () => console.log('Edit', row.id)
    }, {
        label: 'Process',
        icon: 'i-heroicons:arrow-path-solid'
    }], [{
        label: 'Delete',
        icon: 'i-heroicons-trash-solid'
    }]
    ];

    const q = ref('');

    const filteredRows = computed(() => {
    if (!q.value) {
        return files.value.files
    }
    
    return files.value.files.filter((file) => {
        
        return Object.values(file).some((value) => {
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