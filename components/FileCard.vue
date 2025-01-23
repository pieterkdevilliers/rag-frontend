<template>
        <UCard>
            <p class="font-bold text-gray-500 m-4 truncate">{{ file.file_name }}</p>
            <p class="font-bold text-gray-500 m-4">ID: {{ file.id }}</p>
            <template #footer>
                <div class="flex gap-2">
                    <UButton 
                        icon="i-heroicons:pencil-square">
                    </UButton>
                    <UButton 
                        icon="i-heroicons:trash">
                    </UButton>
                </div>
            </template>
        </UCard>
</template>

<script setup lang="ts">
const { file } = defineProps<{
    file: {
        id: number;
        file_name: string;
    };
}>();

</script>

<style scoped>

</style>