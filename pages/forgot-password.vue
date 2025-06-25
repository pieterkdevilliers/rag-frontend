<template>
	<div class="access-page password-reset-form">
		<div class="container--default">
			<div class="container__inner">
				<div class="text-block text-block--center text-block--wide">
					<h1 class="heading heading--h1">Forgot Your Password?</h1>
					<p>
						Enter your email address and we will send you a link to
						reset your password.
					</p>
					<div class="form-container border-box border-box--center">
						<div class="form-component">
							<form @submit.prevent="handleForgotPassword">
								<!-- We show the message once the request is complete (success or error) -->
								<div v-if="message" class="message">
									{{ message }}
								</div>
								<div class="form__label-fields">
									<div class="form__label-field">
										<label class="form__label" for="email"
											>Email Address</label
										>
										<UInput
											v-model="email"
											id="email"
											type="text"
											placeholder="Enter your email address"
											autocomplete="off"
											inputClass="form__label-field__input"
										/>
									</div>
									<div class="form__button-container">
										<UButton
											type="submit"
											icon="i-heroicons:link"
											label="Request Password Reset Link"
										>
										</UButton>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref } from 'vue';

const email = ref('');
const message = ref('');

async function handleForgotPassword() {
	message.value = ''; // Reset message on new submission

	try {
		const response = await fetch(
			`${config.public.apiBase}/forgot-password`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
				},

				body: JSON.stringify({ email: email.value }),
			}
		);

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.detail || 'An unknown error occurred.');
		}

		message.value = data.message;
	} catch (err) {
		console.error('Password reset request failed:', err);

		// IMPORTANT: To prevent user enumeration, show the same generic message
		message.value =
			'If an account with that email exists, a password reset link has been sent.';
	}
}
</script>
