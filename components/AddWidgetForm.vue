<template>
	<div class="max-w-md mx-auto p-4">
		<form @submit.prevent="handleAddWidget">
			<h2 class="text-2xl mb-4">Add New Widget</h2>
			<div class="mb-4">
				<label
					class="block text-sm font-medium text-gray-700"
					for="name"
					>Widget Name</label
				>
				<UInput
					v-model="name"
					id="name"
					type="text"
					placeholder="Enter new widget name"
					autocomplete="off"
				/>
			</div>
			<div class="mb-4">
				<label
					class="block text-sm font-medium text-gray-700"
					for="allowed_origins"
					>Allowed Origins</label
				>
				<UTextarea
					v-model="allowed_origins"
					id="allowed_origins"
					type="text"
					placeholder="Enter allowed origins (comma-separated)"
					autocomplete="off"
				/>
			</div>
			<UButton
				type="submit"
				icon="i-heroicons:command-line"
				label="Add New Widget"
			>
			</UButton>
		</form>
		<p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>

		<!-- The Modal Component for showing the API Key -->
		<!-- Assuming UModal or a similar component structure -->
		<UModal v-model="isApiKeyModalOpen" :prevent-close="true">
			<ShowApiKeyModal
				:api-key="generatedApiKeyForModal"
				@close="handleApiKeyModalClosed"
			/>
		</UModal>
	</div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref, defineEmits } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import ShowApiKeyModal from '~/components/ShowApiKeyModal.vue';

const isSubmitting = ref(false);
const isApiKeyModalOpen = ref(false); // Controls visibility of the UModal
const generatedApiKeyForModal = ref<string | null>(null); // Key to pass to the modal

const generatedApiKey = ref<string | null>(null); // To store the API key temporarily
const showApiKeyModal = ref(false); // To control the visibility of a modal/display area

const emit = defineEmits(['close', 'widgetAdded']);
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();

const name = ref('');
const allowed_origins = ref('');
const errorMessage = ref('');
const uniqueAccountId = authStore.uniqueAccountId;

const handleAddWidget = async () => {
	const widgetName = name.value;

	if (!widgetName || widgetName.trim() === '') {
		toast.add({
			title: 'Error',
			description: 'Widget name is required.',
			color: 'red',
		});
		return;
	}

	errorMessage.value = ''; // Clear previous errors
	generatedApiKey.value = null; // Clear previous key

	try {
		const requestBody = {
			name: widgetName.trim(),
			allowed_origins: allowed_origins.value
				.split(',')
				.map((item) => item.trim())
				.filter((item) => item.length > 0),
		};

		// --- Make sure your API URL is correct for development/production ---
		// Consider using an environment variable for the base URL
		const apiUrl = `${config.public.apiBase}/create-api-key/${uniqueAccountId}`;

		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
			},
			body: JSON.stringify(requestBody),
		});

		const responseData = await response.json(); // Get response data regardless of ok status for now

		if (response.ok) {
			toast.add({
				title: 'Success',
				description: 'Widget API Key generated!',
				color: 'green',
			});

			// --- THIS IS THE KEY PART ---
			if (responseData.api_key) {
				generatedApiKeyForModal.value = responseData.api_key;
				isApiKeyModalOpen.value = true; // Open the UModal
			} else {
				// This case should ideally not happen if your backend always returns it on success
				errorMessage.value =
					'API Key was created but not returned. Please contact support.';
				toast.add({
					title: 'Warning',
					description: errorMessage.value,
					color: 'orange',
				});
			}

			emit('widgetAdded'); // Emit this so the parent component knows to refresh its list of widgets
			// Do NOT emit 'close' or navigate away immediately. Let the user copy the key.
			// The modal will handle its own closing.

			// Reset form fields for next potential creation
			name.value = '';
			allowed_origins.value = '';
		} else {
			errorMessage.value = responseData.detail || 'Failed to add widget.';
			toast.add({
				title: 'Error',
				description: errorMessage.value,
				color: 'red',
			});
		}
	} catch (error: any) {
		console.error('Error creating API key:', error);
		const detailMessage =
			error.data?.detail || error.message || 'Could not create API key.';
		errorMessage.value = detailMessage;
		toast.add({ title: 'Error', description: detailMessage, color: 'red' });
	}
};

const handleApiKeyModalClosed = () => {
	isApiKeyModalOpen.value = false;
	generatedApiKeyForModal.value = null; // Clear the key
	emit('close'); // If this AddWidgetForm itself was a modal and should now close
	// router.push('/web-widgets'); // Or navigate
	console.log('API Key modal closed by user.');
};
</script>

<style scoped>
/* Add Tailwind CSS or custom styles here */
</style>
