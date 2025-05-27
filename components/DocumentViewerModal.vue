<template>
  <UModal :model-value="isOpen" @update:model-value="handleModalUpdate" :prevent-close="isLoading">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Document Viewer
            <span v-if="fileIdentifier" class="text-sm text-gray-500 ml-2">- {{ displayFilename }}</span>
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="closeModal"
            :disabled="isLoading"
          />
        </div>
      </template>

      <!-- Placeholder content for now -->
      <div class="p-4 min-h-[200px]"> <!-- min-h to give it some size -->
        <div v-if="isLoading" class="text-center py-10">
          <p>Loading document...</p>
          <!-- You can add a UProgress or USkeleton here later -->
        </div>
        <div v-else-if="errorLoadingDocument" class="text-red-500">
          <p>Error loading document: {{ errorLoadingDocument }}</p>
        </div>
        <div v-else>
          <p>Modal is open for file: <strong>{{ displayFilename || 'No file selected' }}</strong></p>
          <p class="mt-4">Document content will be displayed here.</p>
          <!-- This is where the iframe or PDF.js canvas will go later -->
        </div>
      </div>

      <template #footer v-if="!isLoading && !errorLoadingDocument">
        <div class="flex justify-end">
          <UButton color="gray" variant="solid" @click="closeModal">
            Close
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  fileIdentifier: string | null; // The S3 filename, e.g., original_name_randomid.pdf
  accountUniqueId: string | null; // Needed to construct the view URL
}>();

const emit = defineEmits(['update:isOpen', 'close']);

const isLoading = ref(false); // For loading the document content
const errorLoadingDocument = ref<string | null>(null);
// const documentUrl = ref<string | null>(null); // We'll use this later for the iframe src

// Computed property for a slightly cleaner display name in the modal header
const displayFilename = computed(() => {
  if (!props.fileIdentifier) return '';
  // Simple removal of a potential ID and .pdf for display in header
  const lastUnderscoreIndex = props.fileIdentifier.lastIndexOf('_');
  let name = props.fileIdentifier;
  if (lastUnderscoreIndex !== -1) {
    const potentialIdPart = props.fileIdentifier.substring(lastUnderscoreIndex + 1);
    if (/^[a-f0-9]+\.pdf$/i.test(potentialIdPart)) {
      name = props.fileIdentifier.substring(0, lastUnderscoreIndex);
    }
  }
  return name.replace(/\.pdf$/i, '').replace(/_/g, ' ');
});


watch(() => props.isOpen, (newVal) => {
  if (newVal && props.fileIdentifier && props.accountUniqueId) {
    // Modal is opening with a file selected, let's "pretend" to load for now
    console.log(`Modal opened for file: ${props.fileIdentifier}, account: ${props.accountUniqueId}`);
    isLoading.value = true;
    errorLoadingDocument.value = null;
    // documentUrl.value = null; // Reset

    // Simulate a delay for fetching the document (we'll replace this with actual fetch later)
    setTimeout(() => {
      // In a real scenario, here you would construct documentUrl and fetch.
      // For now, just stop loading.
      // documentUrl.value = `/api/v1/documents/view/${props.accountUniqueId}/${encodeURIComponent(props.fileIdentifier!)}`;
      // console.log('Document URL would be:', documentUrl.value);
      isLoading.value = false;
    }, 1500); // Simulate 1.5 second load time

  } else if (!newVal) {
    // Modal is closing, reset state
    isLoading.value = false;
    errorLoadingDocument.value = null;
    // documentUrl.value = null;
  }
});

const closeModal = () => {
  emit('close'); // Emit 'close' to parent
};

// Handles v-model updates from UModal
const handleModalUpdate = (value: boolean) => {
  emit('update:isOpen', value);
  if (!value) {
    closeModal(); // Ensure our close logic runs if UModal closes itself
  }
};
</script>

<style scoped>
/* You can add specific styles for the modal if needed */
</style>