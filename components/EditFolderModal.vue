<template>
	<UModal :model-value="isOpen" @update:model-value="handleClose">
		<UCard
			:ui="{
				ring: '',
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
			}"
		>
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="heading heading--h3">Edit Folder</h3>
					<UButton
						color="gray"
						variant="ghost"
						icon="i-heroicons-x-mark-20-solid"
						class="-my-1"
						@click="handleClose"
					/>
				</div>
			</template>

			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4 p-4"
				@submit="submitForm"
			>
				<UFormGroup label="Folder Name" name="folder_name">
					<UInput v-model="state.folder_name" />
				</UFormGroup>

				<div class="flex justify-end gap-2 pt-4">
					<UButton color="gray" variant="ghost" @click="handleClose">
						Cancel
					</UButton>
					<UButton type="submit" :loading="isLoading">
						Save Changes
					</UButton>
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref, watch, reactive } from 'vue';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const props = defineProps<{
	isOpen: boolean;
	folder: {
		// The folder object being edited
		id: number;
		folder_name: string;
	} | null; // Allow null for when no folder is selected
}>();

const emit = defineEmits(['update:isOpen', 'folderUpdated', 'close']);

const toast = useToast();
const authStore = useAuthStore();
const account_unique_id = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const isLoading = ref(false);

// Zod schema for validation
const schema = z.object({
	folder_name: z.string().min(1, 'Folder name cannot be empty'),
});

type Schema = z.output<typeof schema>;

// Form state
const state = reactive<Schema>({
	folder_name: '',
});

// Watch for changes in the folder prop to update the form state
watch(
	() => props.folder,
	(newFolder) => {
		if (newFolder) {
			state.folder_name = newFolder.folder_name;
		} else {
			state.folder_name = ''; // Reset if no folder
		}
	},
	{ immediate: true }
);

const handleClose = () => {
	emit('close'); // Emit close to parent
};

const submitForm = async (event: FormSubmitEvent<Schema>) => {
	if (!props.folder) return; // Should not happen if modal is open with a folder

	isLoading.value = true;
	try {
		// API call to update the folder
		// Assuming PUT request to /api/v1/folder/{folder_id}
		const updatedFolderData = await $fetch(
			`${config.public.apiBase}/folders/${account_unique_id}/${props.folder.id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json', // Usually for PUT with JSON body
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
				body: {
					folder_name: event.data.folder_name, // Send only the updated name
					// Include other fields if your API expects them for an update
				},
			}
		);

		toast.add({
			title: 'Folder Updated',
			description: `Folder "${event.data.folder_name}" has been updated.`,
			color: 'green',
		});
		emit('folderUpdated', updatedFolderData); // Emit event with the updated folder data from API
		handleClose(); // Close the modal
	} catch (error: any) {
		console.error('Error updating folder:', error);
		const errorMessage =
			error.data?.detail || error.message || 'Could not update folder.';
		toast.add({ title: 'Error', description: errorMessage, color: 'red' });
	} finally {
		isLoading.value = false;
	}
};
</script>
