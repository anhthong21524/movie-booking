<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

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
        Something went wrong
      </p>
      <h1 class="mt-4 text-4xl font-bold">
        {{ error.statusCode || 500 }}
      </h1>
      <p class="mt-4 text-lg text-slate-600">
        {{ error.statusMessage || 'An unexpected application error occurred.' }}
      </p>
      <button class="btn-primary mt-8" @click="handleError">Return home</button>
    </div>
  </div>
</template>
