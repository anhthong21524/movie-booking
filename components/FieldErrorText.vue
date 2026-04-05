<script setup lang="ts">
defineProps<{
  id: string
  message?: string
}>()
</script>

<template>
  <p
    v-if="message"
    :id="id"
    class="text-sm leading-6 text-rose-700"
    role="alert"
  >
    {{ message }}
  </p>
</template>
