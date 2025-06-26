<template>
	<UCard>
		<p class="text-gray-500 m-4">ID: {{ folder.id }}</p>
		<p class="text-gray-500 m-4">Name: {{ folder.folder_name }}</p>
		<template #footer>
			<div class="flex gap-2">
				<UTooltip text="View folder contents">
					<UButton
						:to="`/folders/${folder.id}`"
						icon="i-heroicons-clipboard-document-list"
						aria-label="View folder contents"
					/>
				</UTooltip>
				<UTooltip text="Edit folder details">
					<UButton
						icon="i-heroicons-pencil-square"
						aria-label="Edit folder"
						@click="emitEditFolder"
					/>
				</UTooltip>
				<UTooltip text="Delete folder">
					<UButton
						icon="i-heroicons-trash"
						aria-label="Delete folder"
						@click="openConfirmDeleteModal"
						:loading="isDeleting"
					/>
				</UTooltip>
			</div>
		</template>
	</UCard>

	<!-- Confirmation Modal -->
	<ConfirmDeleteModal
		:is-open="isDeleteModalOpen"
		:item-name="folder.folder_name"
		@update:is-open="isDeleteModalOpen = $event"
		@confirm="handleDeleteFolder"
		@cancel="closeConfirmDeleteModal"
		@close="closeConfirmDeleteModal"
	/>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref } from 'vue';
// Assuming ConfirmDeleteModal is in components/ConfirmDeleteModal.vue
// Nuxt 3 auto-imports components from the `components` directory.
// import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue'; // Not strictly needed due to auto-import

const props = defineProps<{
	folder: {
		id: number;
		folder_name: string;
	};
}>();

const emit = defineEmits(['folderDeleted', 'editFolderClicked']);

const toast = useToast(); // For notifications
const authStore = useAuthStore();
const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);

const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const openConfirmDeleteModal = () => {
	isDeleteModalOpen.value = true;
};

const closeConfirmDeleteModal = () => {
	isDeleteModalOpen.value = false;
};

const handleDeleteFolder = async () => {
	isDeleting.value = true;
	closeConfirmDeleteModal(); // Close modal immediately

	try {
		await $fetch(
			`${config.public.apiBase}/folder/${props.folder.id}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
			}
		);

		toast.add({
			title: 'Folder Deleted',
			description: `Folder "${props.folder.folder_name}" has been deleted.`,
			color: 'green',
		});
		emit('folderDeleted', props.folder.id); // Emit event with folder ID
	} catch (error: any) {
		console.error('Error deleting folder:', error);
		const errorMessage =
			error.data?.detail || error.message || 'Could not delete folder.';
		toast.add({ title: 'Error', description: errorMessage, color: 'red' });
	} finally {
		isDeleting.value = false;
	}
};

const emitEditFolder = () => {
	emit('editFolderClicked', props.folder); // Emit the folder object
};
</script>

<style scoped>
/* Your styles */
</style>
