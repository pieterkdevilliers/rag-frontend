<template>
	<div class="max-w-md mx-auto p-4">
		<form @submit.prevent="handleAddFileFromURL">
			<h2 class="text-2xl mb-4">Add New File</h2>
			<div class="mb-4">
				<label
					class="block text-sm font-medium text-gray-700"
					for="source_url"
					>Source URL</label
				>
				<UInput
					v-model="source_url"
					id="source_url"
					type="text"
					placeholder="Enter source url"
					autocomplete="off"
				/>
			</div>
			<UButton
				type="submit"
				icon="i-heroicons:folder-plus"
				label="Add File From URL"
			>
			</UButton>
		</form>
		<p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
	</div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';

const emit = defineEmits(['close', 'itemAdded']);
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const route = useRoute();
const isLoading = ref(false);

const source_url = ref('');
const errorMessage = ref('');
const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const handleAddFileFromURL = async () => {
	errorMessage.value = '';
	isLoading.value = true;

	if (!source_url.value) {
		errorMessage.value = 'Please enter a URL.';
		isLoading.value = false;
		return;
	}

	// --- Get Folder ID from route ---
	const paramName = 'id'; // Make sure this matches your route parameter for folder ID
	let folder_id: string | string[] | undefined = route.params[paramName];
	if (Array.isArray(folder_id)) {
		folder_id = folder_id[0]; // Take the first if it's an array
	}
	if (!folder_id) {
		errorMessage.value = 'Folder ID not found in URL.';
		console.error('Folder ID is missing from the route parameters.');
		// Potentially disable the form or redirect
	}

	try {
		const requestBody = {
			url: source_url.value,
		};

		console.log('Request body for get-text-from-url:', requestBody);

		// $fetch will parse the JSON response automatically if Content-Type is application/json
		// It will also throw for non-2xx responses.
		// Let's define the expected successful response type for better type safety.
		interface SuccessResponse {
			response: string; // e.g., "success"
			url: string;
			// Add other fields if your API returns more on success
		}

		const responseData = await $fetch<SuccessResponse>( // Type hint for the expected success data
			`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/get-text-from-url/${uniqueAccountId}/${folder_id}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json', // What your client expects from the server
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
				body: requestBody, // $fetch handles stringification
			}
		);

		// If $fetch didn't throw, the request was successful (2xx) and responseData is the parsed JSON body
		console.log('Success response from get-text-from-url:', responseData);

		if (responseData && responseData.response === 'success') {
			// Use Nuxt UI toast for feedback (optional, but good UX)
			toast.add({
				title: 'Success',
				description: `Text processed from URL: ${responseData.url}`,
				color: 'green',
			});

			emit('itemAdded');
			emit('close');
			// router.push('/folders'); // Or your desired redirect
		} else {
			// This case might not be hit often if API strictly uses HTTP status codes for errors
			// but good for defensive programming if API might return 200 OK with an operational error message.
			throw new Error(
				(responseData as any)?.detail ||
					'Processing URL succeeded but returned an unexpected format.'
			);
		}
	} catch (error: any) {
		console.error('Error adding file from URL:', error);
		// $fetch error object often has a 'data' property with the parsed JSON error from FastAPI
		if (error.data && error.data.detail) {
			errorMessage.value = `Error: ${error.data.detail}`;
		} else if (error.response && error.response._data) {
			// Fallback for some error structures
			// error.response._data might be a string or an object
			const errorDetail =
				typeof error.response._data === 'object'
					? error.response._data.detail
					: error.response._data;
			errorMessage.value = `Error: ${errorDetail || error.message}`;
		} else {
			errorMessage.value =
				error.message ||
				'Unable to add file from URL. Please check the URL and try again.';
		}
	} finally {
		isLoading.value = false;
	}
};
</script>

<style scoped>
/* Add Tailwind CSS or custom styles here */
</style>
