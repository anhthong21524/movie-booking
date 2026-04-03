<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()

const { t } = useAppLocale()
</script>

<template>
  <section
    class="relative overflow-hidden rounded-[2rem] border border-primary-100 bg-white px-6 py-12 shadow-soft sm:px-10"
  >
    <div
      class="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-primary-50 to-transparent"
    />
    <div class="relative max-w-4xl">
      <p
        class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600"
      >
        {{ t('common.platformBadge') }}
      </p>
      <h1 class="section-heading mt-4">{{ title }}</h1>
      <p class="mt-4 max-w-3xl text-lg text-slate-600">
        {{ description }}
      </p>
    </div>
  </section>
</template>
