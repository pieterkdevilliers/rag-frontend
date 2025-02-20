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
        <UserCard :user="user" />
      </div>
    </div>
  
    <!-- Modal -->
    <UModal v-model="isModalOpen">
      <div class="p-5">
        <AddUserForm @close="closeModal" @userAdded="refreshUsers" />
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import AddUserForm from '~/components/AddUserForm.vue'; // Import modal component

definePageMeta({
  layout: 'user-access',
});

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
</script>