<template>
	<!-- Increased max-width to accommodate horizontal fields, centered with mx-auto -->
	<div class="max-w-2xl lg:max-w-4xl p-4 mx-auto">
		<h2 class="text-2xl mb-6 text-center">Create your account</h2>
		<form @submit.prevent="handleSignup">
			<!-- This div will be the flex container for the fields and button -->
			<!-- It stacks vertically by default, and becomes a row on medium screens and up -->
			<div class="flex flex-col md:flex-row md:items-end md:gap-4">
				<!-- Email Field Group -->
				<div class="mb-4 md:mb-0 md:flex-1">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						for="email_address"
						>Email Address</label
					>
					<UInput
						v-model="email_address"
						id="email_address"
						type="email"
						placeholder="your@email.com"
						autocomplete="email"
						inputClass="w-full"
					/>
				</div>

				<!-- Password Field Group -->
				<div class="mb-4 md:mb-0 md:flex-1">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						for="password"
						>Password</label
					>
					<UInput
						v-model="password"
						id="password"
						type="password"
						placeholder="••••••••"
						autocomplete="new-password"
						inputClass="w-full"
					/>
				</div>

				<!-- Account Organisation Field Group -->
				<div class="mb-4 md:mb-0 md:flex-1">
					<label
						class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
						for="account_organisation"
						>Account Organisation</label
					>
					<UInput
						v-model="account_organisation"
						id="account_organisation"
						type="text"
						placeholder="Your Company LLC"
						autocomplete="organization"
						inputClass="w-full"
					/>
				</div>

				<!-- Submit Button -->
				<!-- md:self-end could also be used if items-end on parent is not desired for all items -->
				<!-- Added mt-4 for spacing when stacked, md:mt-0 to remove it when horizontal -->
				<div class="mt-4 md:mt-0">
					<UButton
						type="submit"
						label="Create Account"
						variant="solid"
						icon="i-heroicons:squares-plus"
						class="w-full md:w-auto"
					>
					</UButton>
				</div>
			</div>
		</form>
		<p v-if="errorMessage" class="text-red-600 mt-4 text-center">
			{{ errorMessage }}
		</p>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import { getWelcomeEmailHtml } from '~/utils/email-templates'; 
const authStore = useAuthStore();
const router = useRouter();

const email_address = ref('');
const password = ref('');
const account_organisation = ref('');
const errorMessage = ref('');

const handleSignup = async () => {
	try {
		// --- 1. CREATE ACCOUNT ---
		const formData = new URLSearchParams();
		formData.append('email_address', email_address.value);
		formData.append('password', password.value);
		formData.append('account_organisation', account_organisation.value);

		const account = await fetch(
			`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/accounts/${account_organisation.value}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body: formData.toString(),
			}
		);

		if (!account.ok) {
			const errorData = await account.json();
			throw new Error(errorData.detail || 'Unable to create account');
		}

		const data = await account.json();
		const uniqueAccountId = data.account_unique_id;
		authStore.setUniqueAccountId(uniqueAccountId);

		// --- 2. CREATE FIRST USER ---
		const userPayload = {
			user_email: email_address.value,
			user_password: password.value,
		};

		const user = await fetch(
			`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/first-user/${uniqueAccountId}`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userPayload),
			}
		);

		if (!user.ok) {
			const errorData = await user.json();
			throw new Error(errorData.detail || 'Failed to create user');
		}

		// Call the function to get the HTML string.
		const emailHtmlContent = getWelcomeEmailHtml({
			organisationName: account_organisation.value
		});

		const emailPayload = {
			to_email: email_address.value,
			subject: 'Welcome to YourDocsAI',
			message: emailHtmlContent, 
			account_unique_id: authStore.uniqueAccountId,
		};

		const emailResponse = await fetch(
			`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/send-email`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(emailPayload),
			}
		);

		// Decide how to handle email failure. This is a good pattern:
		// The user is still signed up, so we just log the error and continue.
		if (!emailResponse.ok) {
			console.error("Welcome email failed to send, but signup was successful.");
		} else {
			console.log("Welcome email sent successfully.");
		}


		// --- 4. FINALLY, REDIRECT THE USER ---
		router.push('/login');

	} catch (error: any) {
		console.error('Error during signup process:', error);
		errorMessage.value = error.message || 'Signup failed. Please try again.';
	}
};
</script>