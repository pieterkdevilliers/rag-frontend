<template>
        <UCard>
            <p class="font-bold text-gray-500 m-4">Email: {{ user.user_email }}</p>
            <p class="font-bold text-gray-500 m-4">User ID: {{ user.id }}</p>
            <template #footer>
                <div class="flex gap-2">
                    <UButton 
                        :to="`/users/${user.id}`"
                        icon="i-heroicons:pencil-square"
                        />

                    <UButton 
                        icon="i-heroicons:trash"
                        @click="openConfirmDeleteModal"
                        :loading="isDeleting"
                        />
                </div>
            </template>
        </UCard>

  <!-- Confirmation Modal -->
  <ConfirmDeleteModal
    :is-open="isModalOpen"
    :item-name="user.user_email"
    @update:is-open="isModalOpen = $event"
    @confirm="handleDeleteUser"
    @cancel="closeConfirmDeleteModal"
    @close="closeConfirmDeleteModal"
  />

</template>

<script setup lang="ts">
const { user } = defineProps<{
    user: {
        id: number;
        user_email: string;
    };
}>();

const emit = defineEmits(['userDeleted', 'editUser']);

const toast = useToast(); // For notifications
const authStore = useAuthStore();
const router = useRouter();
const isModalOpen = ref(false);
const isDeleting = ref(false);

const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const openConfirmDeleteModal = () => {
  isModalOpen.value = true;
};

const closeConfirmDeleteModal = () => {
  isModalOpen.value = false;
};

const handleDeleteUser = async () => {
  isDeleting.value = true;
  closeConfirmDeleteModal(); // Close modal immediately

  try {
    await $fetch(`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/users/${uniqueAccountId}/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        accept: 'application/json',
        Authorization: `Bearer ${apiAuthorizationToken}`,
      },
    });

    toast.add({ title: 'User Deleted', description: `User "${user.id} - ${user.user_email}" has been deleted.`, color: 'green' });
    emit('userDeleted', user.id); // Emit event with user ID
  } catch (error: any) {
    console.error('Error deleting user:', error);
    const errorMessage = error.data?.detail || error.message || 'Could not delete user.';
    toast.add({ title: 'Error', description: errorMessage, color: 'red' });
  } finally {
    isDeleting.value = false;
  }
};

</script>

<style scoped>

</style>