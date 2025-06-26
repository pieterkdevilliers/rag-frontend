<template>
  <div>
    <h1 class="text-xl text-primary">Documents</h1>
  </div>
    <div class="flex justify-start mb-4">
      <UTooltip text="Add new files to AI database">
        <UButton
          icon="i-heroicons-arrow-path-20-solid"
          label="Update AI Database"
          variant="solid"
          @click="openRefreshDBModal"
        />
      </UTooltip>
  </div>
  <!-- <div class="flex justify-end mb-4">
    <UButton
      icon="i-heroicons:plus-circle-16-solid"
      label="Add file from URL"
      @click="openAddFileFromURLModal"
      />
  </div> -->
  <div v-if="canAddMoreDocs" class="flex justify-end mb-4">
    <UButton
      icon="i-heroicons:plus-circle-16-solid"
      label="Upload file"
      variant="outline"
      @click="openAddFileModal"
    />
  </div>
  <div v-if="!canAddMoreDocs" class="flex justify-end mb-4">
    <UButton
      icon="i-heroicons:plus-circle-16-solid"
      label="File limit reached - subscribe to add more"
      to="/accounts"
    />
  </div>
  <div>
    <div class="flex px-3 py-3.5">
      <UInput v-model="q" placeholder="Filter documents..." />
    </div>
				<!-- Pagination Controls -->
		<div
			class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
		>
			<UPagination
				v-model="page"
				:page-count="pageCount"
				:total="filteredRows.length"
			/>
		</div>
    <UTable :rows="paginatedRows" :columns="columns" :loading="isLoadingFiles">
      <template #file_name-data="{ row }"> 
        <span>{{ row.file_name }}</span>
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="actionItems(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
       <template #empty-state>
        <div v-if="canAddMoreDocs" class="flex flex-col items-center justify-center py-6 gap-3">
          <span class="italic text-sm">No files found!</span>
          <!-- <UButton
            label="Add file from URL"
            icon="i-heroicons:plus-circle-16-solid"
            @click="openAddFileFromURLModal"
          /> -->
          <UButton
            label="Upload file"
            icon="i-heroicons:plus-circle-16-solid"
            @click="openAddFileModal"
          />
        </div>
      </template>
    </UTable>

				<!-- Pagination Controls -->
		<div
			class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
		>
			<UPagination
				v-model="page"
				:page-count="pageCount"
				:total="filteredRows.length"
			/>
		</div>
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

  <!-- Refresh AI DB Modal -->
    <RefreshDBModal v-model="isRefreshDBModalOpen"
      :is-open="isRefreshDBModalOpen"
      @update:is-open="isRefreshDBModalOpen = $event"
      @confirm="handleConfirmRefreshDB"
      @cancel="closeRefreshDBModal"
      @close="closeRefreshDBModal"
       />
  
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

  import { useAuthStore } from '~/stores/auth';
  import { ref, computed, watch } from 'vue';
  import AddFileForm from '~/components/AddFileForm.vue';
  import AddFileFromURL from '~/components/AddFileFromURL.vue';



  function toTitleCase(str) {
    if (!str) return "";
    return str.split(' ').map(word => {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }

    definePageMeta({
    layout: 'user-access',
    });

    interface FileType {
        id: number;
        file_name: string;
        included_in_source_data: boolean | string; // API might return string "True"/"False"
        already_processed_to_source_data: boolean | string;
    }

    const config = useRuntimeConfig();
    const { id } = useRoute().params;
    const toast = useToast();

    
    const authStore = useAuthStore();
    const account_unique_id = authStore.uniqueAccountId
    const apiAuthorizationToken = authStore.access_token;
    const canAddMoreDocs = computed(() => authStore.docs_count < 10 || authStore.subs_status);

    const isConfirmDeleteModalOpen = ref(false);
    const fileToDelete = ref<FileType | null>(null);
    const isDeletingInProgress = ref(false);

        // Fetch folders data with headers
    const { data: filesResponse, error, refresh: doFetchRefresh } = await useFetch(`${config.public.apiBase}/files/${account_unique_id}/${id}`, {
    method: 'GET',
    headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${apiAuthorizationToken}`,
    },
    default: () => [],
    });


    // Check for errors
    if (error.value) {
    console.error('Error fetching files:', error.value);
    toast.add({ title: 'Error', description: `Could not fetch files: ${error.value.message || 'Unknown error'}`, color: 'red' });
    } else {
    // Check if the response has the expected structure
    if (filesResponse.value) {
        console.log('Files:', filesResponse.value);
        console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
    } else {
        console.error('Unexpected response format:', filesResponse.value);
    }
    }

// Computed property that transforms the raw API data for display
  const filesWithDisplayNames = computed(() => {
    if (!filesResponse.value || !filesResponse.value.files) {
      return [];
    }
    return filesResponse.value.files.map(file => {
      const originalFileName = file.file_name; // Keep the original for reference or filtering

      // --- Logic to create display name ---
      let displayNameInProgress = originalFileName;
      const lastUnderscoreIndex = originalFileName.lastIndexOf('_');

      if (lastUnderscoreIndex !== -1) {
        const potentialIdPart = originalFileName.substring(lastUnderscoreIndex + 1);
        // Regex to check for common ID patterns like _hexchars.pdf or _number.pdf
        if (/^[a-f0-9]+(\.pdf|\.txt|\.docx|\.doc|\.md)$/i.test(potentialIdPart) || /^[0-9]+(\.pdf|\.txt|\.docx|\.doc|\.md)$/i.test(potentialIdPart)) {
          displayNameInProgress = originalFileName.substring(0, lastUnderscoreIndex);
        }
      }
      // Remove any remaining common file extensions for display
      displayNameInProgress = displayNameInProgress.replace(/\.(pdf|txt|docx|doc|md)$/i, '');

      displayNameInProgress = displayNameInProgress.replace(/_/g, ' ');

      const finalDisplayName = toTitleCase(displayNameInProgress.trim());

      const isProcessed = file.already_processed_to_source_data === true || 
                          String(file.already_processed_to_source_data).toLowerCase() === 'true';

      const processedStatusDisplay = isProcessed ? 'Yes' : 'No';

      return {
        ...file, 
        display_name: finalDisplayName || originalFileName, 
        processed_status_display: processedStatusDisplay
      };
    });
  });

    const columns = [{
        key: 'id',
        label: 'ID',
        class: 'text-primary'
        }, {
        key: 'display_name',
        label: 'File Name',
        class: 'text-primary'
        }, {
        // key: 'included_in_source_data',
        // label: 'Included in source data',
        // class: 'text-primary'
        // }, {
        key: 'processed_status_display',
        label: 'Already processed to source data',
        class: 'text-primary'
        }, {
        key: 'actions',
        class: 'text-primary'
        }];

    // --- Pagination and Filtering Logic ---

    // 1. State for pagination
    const page = ref(1);
    const pageCount = 10; // Number of items per page

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

    // closeAddFileModal(); 

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
      const response = await $fetch(`${config.public.apiBase}/files/${account_unique_id}/${fileBeingDeleted.id}`, {
      method: 'DELETE',
      headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded', // DELETE often doesn't need Content-Type for body
          'accept': 'application/json',
          'Authorization': `Bearer ${apiAuthorizationToken}`,
      },
      });

      toast.add({ title: 'File Deleted', description: `File "${fileBeingDeleted.file_name}" has been deleted.`, color: 'green' });
      authStore.setDocsCount(response.new_docs_count)
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
    [{
        label: 'Delete',
        icon: 'i-heroicons-trash-20-solid',
        click: () => openDeleteConfirmation(row)
    }]
    ];


    const refreshFiles = async () => {
      console.log('Refreshing files list...');
      await doFetchRefresh(); // This re-fetches data into filesResponse.value
      // filesWithDisplayNames and filteredRows will automatically update.
    };

    const q = ref('');

    // filteredRows now operates on filesWithDisplayNames
    const filteredRows = computed(() => {
      const filesToFilter = filesWithDisplayNames.value; // Use the transformed data

      if (!q.value) {
        return filesToFilter;
      }
      
      return filesToFilter.filter((file) => {
        // Filter based on the display_name or other relevant fields
        return Object.values(file).some((value) => {
          // Specifically target display_name for searching, or original_filename if preferred
          if (typeof value === 'string' && (
              value.toLowerCase().includes(q.value.toLowerCase()) ||
              (file.display_name && file.display_name.toLowerCase().includes(q.value.toLowerCase())) ||
              (file.file_name && file.file_name.toLowerCase().includes(q.value.toLowerCase())) // Search original too
          )) {
            return true;
          }
          return false;
        });
      });
    });

    // 2. Reset page to 1 when filter changes
    watch(q, () => {
      page.value = 1;
    });

    // 3. New computed property to get the rows for the current page
    const paginatedRows = computed(() => {
      const startIndex = (page.value - 1) * pageCount;
      const endIndex = startIndex + pageCount;
      return filteredRows.value.slice(startIndex, endIndex);
    });


  // Refresh AI DB Modal state
  const isRefreshDBModalOpen = ref(false);
  const isDbUpdating = ref(false);

  const openRefreshDBModal = () => {
    isRefreshDBModalOpen.value = true;
    console.log('Modal opened');
  };

  const closeRefreshDBModal = () => {
    isRefreshDBModalOpen.value = false;
    console.log('Modal closed');
  };

  const handleConfirmRefreshDB = async ( replace: boolean ) => {
    isDbUpdating.value = true; // Start loading indicator
    closeRefreshDBModal();    // Close the modal immediately

    console.log('Replace value received from modal:', replace); // For debugging

    try {

      toast.add({
        title: 'Database Update Started',
        description: 'The AI database update process has been initiated. This may take some time.',
        color: 'green',
        timeout: 5000 // Keep message for 5 seconds
      });
      
      const response = await $fetch(`${config.public.apiBase}/generate-chroma-db/${account_unique_id}?replace=${replace}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${apiAuthorizationToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('AI Database refresh initiated:', response);

      // Optionally, you might want to refresh some data or navigate,
      // depending on what the API call does and returns.
      // For example, if it updates some status you display:
      // await refreshSomeStatusData();

    } catch (err: any) {
      console.error('Error initiating AI Database refresh:', err);
      const errorMessage = err.data?.detail || err.message || 'Could not start database update.';
      toast.add({
        title: 'Error',
        description: errorMessage,
        color: 'red'
      });
    } finally {
      isDbUpdating.value = false; // Stop loading indicator
    }
  };

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
