<template>
    <div class="grid grid-cols-2">
        <div>
            <h2>Create an account</h2>
            <SignupForm />
        </div>
        <div>
            <p>Already have an account?</p>
            <UButton
                icon="i-heroicons:arrow-right-end-on-rectangle"
                to="/login"
                label="Access Account">
             </UButton>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>