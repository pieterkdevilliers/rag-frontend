<template>
	<div>
		<h3 class="heading heading--h3">
			Chat Transcript for Session
			<span class="text-accent">#{{ sessionId }}</span>
		</h3>

		<!-- 1. Handle Loading State -->
		<div
			v-if="status === 'pending'"
			class="flex items-center justify-center py-8"
		>
			<UIcon
				name="i-heroicons-arrow-path-20-solid"
				class="animate-spin"
			/>
			<span class="ml-2">Loading messages...</span>
		</div>

		<!-- 2. Handle Error State -->
		<div v-else-if="error" class="py-8 text-center text-red-500">
			<p>Could not load chat transcript.</p>
			<p class="text-sm text-gray-500">{{ error.message }}</p>
		</div>

		<!-- 3. Display Messages on Success -->
		<div
			v-else-if="data && data.length > 0"
			class="chat-container mt-4 space-y-4 max-h-[60vh] overflow-y-auto p-1"
		>
			<!-- Loop over each message in the 'data' array -->
			<div v-for="message in data" :key="message.message_id">
				<div
					:class="message.sender_type"
					class="chat-item flex items-start gap-2.5"
				>
					<!-- Differentiate user and bot with an icon -->
					<UIcon
						:name="
							message.sender_type === 'user'
								? 'i-heroicons-user-circle'
								: 'i-heroicons-cpu-chip'
						"
						class="chat-item__icon"
					/>
					<div
						class="chat-item__container flex flex-col w-full max-w-[320px] leading-1.5 p-3 border-gray-200 bg-gray-100 dark:bg-gray-700 rounded-e-xl rounded-es-xl"
					>
						<div
							class="flex items-center space-x-2 rtl:space-x-reverse"
						>
							<!-- Capitalize the sender type (e.g., 'user' -> 'User') -->
							<span class="chat-item__sender">
								{{
									message.sender_type
										.charAt(0)
										.toUpperCase() +
									message.sender_type.slice(1)
								}}
							</span>
							<!-- Format the timestamp for readability -->
							<span
								class="text-xs font-normal text-gray-500 dark:text-gray-400"
							>
								{{
									new Date(
										message.timestamp
									).toLocaleTimeString()
								}}
							</span>
						</div>
						<!-- The actual message text -->
						<p class="chat-item__message">
							{{ message.message_text }}
							{{ message.sources }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Handle case with no messages -->
		<div v-else class="py-8 text-center text-gray-500">
			<p>No messages found for this session.</p>
		</div>

		<!-- 4. Close Button -->
		<div
			class="flex justify-end pt-4 mt-4 border-t border-gray-200 dark:border-gray-700"
		>
			<UButton color="gray" variant="ghost" @click="emit('close')"
				>Close</UButton
			>
		</div>
	</div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
interface ChatMessage {
	message_id: string;
	sender_type: 'user' | 'bot';
	message_text: string;
	timestamp: string;
	chat_session_id: number;
	sources: string[];
}

const props = defineProps({
	sessionId: {
		type: Number,
		required: true,
	},
});

const emit = defineEmits(['close']);
import { defineProps } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const account_unique_id = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const { data, status, error } = await useFetch(
	`${config.public.apiBase}/chat-messages/${account_unique_id}/${props.sessionId}`,
	{
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${apiAuthorizationToken}`,
		},
		transform: (response: any): ChatMessage[] => {
			return response?.chat_messages || [];
		},
	}
);
console.log('Response: ', data)
if (error.value) {
	console.error('Error fetching chat messages:', error.value);
}
</script>
