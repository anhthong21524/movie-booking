<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description: string
    actionLabel?: string
    actionTo?: string
  }>(),
  {
    actionLabel: undefined,
    actionTo: undefined,
  },
)
</script>

<template>
  <div class="card p-8 text-center">
    <div
      class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50"
    >
      <span class="text-2xl text-primary-500">○</span>
    </div>
    <h2 class="text-2xl font-bold">{{ title }}</h2>
    <p class="mx-auto mt-3 max-w-xl text-slate-600">
      {{ description }}
    </p>
    <NuxtLink
      v-if="actionLabel && actionTo"
      :to="actionTo"
      class="btn-primary mt-6"
    >
      {{ actionLabel }}
    </NuxtLink>
  </div>
</template>
