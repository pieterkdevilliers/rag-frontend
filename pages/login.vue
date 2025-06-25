<template>
	<section class="access-page">
		<div class="container--default">
			<div class="container__inner">
				<div class="form-container border-box border-box--center">
					<LoginForm />
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

authStore.clearUniqueAccountId();
authStore.clearAuthToken();
</script>

<style scoped></style>
