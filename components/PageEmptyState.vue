<script setup lang="ts">
defineProps<{
  title: string
  description: string
  icon?: string
  actionLabel?: string
  actionTo?: string
}>()
</script>

<template>
  <EmptyState
    variant="page"
    :title="title"
    :description="description"
    :icon="icon"
    :action-label="actionLabel"
    :action-to="actionTo"
  />
</template>
