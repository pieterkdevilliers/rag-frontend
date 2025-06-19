<template>
	<div>
		<h2 class="text-2xl mb-6 text-center">Create your account</h2>
		<form @submit.prevent="handleSignup">
			<div class="flex flex-col md:flex-row md:items-end md:gap-4">
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
						>Account Organisation</label
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
				<div class="mt-4 md:mt-0">
					<UButton
						type="submit"
						label="Create Account"
						variant="solid"
						icon="i-heroicons:user-plus"
						class="form__button rounded-md"
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
import { error } from 'zod/v4/locales/ar.js';

const authStore = useAuthStore();
const router = useRouter();

const email_address = ref('');
const password = ref('');
const account_organisation = ref('');
const errorMessage = ref('');

const handleSignup = async () => {
	try {
		const formData = new URLSearchParams();
		formData.append('email_address', email_address.value);
		formData.append('password', password.value);
		formData.append('account_organisation', account_organisation.value);

		const account = await fetch(
			`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/accounts/${account_organisation.value}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					accept: 'application/json',
				},
				body: formData.toString(),
			}
		);
		console.log('Account creation response:', account);

		if (!account.ok) {
			throw new Error('Unable to create account');
		}

		const data = await account.json();
		console.log('Response:', data);
		const uniqueAccountId = data.account_unique_id;
		console.log('Unique Account ID:', uniqueAccountId);

		authStore.setUniqueAccountId(uniqueAccountId);

		const userPayload = {
			user_email: email_address.value,
			user_password: password.value,
		};

		console.log('User payload being sent:', JSON.stringify(userPayload));

		const user = await fetch(
			`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/first-user/${uniqueAccountId}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
				},
				body: JSON.stringify(userPayload),
			}
		);
		console.log('User creation response:', user);

		if (!user.ok) {
			const errorData = await user.json();
			console.error('User creation error:', errorData);
			throw new Error(errorData.detail || 'Failed to create user');
		}

		// Redirect to a secure route
		router.push('/login');
	} catch (error) {
		console.error('Error:', error);
		errorMessage.value = 'Login failed. Please check your credentials.';
	}

	const emailPayload = {
		to_email: email_address.value,
		subject: 'Welcome to Our Service',
		message: `Hello ${account_organisation.value},\n\nThank you for creating an account with us! We're excited to have you on board.\n\nBest regards,\nThe Team`,
		account_unique_id: authStore.uniqueAccountId,
	};

	const send_welcome_email = await fetch(
		`https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1/send-email`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				accept: 'application/json',
			},
			body: JSON.stringify(emailPayload),
		}
	);
};
</script>

<style scoped>
/* Add Tailwind CSS or custom styles here */
</style>
