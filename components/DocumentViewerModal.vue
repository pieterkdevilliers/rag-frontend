<template>
  <UModal :model-value="isOpen" @update:model-value="handleModalUpdate" :prevent-close="isLoading" :ui="{ width: 'sm:max-w-3xl md:max-w-4xl lg:max-w-5xl' }"> <!-- Added UI for wider modal -->
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

      <div class="p-1 min-h-[70vh] max-h-[80vh] overflow-y-auto"> <!-- Adjusted padding and height for iframe -->
        <div v-if="isLoading && !pdfUrl" class="flex justify-center items-center h-full py-10">
          <div>
            <svg class="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-2">Loading document...</p>
          </div>
        </div>
        <div v-else-if="errorLoadingDocument" class="text-red-500 p-4">
          <p>Error loading document: {{ errorLoadingDocument }}</p>
          <p class="text-sm mt-1">Please ensure the file exists and you have permission to view it. Try closing this viewer and trying again.</p>
        </div>
        <!-- IFRAME APPROACH -->
        <div v-else-if="pdfUrl" class="w-full h-[calc(70vh-2rem)]"> <!-- Adjust height as needed -->
          <iframe
            :src="pdfUrl"
            width="100%"
            height="100%"
            frameborder="0"
            title="PDF Viewer"
            allowfullscreen
          >
            Your browser does not support embedded PDFs. You can <a :href="pdfUrl" target="_blank" rel="noopener noreferrer">download the PDF</a> instead.
          </iframe>
        </div>
        <div v-else-if="!isLoading && !props.fileIdentifier" class="p-4">
             <p>No document selected.</p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton color="gray" variant="solid" @click="closeModal" :disabled="isLoading">
            Close
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref, watch, computed } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  fileIdentifier: string | null;
  accountUniqueId: string | null;
}>();

const emit = defineEmits(['update:isOpen', 'close']);

const isLoading = ref(false);
const errorLoadingDocument = ref<string | null>(null);
const pdfUrl = ref<string | null>(null); // Will store the URL for the iframe src

const displayFilename = computed(() => {
  if (!props.fileIdentifier) return '';
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

watch(() => props.isOpen, async (newVal) => { // Make the watch callback async
  if (newVal && props.fileIdentifier && props.accountUniqueId) {
    console.log(`Modal opening for file: ${props.fileIdentifier}, account: ${props.accountUniqueId}`);
    isLoading.value = true;
    errorLoadingDocument.value = null;
    pdfUrl.value = null; // Reset pdfUrl

    // Construct the URL to your backend proxy endpoint
    const constructedPdfUrl = `${config.public.apiBase}/files/view/${props.accountUniqueId}/${encodeURIComponent(props.fileIdentifier)}`;
    console.log('Constructed PDF URL for iframe/fetch:', constructedPdfUrl);


    try {
      // Optional: Perform a HEAD request to check validity before setting iframe src
      // This helps catch 404s or 403s early.
      const headResponse = await fetch(constructedPdfUrl, {
        method: 'HEAD',
      });

      if (!headResponse.ok) {
        let errorDetail = `Server responded with status: ${headResponse.status}`;
        if (headResponse.status === 404) {
            errorDetail = "Document not found (404).";
        } else if (headResponse.status === 403) {
            errorDetail = "Access denied (403). You may not have permission to view this document.";
        }
        throw new Error(errorDetail);
      }
      
      // If HEAD request is OK, set the pdfUrl for the iframe
      pdfUrl.value = constructedPdfUrl;

    } catch (error: any) {
      console.error('Error preparing PDF URL or pre-flight check:', error);
      errorLoadingDocument.value = error.message || 'Failed to load document information.';
      pdfUrl.value = null; // Ensure iframe doesn't try to load a bad URL
    } finally {
      isLoading.value = false;
    }

  } else if (!newVal) {
    // Modal is closing, reset state
    isLoading.value = false;
    errorLoadingDocument.value = null;
    pdfUrl.value = null;
  }
});

const closeModal = () => {
  emit('close');
};

const handleModalUpdate = (value: boolean) => {
  emit('update:isOpen', value);
  if (!value) {
    closeModal();
  }
};
</script>

<style scoped>
/* Ensures the iframe takes up the intended space */
.w-full.h-\[calc\(70vh-2rem\)\] iframe {
  display: block; /* Removes any extra space below the iframe */
}
</style>