<template>
	<UCard>
		<p class="text-gray-500 m-4 truncate">{{ file.file_name }}</p>
		<p class="text-gray-500 m-4">ID: {{ file.id }}</p>
		<template #footer>
			<div class="flex gap-2">
				<UButton icon="i-heroicons:pencil-square" />
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
		:item-name="file.file_name"
		@update:is-open="isModalOpen = $event"
		@confirm="handleDeleteFile"
		@cancel="closeConfirmDeleteModal"
		@close="closeConfirmDeleteModal"
	/>
</template>

<script setup lang="ts">
const { file } = defineProps<{
	file: {
		id: number;
		file_name: string;
	};
}>();

const emit = defineEmits(['fileDeleted', 'editFile']);

const toast = useToast();
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

const handleDeleteFile = async () => {
	isDeleting.value = true;
	closeConfirmDeleteModal(); // Close modal immediately

	try {
		await $fetch(
			`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/files/${uniqueAccountId}/${file.id}`,
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
			title: 'File Deleted',
			description: `File "${file.file_name}" has been deleted.`,
			color: 'green',
		});
		emit('fileDeleted', file.id); // Emit event with file ID
	} catch (error: any) {
		console.error('Error deleting file:', error);
		const errorMessage =
			error.data?.detail || error.message || 'Could not delete file.';
		toast.add({ title: 'Error', description: errorMessage, color: 'red' });
	} finally {
		isDeleting.value = false;
	}
};
</script>

<style scoped></style>
