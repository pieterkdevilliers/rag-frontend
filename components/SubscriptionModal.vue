<template>
  <!-- The v-model on UModal will automatically work with our computed property -->
  <UModal v-model="isOpen">
    <div class="p-4">
      <h2 class="text-lg font-bold">Subscribe to a Plan</h2>
      <p>Modal content goes here...</p>
      
      <!-- Example: A button inside the modal to close it -->
      <UButton label="Cancel" @click="isOpen = false" class="mt-4" />
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 1. Define Props: Accept 'modelValue' which is what v-model provides.
const props = defineProps<{
  modelValue: boolean;
}>();

// 2. Define Emits: Declare the event v-model listens for.
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

// 3. Create a computed property to sync the prop with the internal state.
// This is the standard pattern for using v-model on a child component.
const isOpen = computed({
  // 'get' is called when the value is read. It returns the prop's value.
  get() {
    return props.modelValue;
  },
  // 'set' is called when the value is changed (e.g., UModal closes itself).
  // It emits the 'update:modelValue' event, which updates the parent's ref.
  set(value: boolean) {
    emit('update:modelValue', value);
  },
});
</script>