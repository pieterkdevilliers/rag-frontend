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
					<h3 class="heading heading--h3">Edit Webhook Destination URL</h3>
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
				<UFormGroup label="Destination URL" name="Destination URL">
					<UInput v-model="state.webhook_url" />
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
	webhook: {
		account: {
			webhook_url: string;
		};
	} | null; // Allow it to be null when the modal is closed
}>();

const emit = defineEmits(['close', 'webhookUpdated']);

const toast = useToast();
const authStore = useAuthStore();
const account_unique_id = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const isLoading = ref(false);

const handleClose = () => {
	emit('close'); // Emit close to parent
};

// Zod schema for validation
const schema = z.object({
	webhook_url: z.string(),
});

type Schema = z.output<typeof schema>;

// Form state
const state = reactive<Schema>({
	webhook_url: '',
});

watch(() => props.webhook, (newWebhook) => {
  if (newWebhook && newWebhook.account) {
    // Update the form state with the current value
    state.webhook_url = newWebhook.account.webhook_url;
  } else {
    // Reset the form when the modal is closed
    state.webhook_url = '';
  }
});

const submitForm = async (event: FormSubmitEvent<Schema>) => {
	if (!props.webhook) return; // Should not happen if modal is open with a webhook

	isLoading.value = true;
	try {
		const updatedWebhookData = await $fetch(
			`${config.public.apiBase}/accounts/${account_unique_id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json', // Usually for PUT with JSON body
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
				body: {
					webhook_url: event.data.webhook_url,
				},
			}
		);

		toast.add({
			title: 'Webhook Updated',
			description: `Webhook URL has been updated.`,
			color: 'green',
		});
		emit('webhookUpdated', updatedWebhookData); // Emit event with the updated user data from API
		handleClose(); // Close the modal
	} catch (error: any) {
		console.error('Error updating user:', error);
		const errorMessage =
			error.data?.detail || error.message || 'Could not update user.';
		toast.add({ title: 'Error', description: errorMessage, color: 'red' });
	} finally {
		isLoading.value = false;
	}
};
</script>
