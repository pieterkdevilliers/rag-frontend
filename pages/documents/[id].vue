<template>
    <div>
        <h2>This is the individual document page for document {{ id }}</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe deserunt amet repellat dignissimos sit eum quos ab, quas soluta accusamus!</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe deserunt amet repellat dignissimos sit eum quos ab, quas soluta accusamus!</p>
    </div>
</template>

<script setup lang="ts">
    const { id } = useRoute().params;

</script>

<style scoped>
    h2 {
        color: blue;
        margin-bottom: 20px;
        font-size: 36px;
    }
    p {
        color: green;
        margin: 20px 0;
    }

</style>