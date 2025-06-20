<template>
  <div>
    <h1 class="text-xl text-primary">Chat Sessions</h1>
  </div>
  <div>
    <div class="flex px-3 py-3.5">
      <UInput v-model="q" placeholder="Filter chat sessions..." />
    </div>

    <UTable :rows="filteredRows" :columns="columns" :loading="chatSessionsResponse" :loading-text="'Loading chat sessions...'" class="w-full">
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
  import { computed, ref } from 'vue';

  import { format, parseISO } from 'date-fns';

// Create a helper function for reusability
function formatDateTime(isoString: string | null | undefined): string {
  // Return a placeholder if the date is null or invalid
  if (!isoString) {
    return 'N/A';
  }
  // parseISO converts the string to a Date object
  // format then applies your desired output format
  return format(parseISO(isoString), "d MMMM yyyy - HH:mm");
}

  definePageMeta({
    middleware: 'auth',
    layout: 'user-access',
  });

  // Interface for a single chat session object
  interface ChatSession {
      id: number;
      visitor_uuid: string; // The API uses snake_case
      start_time: string;
      end_time: string;
      account_unique_id: string;
  }
  
  // Interface for the full API response object
  interface ChatSessionApiResponse {
      response: string;
      chat_sessions: ChatSession[];
  }

  const toast = useToast();
  const authStore = useAuthStore();
  const selectedSessionId = ref<number | null>(null);
  const isViewChatModalOpen = ref(false);
  
  const account_unique_id = authStore.uniqueAccountId;
  const apiAuthorizationToken = authStore.access_token;
  
  // We use `transform` to pluck the `chat_sessions` array from the response object.
  const { data: chatSessions, error } = await useFetch(
    `${config.public.apiBase}/chat-sessions/${account_unique_id}`, {
      method: 'GET',
      headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${apiAuthorizationToken}`,
      },
      // If the response is valid, return response.chat_sessions.
      // Otherwise, return an empty array to prevent errors.
      transform: (response): ChatSession[] => {
          return response?.chat_sessions || [];
      }
  });

  // `chatSessions.value` is now the clean array, thanks to the transform!

  if (error.value) {
    console.error('Error fetching chat sessions:', error.value);
    toast.add({ title: 'Error', description: `Could not fetch chat sessions: ${error.value.message || 'Unknown error'}`, color: 'red' });
  }

  const columns = [{
      key: 'id',
      label: 'ID'
    }, {
      key: 'visitor_uuid', // Match the key from your API data
      label: 'Visitor ID'
    }, {
      key: 'start_time',
      label: 'Start Time'
    }, {
      key: 'end_time',
      label: 'End Time'
    }, {
      key: 'view',
      label: 'View Chat',
  }];

  const q = ref('');

  const filteredRows = computed(() => {
    // chatSessions.value is now guaranteed to be an array.
    if (!q.value) {
      return chatSessions.value;
    }

    return chatSessions.value.filter((session) => {
      return Object.values(session).some((value) => {
        return String(value).toLowerCase().includes(q.value.toLowerCase());
      });
    });
  });

  // --- Modal and Actions Logic (unchanged and should now work) ---
  const openViewChatModal = (row: ChatSession) => {
    selectedSessionId.value = row.id; 
    isViewChatModalOpen.value = true;
  };
  const closeViewChatModal = () => {
    isViewChatModalOpen.value = false;
    selectedSessionId.value = null; 
  };
</script>