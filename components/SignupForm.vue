<template>
	<div class="form-component signup-form">
		<h3 class="text-gradient">Create your account</h3>
		<form @submit.prevent="handleSignup">
			<div class="form__label-fields">
				<!-- Email Field Group -->
				<div class="form__label-field">
					<label class="form__label" for="email_address"
						>Email Address</label
					>
					<UInput
						v-model="email_address"
						id="email_address"
						type="email"
						placeholder="your@email.com"
						autocomplete="email"
						inputClass="form__label-field__input"
					/>
				</div>

				<!-- Password Field Group -->
				<div class="form__label-field">
					<label class="form__label" for="password">Password</label>
					<UInput
						v-model="password"
						id="password"
						type="password"
						placeholder="••••••••"
						autocomplete="new-password"
						inputClass="form__label-field__input"
					/>
				</div>

				<!-- Account Organisation Field Group -->
				<div class="form__label-field">
					<label class="form__label" for="account_organisation"
						>Organisation</label
					>
					<UInput
						v-model="account_organisation"
						id="account_organisation"
						type="text"
						placeholder="Your Company LLC"
						autocomplete="organization"
						inputClass="form__label-field__input"
					/>
				</div>

				<!-- Submit Button -->
				<div class="form__button-container single-button mt-4 md:mt-0">
					<UButton
						type="submit"
						label="Create Account"
						variant="solid"
						icon="i-heroicons:user-plus"
						class="form__button"
					>
					</UButton>
				</div>
			</div>
		</form>
		<p v-if="errorMessage" class="error-message">
			{{ errorMessage }}
		</p>
	</div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
import {
	getWelcomeEmailHtml,
	getNewAccountNotificationEmailHtml,
} from '~/utils/email-templates';
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
			`${config.public.apiBase}/accounts/${account_organisation.value}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
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
			`${config.public.apiBase}/first-user/${uniqueAccountId}`,
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

		// Call the function to get the HTML string. - New Account Welcome Email
		const emailHtmlContent = getWelcomeEmailHtml({
			organisationName: account_organisation.value,
		});

		const emailPayload = {
			to_email: email_address.value,
			subject: 'Welcome to YourDocsAI',
			message: emailHtmlContent,
			account_unique_id: authStore.uniqueAccountId,
		};

		const emailResponse = await fetch(
			`${config.public.apiBase}/send-email`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(emailPayload),
			}
		);

		// Decide how to handle email failure. This is a good pattern:
		// The user is still signed up, so we just log the error and continue.
		if (!emailResponse.ok) {
			console.error(
				'Welcome email failed to send, but signup was successful.'
			);
		} else {
			console.log('Welcome email sent successfully.');
		}

		// Call the function to get the HTML string. New Account Notification Email
		const emailNotificationHtmlContent = getNewAccountNotificationEmailHtml(
			{
				organisationName: account_organisation.value,
				newAccountEmail: email_address.value,
			}
		);

		const emailNotificationPayload = {
			to_email: 'pieter@hey.com',
			subject: 'New YourDocsAI Account Created',
			message: emailNotificationHtmlContent,
			account_unique_id: authStore.uniqueAccountId,
		};

		const emailNotificationResponse = await fetch(
			`${config.public.apiBase}/send-email`,
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(emailNotificationPayload),
			}
		);

		// Decide how to handle email failure. This is a good pattern:
		// The user is still signed up, so we just log the error and continue.
		if (!emailNotificationResponse.ok) {
			console.error(
				'Sign-up notification email failed to send, but signup was successful.'
			);
		} else {
			console.log('Sign-up notification email sent successfully.');
		}

		// --- 4. FINALLY, REDIRECT THE USER ---
		router.push('/login?redirect=/dashboards');
		console.log('Signup successful, redirecting to login page.');
	} catch (error: any) {
		console.error('Error during signup process:', error);
		errorMessage.value =
			error.message || 'Signup failed. Please try again.';
	}
};
</script>
