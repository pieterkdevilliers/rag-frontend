<template>
  <div>
    <h1 class="text-xl text-primary">Users</h1>
    
    <div class="flex justify-end mb-4">
      <UButton
        icon="i-heroicons:plus-circle-16-solid"
        variant="outline"
        @click="openModal"
      />
    </div>
  
    <div class="grid grid-cols-4 gap-5">
      <div v-for="user in users?.users" :key="user.id">
        <UserCard 
          :user="user" 
          @user-deleted="handleUserRemoved"
          @edit-user-clicked="openEditUserModal"
          />
      </div>
    </div>
  
    <!-- Modal -->
    <UModal v-model="isModalOpen">
      <div class="p-5">
        <AddUserForm @close="closeModal" @userAdded="refreshUsers" />
      </div>
    </UModal>

    <!-- Edit User Modal -->
    <EditUserModal
      :is-open="isEditModalOpen"
      :user="userToEdit"
      @close="closeEditUserModal"
      @user-updated="handleUserUpdated"
      />

    <UNotifications />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { useAuthStore } from '~/stores/auth';
  import AddUserForm from '~/components/AddUserForm.vue'; // Import modal component

  definePageMeta({
    layout: 'user-access',
  });

  interface User {
    id: number;
    password: string;
    name: string;
    email: string;
  }

  const authStore = useAuthStore();
  const apiAuthorizationToken = authStore.access_token;

  const { data: users, error, refresh } = await useFetch('https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/users', {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${apiAuthorizationToken}`,
    },
  });

  if (error.value) {
    console.error('Error fetching users:', error.value);
  } else {
    console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
  }

  const handleUserRemoved = (deletedUserId: number) => {
    console.log(`User with ID ${deletedUserId} was reported as deleted. Triggering refresh.`);
    refreshUsers();
  };
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

  const refreshUsers = async () => {
    console.log('Refreshing users...');
    await refresh();
  };

    // --- State for Edit User Modal ---
  const isEditModalOpen = ref(false);
  const userToEdit = ref<User | null>(null);

  const openEditUserModal = (user: User) => {
    userToEdit.value = user;
    isEditModalOpen.value = true;
  };

  const closeEditUserModal = () => {
    isEditModalOpen.value = false;
    userToEdit.value = null; // Clear the selected user
  };

  const handleUserUpdated = async (updatedUser: User) => {
    // Option 1: Refresh the whole list (simpler)
    await refreshUsers();
  }
</script>