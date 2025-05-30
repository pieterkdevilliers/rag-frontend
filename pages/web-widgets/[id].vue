<!-- In your Vue component template -->
<template>
  <div>
    <h3>Embed Chat Widget on Your Website</h3>
    <div v-if="widgetApiKey">
      <p>Copy and paste this snippet into your website's HTML, just before the closing body tag.</p>
      <pre><code>{{ generatedSnippet }}</code></pre>
      <button @click="copySnippet">Copy Snippet</button>
      <h4>Allowed Origins:</h4>
      <input type="text" v.model="originsInput" placeholder="e.g., https://your-site.com, http://localhost:3000">
      <button @click="updateAllowedOrigins">Save Origins</button>
    </div>
    <div v-else>
      <button @click="generateKey">Generate Widget API Key</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
// Assume you have a way to get the current user's unique_account_id
// const { $auth } = useNuxtApp(); // Example if using Nuxt Auth
// const unique_account_id = ref($auth.user.value?.account_id);

// For example purposes:
const unique_account_id = ref('user123_account_id'); // Replace with actual user account ID
const widgetApiKey = ref(null); // Will hold the generated API key
const widgetJsUrl = 'https://your-cdn.com/or/your-app-static-path/widget.js'; // URL where widget.js is hosted
const originsInput = ref('');


// Method to call your backend to generate/fetch API key
async function fetchOrGenerateKey() {
  // Replace with your actual API call
  // const response = await $fetch('/api/user/widget-key', { method: 'POST' or 'GET' });
  // widgetApiKey.value = response.apiKey;
  // originsInput.value = response.allowedOrigins.join(', ');
  // For demo:
  if (unique_account_id.value === 'user123_account_id') {
     widgetApiKey.value = 'dummy_widget_key_for_user123'; // This is what the user copies
     originsInput.value = 'https://user123s-website.com, http://localhost:3000';
  }
}

onMounted(fetchOrGenerateKey); // Fetch key when component mounts

const generateKey = async () => {
    // Call backend to generate a new key, then update widgetApiKey.value and originsInput.value
    console.log("Generating new key...");
    await fetchOrGenerateKey();
}

const updateAllowedOrigins = async () => {
    // Call backend to update allowed_origins for the current widgetApiKey.value
    // const newOrigins = originsInput.value.split(',').map(o => o.trim()).filter(Boolean);
    // await $fetch('/api/user/widget-key/origins', { method: 'PUT', body: { apiKey: widgetApiKey.value, origins: newOrigins } });
    console.log("Updating origins to:", originsInput.value);
}


const generatedSnippet = computed(() => {
  if (!widgetApiKey.value || !unique_account_id.value) return '<!-- API Key not generated yet -->';
  return `
<div id="my-ai-chat-widget"></div>
<script>
  window.aiChatWidgetConfig = {
    accountId: '${unique_account_id.value}',
    apiKey: '${widgetApiKey.value}',
    apiBaseUrl: '${window.location.origin}' // Or your fixed API base URL e.g. https://api.yourapp.com
  };
<\/script>
<script async defer src="${widgetJsUrl}"><\/script>
  `.trim();
});

const copySnippet = () => {
  navigator.clipboard.writeText(generatedSnippet.value)
    .then(() => alert('Snippet copied to clipboard!'))
    .catch(err => console.error('Failed to copy snippet: ', err));
};
</script>

<style scoped>
pre {
  background-color: #f4f4f4;
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
}
</style>