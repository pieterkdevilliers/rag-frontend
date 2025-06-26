<template>
	<UCard
		:ui="{
			ring: '',
			divide: 'divide-y divide-gray-100 dark:divide-gray-800',
		}"
	>
		<template #header>
			<div class="flex items-center justify-between">
				<h3 class="heading heading--h3">Embed Chat Widget</h3>
				<UButton
					color="gray"
					variant="ghost"
					icon="i-heroicons-x-mark-20-solid"
					class="-my-1"
					@click="handleClose"
				/>
			</div>
		</template>

		<div class="p-4">
			<p class="text-sm text-gray-600 dark:text-gray-300 mb-1">
				Copy the snippet below and paste it into your website's HTML,
				just before the closing body tag.
			</p>
			<p class="important">
				<strong>Important:</strong> You will need to replace
				'YOUR_WIDGET_API_KEY' in the snippet with the actual API Key you
				copied when this widget was created.
			</p>

			<div v-if="generatedSnippet" class="space-y-2">
				<pre
					class="mt-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-md overflow-x-auto"
				><code class="text-sm text-gray-700 dark:text-gray-200">{{ generatedSnippet }}</code></pre>
				<div class="text-right">
					<UButton
						icon="i-heroicons-clipboard-document"
						size="sm"
						@click="copySnippetToClipboard"
						label="Copy Snippet"
					/>
				</div>
			</div>
			<div
				v-else
				class="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-500 italic"
			>
				Loading snippet...
			</div>
		</div>

		<template #footer>
			<div class="text-right">
				<UButton
					@click="handleClose"
					label="Close"
					color="gray"
					variant="outline"
				/>
			</div>
		</template>
	</UCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, toRefs } from 'vue';

const props = defineProps({
	// isOpen: Boolean, // This will be controlled by v-model in the parent
	widget: {
		type: Object as () => {
			id: number;
			name: string;
			account_unique_id?: string /* other widget props */;
		}, // Add account_unique_id if passed
		required: true,
	},
});

const emit = defineEmits(['close']); // To signal parent to close the UModal

const { widget } = toRefs(props);
const toast = useToast();

// These are for generating the snippet structure
// The actual API key will be a placeholder the user needs to fill in.
const widgetJsUrl = ref(
	'https://d31env5c5sjhq3.cloudfront.net/static/widget.js'
); // TODO: Update this to your actual widget.js URL
const placeholderApiKey = 'YOUR_WIDGET_API_KEY'; // Placeholder

const accountIdToUse = computed(() => {
	return props.widget.account_unique_id || 'ACCOUNT_ID_MISSING_FROM_PROP';
});

const generatedSnippet = computed(() => {
	if (!accountIdToUse.value) {
		return '<!-- Account ID is missing. Cannot generate snippet. -->';
	}
	return `
<div id="my-ai-chat-widget-container"></div>
<script>
  window.myAIChatWidgetConfig = {
    accountId: '${accountIdToUse.value}',
    apiKey: '${placeholderApiKey}',

  };
<\/script>
<script async defer src="${widgetJsUrl.value}"><\/script>
  `.trim();
});

const copySnippetToClipboard = async () => {
	if (generatedSnippet.value) {
		try {
			await navigator.clipboard.writeText(generatedSnippet.value);
			toast.add({
				title: 'Copied!',
				description: 'Snippet copied to clipboard.',
				color: 'green',
			});
		} catch (err) {
			console.error('Failed to copy snippet: ', err);
			toast.add({
				title: 'Copy Failed',
				description: 'Could not copy snippet. Please copy it manually.',
				color: 'red',
			});
		}
	}
};

const handleClose = () => {
	emit('close');
};

// onMounted: You might not need to fetch anything here if all data (like account_unique_id)
// is passed via props or available from a store.
// The snippet generation is now mostly static with placeholders.
</script>

<style scoped>
pre {
	/* background-color: #f4f4f4; is handled by dark:bg-gray-800 etc. */
	/* padding: 1em; */ /* Handled by UCard/pre classes */
	border-radius: 0.375rem; /* Corresponds to rounded-md */
	/* overflow-x: auto; */ /* Handled by pre classes */
}
code {
	/* font-family: monospace; */ /* Already applied by .font-mono on parent if needed */
}
</style>
