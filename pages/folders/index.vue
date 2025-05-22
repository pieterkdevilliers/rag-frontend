<template>
  <div>
    <h1 class="text-xl text-primary" >Folders</h1>
  </div>
  <div class="flex justify-end mb-4">
    <UButton
      icon="i-heroicons:plus-circle-16-solid"
      variant="outline"
      @click="openModal"
    />
  </div>
  <div>
    <div class="flex px-3 py-3.5">
        <UInput v-model="q" placeholder="Filter folders..." />
    </div>
    <div class="grid grid-cols-6 gap-5">
    <div v-for="folder in filteredFolders" :key="folder.id">
        <FolderCard 
          :folder="folder"
          @folder-deleted="handleFolderRemoved" 
          @edit-folder-clicked="openEditFolderModal"
           />
    </div>
  </div>
  <!-- Add Folder Modal -->
  <UModal v-model="isModalOpen">
      <div class="p-5">
        <AddFolderForm @close="closeModal" @folderAdded="refreshFolders" />
      </div>
    </UModal>
  
    <!-- Edit Folder Modal -->
  <EditFolderModal
    :is-open="isEditModalOpen"
    :folder="folderToEdit"
    @close="closeEditFolderModal"
    @folder-updated="handleFolderUpdated"
    />

    <UNotifications />
  </div>
</template>

<script setup lang="ts">

  definePageMeta({
    layout: 'user-access',
  });

  interface Folder {
    id: number;
    folder_name: string;
  }
  import { ref } from 'vue';
  import { useAuthStore } from '~/stores/auth';
  import AddFolderForm from '~/components/AddFolderForm.vue'; // Import modal component
  const authStore = useAuthStore();

  const account_unique_id = authStore.uniqueAccountId
  const apiAuthorizationToken = authStore.access_token;

    // Fetch folders data with headers
  const { data: folders, error, refresh } = await useFetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/folders/${account_unique_id}`, {
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'Authorization': `Bearer ${apiAuthorizationToken}`,
  }
  });


  const handleFolderRemoved = (deletedFolderId: number) => {
    console.log(`Folder with ID ${deletedFolderId} was reported as deleted. Triggering refresh.`);
    refreshFolders();
  };

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
    
  // Modal state
  const isModalOpen = ref(false);

  const openModal = () => {
    isModalOpen.value = true;
    console.log('Modal opened');
  };

  const closeModal = () => {
    isModalOpen.value = false;
    console.log('Modal closed');
  };

  const refreshFolders = async () => {
    console.log('Refreshing folders...');
    await refresh();
  };

  // --- State for Edit Folder Modal ---
  const isEditModalOpen = ref(false);
  const folderToEdit = ref<Folder | null>(null);

  const openEditFolderModal = (folder: Folder) => {
    folderToEdit.value = folder;
    isEditModalOpen.value = true;
  };

  const closeEditFolderModal = () => {
    isEditModalOpen.value = false;
    folderToEdit.value = null; // Clear the selected folder
  };

  const handleFolderUpdated = async (updatedFolder: Folder) => {
    // Option 1: Refresh the whole list (simpler)
    await refreshFolders();
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