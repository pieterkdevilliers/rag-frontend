<template>
	<div class="card-grid__card card text-left">
		<p class="text-gray-500 m-4">User Email: {{ user.user.user_email }}</p>
		<p class="text-gray-500 m-4">User ID: {{ user.user.id }}</p>
	</div>
</template>

<script setup lang="ts">
const { user } = defineProps<{
	user: {
		id: number;
		user_email: string;
	};
}>();
</script>

<style scoped></style>
