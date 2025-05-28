<template>
  <div>
    <h1 class="text-xl text-primary">Documents</h1>
  </div>
  <div class="flex justify-end mb-4">
    <UButton
      icon="i-heroicons:plus-circle-16-solid"
      variant="outline" 
      @click="openAddFileModal"
    />
    <UButton
      icon="i-heroicons:plus-circle-16-solid"
      variant="outline" 
      @click="openAddFileFromURLModal"
      />

    
  </div>
  <div>
    <div class="flex px-3 py-3.5">
      <UInput v-model="q" placeholder="Filter documents..." />
    </div>

    <UTable :rows="filteredRows" :columns="columns" :loading="isLoadingFiles">
      <template #file_name-data="{ row }"> 
        <span>{{ row.file_name }}</span>
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="actionItems(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
       <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <span class="italic text-sm">No files found!</span>
          <UButton label="Upload file" @click="openAddFileModal" />
          <UButton label="Add file from URL" @click="openAddFileFromURLModal" />
        </div>
      </template>
    </UTable>
  </div>

  <!-- Add File Modal -->
    <UModal v-model="isAddFileModalOpen">
      <div class="p-5">
        <AddFileForm
            @close="closeAddFileModal"
            @item-added="handleItemAdded"
        />
      </div>
    </UModal>

    <!-- Add File From URL Modal -->
    <UModal v-model="isAddFileFromURLModalOpen">
      <div class="p-5">
        <AddFileFromURL
            @close="closeAddFileFromURLModal"
            @item-added="handleItemAdded"
        />
      </div>
    </UModal>
  
    <UNotifications />

  <!-- Confirmation Modal for Deleting Files -->
  <ConfirmDeleteModal
    :is-open="isConfirmDeleteModalOpen"
    :item-name="fileToDelete ? fileToDelete.file_name : ''"
    @update:is-open="isConfirmDeleteModalOpen = $event"
    @confirm="handleDeleteFileConfirmed"
    @cancel="closeConfirmDeleteModal"
    @close="closeConfirmDeleteModal"
  />
</template>

<script setup lang="ts">

    definePageMeta({
    layout: 'user-access',
    });

    interface FileType {
        id: number;
        file_name: string;
        included_in_source_data: boolean | string; // API might return string "True"/"False"
        already_processed_to_source_data: boolean | string;
    }

    const { id } = useRoute().params;
    const toast = useToast();
    import { useAuthStore } from '~/stores/auth';
    import { ref, computed } from 'vue';
    import AddFileForm from '~/components/AddFileForm.vue';
    import AddFileFromURL from '~/components/AddFileFromURL.vue';
    const authStore = useAuthStore();

    const account_unique_id = authStore.uniqueAccountId
    const apiAuthorizationToken = authStore.access_token;

    const isConfirmDeleteModalOpen = ref(false);
    const fileToDelete = ref<FileType | null>(null);
    const isDeletingInProgress = ref(false);

        // Fetch folders data with headers
    const { data: files, error, refresh } = await useFetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/files/${account_unique_id}/${id}`, {
    method: 'GET',
    headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${apiAuthorizationToken}`,
    }
    });


    // Check for errors
    if (error.value) {
    console.error('Error fetching files:', error.value);
    toast.add({ title: 'Error', description: `Could not fetch files: ${error.value.message || 'Unknown error'}`, color: 'red' });
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
        // key: 'included_in_source_data',
        // label: 'Included in source data',
        // class: 'text-primary'
        // }, {
        key: 'already_processed_to_source_data',
        label: 'Already processed to source data',
        class: 'text-primary'
        }, {
        key: 'actions',
        class: 'text-primary'
        }];


    
      // Add File Modal state
    const isAddFileModalOpen = ref(false);

    const openAddFileModal = () => {
      isAddFileModalOpen.value = true;
      console.log('Modal opened');
    };

    const closeAddFileModal = () => {
      isAddFileModalOpen.value = false;
      console.log('Modal closed');
    };

    closeAddFileModal(); 

    // Add File From URL Modal state
    const isAddFileFromURLModalOpen = ref(false);

    const openAddFileFromURLModal = () => {
      isAddFileFromURLModalOpen.value = true;
      console.log('Modal opened');
    };

    const closeAddFileFromURLModal = () => {
      isAddFileFromURLModalOpen.value = false;
      console.log('Modal closed');
    };

    closeAddFileFromURLModal(); 

    // This method will be called when 'filesAdded' is emitted
    const handleItemAdded = async () => {
      console.log('Files added, refreshing list...');
      await refreshFiles(); // Call the refresh function from useFetch
    };

    // --- State for Delete File Modal ---
    const openDeleteConfirmation = (file: FileType) => {
        fileToDelete.value = file;
        isConfirmDeleteModalOpen.value = true;
    };

    const closeConfirmDeleteModal = () => {
        isConfirmDeleteModalOpen.value = false;
        fileToDelete.value = null;
    };

    const handleDeleteFileConfirmed = async () => {
        if (!fileToDelete.value) return;

        isDeletingInProgress.value = true; // You can use this for a global loading indicator or pass to modal
    const fileBeingDeleted = fileToDelete.value; // Keep a reference
  
  // Close modal optimistically, or wait for API response
    closeConfirmDeleteModal(); 

    try {
      await $fetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/files/${account_unique_id}/${fileBeingDeleted.id}`, {
      method: 'DELETE',
      headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded', // DELETE often doesn't need Content-Type for body
          'accept': 'application/json',
          'Authorization': `Bearer ${apiAuthorizationToken}`,
      },
      });

      toast.add({ title: 'File Deleted', description: `File "${fileBeingDeleted.file_name}" has been deleted.`, color: 'green' });
      await refreshFiles(); // Refresh the list from the server
    } catch (err: any) {
        console.error('Error deleting file:', err);
        const errorMessage = err.data?.detail || err.message || 'Could not delete file.';
        toast.add({ title: 'Error', description: errorMessage, color: 'red' });
    } finally {
        isDeletingInProgress.value = false;
    }
    };

    const actionItems = (row: FileType) => [
    // [{
    //     label: 'Edit',
    //     icon: 'i-heroicons-pencil-square-20-solid',
    //     click: () => console.log('Edit file:', row.id) // Implement edit logic
    // }, {
    //     label: 'Process',
    //     icon: 'i-heroicons-arrow-path-20-solid',
    //     click: () => console.log('Process file:', row.id) // Implement process logic
    // }],
    [{
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: () => openDeleteConfirmation(row)
    }]
    ];


    const refreshFiles = async () => {
        console.log('Refreshing folders...');
        await refresh();
        };

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