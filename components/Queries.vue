<template>
	<div class="mx-auto p-4">
		<div class="max-w-xl mx-auto p-4">
			<form @submit.prevent="handleQuery">
				<h2 class="text-2xl mb-4">Ask me anything</h2>
				<div class="mb-4">
					<label
						class="block text-sm font-medium text-gray-700"
						for="question"
						>Question</label
					>
					<UInput
						v-model="question"
						id="question"
						type="text"
						placeholder="Ask me anything..."
						autocomplete="off"
					/>
				</div>
				<UButton
					type="submit"
					icon="i-heroicons:chat-bubble-left-ellipsis"
					label="Ask Now!"
				/>
			</form>

			<!-- Show error message -->
			<p v-if="errorMessage" class="text-red-600 mt-4">
				{{ errorMessage }}
			</p>

			<!-- Show loading state -->
			<div v-if="loading" class="mt-4">
				<UAlert title="Fetching response..." />
			</div>
		</div>

		<!-- Show response -->
		<div
			v-if="queryResponseText"
			class="mt-4 p-4 border border-gray-300 rounded bg-gray-100"
		>
			<UCard>
				<template #header>
					<h3 class="text-lg font-semibold mb-2">Response:</h3>
					<p class="mb-2">{{ queryResponseText }}</p>
					<h3 class="text-lg font-semibold mb-2">
						Key Source Documents:
					</h3>
					<ul v-if="processedSources.length > 0">
						<li
							v-for="source in processedSources"
							:key="source.fileIdentifier"
							class="mb-1"
						>
							<!-- This link will eventually open the modal. For now, it's a placeholder link -->
							<!-- We'll use UButton with 'to' prop to make it look like a link but handle click later -->
							<UButton
								variant="link"
								:label="source.displayName"
								@click.prevent="
									prepareToOpenDocument(source.fileIdentifier)
								"
								class="p-0 text-left"
							/>
							<!-- For debugging, you can show the fileIdentifier or viewUrl -->
							<!-- <span class="text-xs text-gray-400 ml-2"> (Debug: {{ source.fileIdentifier }})</span> -->
						</li>
					</ul>
					<p v-else class="text-sm text-gray-500">
						No specific sources cited.
					</p>
				</template>
			</UCard>
		</div>

		<DocumentViewerModal
			:is-open="isDocumentModalOpen"
			:file-identifier="selectedFileToView"
			:account-unique-id="account_unique_id"
			@close="closeDocumentModal"
			@update:is-open="isDocumentModalOpen = $event"
		/>
		<UNotifications />
	</div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const question = ref('');
const errorMessage = ref('');
const queryResponseText = ref<string | null>(null);
const queryResponseSourcesRaw = ref([]);
const loading = ref(false);
const account_unique_id = authStore.uniqueAccountId;
const isDocumentModalOpen = ref(false);
const selectedFileToView = ref<string | null>(null);

// Computed property to process raw sources into usable objects
const processedSources = computed(() => {
	return queryResponseSourcesRaw.value.map((sourceString) => {
		// Step 1: Extract the filename (e.g., "document_name_xyz123.pdf")
		// This assumes sourceString is an S3 key or a full URL
		let fileIdentifier = sourceString.split('/').pop() || sourceString; // Fallback to full string if no '/'

		// Step 2: Create a user-friendly display name
		// Removes the unique ID part (e.g., "_xyz123") and the .pdf extension
		const lastUnderscoreIndex = fileIdentifier.lastIndexOf('_');
		let displayNameWithoutId = fileIdentifier;
		if (lastUnderscoreIndex !== -1) {
			// Check if the part after the last underscore looks like an ID (hex + .pdf)
			const potentialIdPart = fileIdentifier.substring(
				lastUnderscoreIndex + 1
			);
			if (/^[a-f0-9]+\.pdf$/i.test(potentialIdPart)) {
				// Checks for hex characters followed by .pdf
				displayNameWithoutId = fileIdentifier.substring(
					0,
					lastUnderscoreIndex
				);
			}
			// If it doesn't look like our ID format, maybe it's part of the actual name.
			// Or, if you *always* want to strip after the last underscore regardless of format:
			// displayNameWithoutId = fileIdentifier.substring(0, lastUnderscoreIndex);
		}
		// Remove .pdf extension for display if it's still there
		displayNameWithoutId = displayNameWithoutId.replace(/\.pdf$/i, '');
		// Replace underscores with spaces for better readability
		const displayName = displayNameWithoutId.replace(/_/g, ' ');

		// Step 3: Construct the (future) URL to your backend proxy endpoint
		// This URL will be used by the modal later.
		// For now, it's just for structure.
		const viewUrl = `/api/v1/files/view/${account_unique_id}/${encodeURIComponent(
			fileIdentifier
		)}`;

		return {
			displayName: displayName.trim() || fileIdentifier, // Fallback to fileIdentifier if displayName ends up empty
			fileIdentifier: fileIdentifier, // The actual filename.pdf
			viewUrl: viewUrl, // This will be used by the modal
		};
	});
});

const handleQuery = async () => {
	errorMessage.value = '';
	queryResponseText.value = null;
	queryResponseSourcesRaw.value = [];
	loading.value = true;

	try {
		const response = await fetch(
			`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/query-data/${account_unique_id}?query=${encodeURIComponent(
				question.value
			)}`,
			{
				method: 'GET',
				headers: {
					accept: 'application/json',
				},
			}
		);

		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}

		const data = await response.json();
		queryResponseText.value = data.response.response_text;
		console.log('Response Text:', queryResponseText.value);
		console.log('Sources:', data.response.sources);
		queryResponseSourcesRaw.value = data.response.sources || [];
		for (let source of data.response.sources) {
			console.log(source);
			const sourceFileName = source.split('/').pop();
			console.log(sourceFileName);
			console.log('API Response Sources:', data.response.sources);
			console.log(
				'Processed Sources for Display:',
				processedSources.value
			);
		}
		console.log('Response:', data);
	} catch (error) {
		console.error('Error:', error);
		errorMessage.value = 'Unable to query data. Please try again.';
	} finally {
		loading.value = false;
	}
};

// --- Methods for document viewing modal ---
const prepareToOpenDocument = (fileIdentifierFromSource: string) => {
	console.log('Opening document modal for file:', fileIdentifierFromSource);
	selectedFileToView.value = fileIdentifierFromSource; // This is the S3 filename
	isDocumentModalOpen.value = true; // This will show the modal
};

const closeDocumentModal = () => {
	console.log('Closing document modal');
	isDocumentModalOpen.value = false;
	selectedFileToView.value = null; // Clear selection when modal closes
};
// --- End Methods for document viewing modal ---
</script>
