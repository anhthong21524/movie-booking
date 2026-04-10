<script setup lang="ts">
defineProps<{
  message: string
}>()

const { t } = useI18n()
</script>

<template>
  <div
    v-if="message"
    class="rounded-[1.5rem] border border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-900"
    role="alert"
  >
    <p class="font-semibold">{{ t('overlapWarning.title') }}</p>
    <p class="mt-1 leading-6">{{ message }}</p>
  </div>
</template>
