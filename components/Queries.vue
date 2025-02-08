<template>
  <div class="max-w-md mx-auto p-4">
      <form @submit.prevent="handleQuery">
          <h2 class="text-2xl font-bold mb-4">Ask me anything</h2>
          <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700" for="question">Question</label>
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
      <p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>

      <!-- Show loading state -->
      <p v-if="loading" class="text-gray-500 mt-4">Fetching response...</p>

      <!-- Show response -->
      <div v-if="queryResponseText" class="mt-4 p-4 border border-gray-300 rounded bg-gray-100">
          <h3 class="text-lg font-semibold mb-2">Response:</h3>
          <p>{{ queryResponseText }}</p>
          <h3 class="text-lg font-semibold mt-4 mb-2">Sources:</h3>
          <div v-for="source in queryResponseSources">
            <li>{{ source }}</li>
            <br>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const question = ref('');
const errorMessage = ref('');
const queryResponseText = ref<string | null>(null);
const queryResponseSources = ref([]);
const loading = ref(false);
const account_unique_id = authStore.uniqueAccountId;

const handleQuery = async () => {
  errorMessage.value = '';
  queryResponseText.value = null;
  queryResponseSources.value = [];
  loading.value = true;

  try {
      const response = await fetch(
          `https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/query-data/${account_unique_id}?query=${encodeURIComponent(question.value)}`,
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
      queryResponseSources.value = data.response.sources;
      for (let source of data.response.sources) {
        console.log(source);
        const sourceFileName = source.split('/').pop();
        console.log(sourceFileName);
      }
      console.log('Response:', data);

  } catch (error) {
      console.error('Error:', error);
      errorMessage.value = 'Unable to query data. Please try again.';
  } finally {
      loading.value = false;
  }
};
</script>