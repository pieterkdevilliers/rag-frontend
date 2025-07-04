<template>
	<div class="access-page password-reset-form">
		<div class="container--default">
			<div class="container__inner">
				<div class="text-block text-block--center text-block--wide">
					<h1 class="heading heading--h1">Reset Your Password</h1>
					<!-- This block shows while validating or if validation fails -->
					<div
						v-if="!isTokenValid"
						class="form-container border-box border-box--center flex-col max-w-md mx-auto"
					>
						<p class="error">{{ validationMessage }}</p>
						<UButton
							v-if="!isValidating"
							to="/forgot-password"
							class="text-center justify-center"
							>Request a new link</UButton
						>
					</div>

					<!-- This form is shown only after the token is successfully validated -->

					<form v-else @submit.prevent="handleResetPassword">
						<div v-if="message" class="message">{{ message }}</div>
						<div v-if="error" class="error">{{ error }}</div>
						<div class="form__label-fields">
							<div class="form__label-field">
								<label class="form__label" for="password"
									>New Password</label
								>
								<UInput
									v-model="password"
									id="password"
									type="password"
									placeholder="Enter your new password"
									autocomplete="off"
								/>
							</div>
							<div class="form__label-field">
								<label class="form__label" for="password"
									>Confirm New Password</label
								>
								<UInput
									v-model="confirmPassword"
									id="password"
									type="password"
									placeholder="Confirm your new password"
									autocomplete="off"
								/>
							</div>

							<div class="form__button-container">
								<UButton
									type="submit"
									icon="i-heroicons:arrow-path"
									label="Reset Password"
								>
								</UButton>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref, onMounted } from 'vue';

const route = useRoute();
const router = useRouter();

// --- State Management ---
const token = route.query.token;
const password = ref('');
const confirmPassword = ref('');

// State for the initial token validation check
const isValidating = ref(true);
const isTokenValid = ref(false);
const validationMessage = ref('Validating your link...');

// State for the form submission process
const isSubmitting = ref(false);
const message = ref('');
const error = ref('');

// --- Hooks and Methods ---

onMounted(async () => {
	if (!token) {
		isValidating.value = false;
		validationMessage.value =
			'No reset token found. The link may be incorrect.';
		return;
	}

	// Validate the token on page load
	try {
		const response = await fetch(
			`${config.public.apiBase}/validate-token`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
				},
				body: JSON.stringify({ token: token }),
			}
		);

		if (!response.ok) {
			// If server returns an error (e.g., 400), throw to enter the catch block
			throw new Error('Invalid or expired token');
		}

		// If we reach here, the token is valid
		isTokenValid.value = true;
	} catch (err) {
		console.error('Token validation failed:', err);
		validationMessage.value =
			'This password reset link is invalid or has expired.';
	} finally {
		isValidating.value = false;
	}
});

async function handleResetPassword() {
	// Clear previous messages
	error.value = '';
	message.value = '';

	if (password.value !== confirmPassword.value) {
		error.value = 'Passwords do not match.';
		return;
	}

	isSubmitting.value = true;

	try {
		const response = await fetch(
			`${config.public.apiBase}/reset-password`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
				},
				body: JSON.stringify({
					token: token,
					new_password: password.value,
				}),
			}
		);

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.detail || 'An unexpected error occurred.');
		}

		message.value =
			data.message + ' You will be redirected to the login page shortly.';

		// Redirect to login page after a short delay for the user to read the message
		setTimeout(() => {
			router.push('/login');
		}, 4000);
	} catch (err) {
		console.error('Password reset failed:', err);
		error.value = err.message;
	} finally {
		isSubmitting.value = false;
	}
}
</script>

<style scoped>
.message {
	color: green;
	margin-bottom: 1rem;
}
.error {
	color: red;
	margin-bottom: 1rem;
}
.input-group {
	margin-bottom: 1rem;
}
</style>
