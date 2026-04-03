<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

const { t } = useAppLocale()

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div
    class="container-shell flex min-h-screen items-center justify-center py-16"
  >
    <div class="card max-w-2xl p-10 text-center">
      <p
        class="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600"
      >
        {{ t('errors.genericTitle') }}
      </p>
      <h1 class="mt-4 text-4xl font-bold">
        {{ error.statusCode || 500 }}
      </h1>
      <p class="mt-4 text-lg text-slate-600">
        {{ error.statusMessage || t('errors.genericDescription') }}
      </p>
      <button class="btn-primary mt-8" @click="handleError">
        {{ t('errors.returnHome') }}
      </button>
    </div>
  </div>
</template>
