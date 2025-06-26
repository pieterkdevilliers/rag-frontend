<template>
	<div>
		<h2 class="text-xl text-primary">Chat Sessions</h2>
	</div>
	<div>
		<div class="flex px-3 py-3.5">
			<UInput v-model="q" placeholder="Filter chat sessions..." />
		</div>
				<!-- Pagination Controls -->
		<div
			class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
		>
			<UPagination
				v-model="page"
				:page-count="pageCount"
				:total="filteredRows.length"
			/>
		</div>

		<UTable
			:rows="paginatedRows" 
			:columns="columns"
			:loading="!chatSessions"
			:loading-text="'Loading chat sessions...'"
			:sticky="true"
			class="chat-sessions__table"
		>
			<template #file_name-data="{ row }">
				<span>{{ row.file_name }}</span>
			</template>
			<template #start_time-data="{ row }">
				<span>{{ formatDateTime(row.start_time) }}</span>
			</template>

			<template #end_time-data="{ row }">
				<span>{{ formatDateTime(row.end_time) }}</span>
			</template>
			<template #view-data="{ row }">
				<UTooltip text="View Chat Session">
					<UButton
						variant="ghost"
						icon="i-heroicons-eye-20-solid"
						@click="openViewChatModal(row)"
					/>
				</UTooltip>
			</template>
		</UTable>

		<!-- Pagination Controls -->
		<div
			class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700"
		>
			<UPagination
				v-model="page"
				:page-count="pageCount"
				:total="filteredRows.length"
			/>
		</div>
	</div>

	<!-- View Chat Modal -->
	<UModal v-model="isViewChatModalOpen">
		<div class="p-5">
			<ViewChatModal
				@close="closeViewChatModal"
				v-if="selectedSessionId"
				:session-id="selectedSessionId"
			/>
		</div>
	</UModal>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { useAuthStore } from '~/stores/auth';
import { computed, ref, watch } from 'vue'; // [!code ++]
import { format, parseISO } from 'date-fns';

// Helper function
function formatDateTime(isoString: string | null | undefined): string {
	if (!isoString) return 'N/A';
	return format(parseISO(isoString), 'd MMMM yyyy - HH:mm');
}

definePageMeta({
	middleware: 'auth',
	layout: 'user-access',
});

// Interfaces
interface ChatSession {
	id: number;
	visitor_uuid: string;
	start_time: string;
	end_time: string;
	account_unique_id: string;
}

const toast = useToast();
const authStore = useAuthStore();
const selectedSessionId = ref<number | null>(null);
const isViewChatModalOpen = ref(false);
const account_unique_id = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

// Data Fetching (unchanged)
const { data: chatSessions, error } = await useFetch(
	`${config.public.apiBase}/chat-sessions/${account_unique_id}`,
	{
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${apiAuthorizationToken}`,
		},
		transform: (response: any): ChatSession[] => {
			return response?.chat_sessions || [];
		},
		default: () => [], // Provide a default empty array
	}
);

if (error.value) {
	console.error('Error fetching chat sessions:', error.value);
	toast.add({
		title: 'Error',
		description: `Could not fetch chat sessions: ${
			error.value.message || 'Unknown error'
		}`,
		color: 'red',
	});
}

// Columns (unchanged)
const columns = [
	{ key: 'id', label: 'ID' },
	{ key: 'visitor_uuid', label: 'Visitor ID' },
	{ key: 'start_time', label: 'Start Time' },
	{ key: 'end_time', label: 'End Time' },
	{ key: 'view', label: 'View Chat' },
];

// --- Pagination and Filtering Logic ---

// [!code-start++]
// 1. State for pagination
const page = ref(1);
const pageCount = 10; // Number of items per page
// [!code-end++]

// State for filtering
const q = ref('');

// Filtered rows (unchanged, but now feeds into pagination)
const filteredRows = computed(() => {
	if (!chatSessions.value) return [];
	if (!q.value) {
		return chatSessions.value;
	}
	return chatSessions.value.filter((session) => {
		return Object.values(session).some((value) => {
			return String(value).toLowerCase().includes(q.value.toLowerCase());
		});
	});
});

// [!code-start++]
// 2. Reset page to 1 when filter changes
watch(q, () => {
	page.value = 1;
});

// 3. New computed property to get the rows for the current page
const paginatedRows = computed(() => {
	const startIndex = (page.value - 1) * pageCount;
	const endIndex = startIndex + pageCount;
	return filteredRows.value.slice(startIndex, endIndex);
});
// [!code-end++]


// --- Modal and Actions Logic (unchanged) ---
const openViewChatModal = (row: ChatSession) => {
	selectedSessionId.value = row.id;
	isViewChatModalOpen.value = true;
};
const closeViewChatModal = () => {
	isViewChatModalOpen.value = false;
	selectedSessionId.value = null;
};
</script>