<script setup lang="ts">
import { MAIN_NAVIGATION } from '~/constants/navigation'
</script>

<template>
  <header class="border-b border-border/80 bg-white/80 backdrop-blur">
    <div class="container-shell flex h-18 items-center justify-between gap-6">
      <NuxtLink to="/" class="font-display text-xl font-bold text-slate-950">
        MovieHub
      </NuxtLink>

      <nav class="hidden items-center gap-6 md:flex">
        <NuxtLink
          v-for="item in MAIN_NAVIGATION"
          :key="item.to"
          :to="item.to"
          class="text-sm font-medium text-slate-600 hover:text-primary-600"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
