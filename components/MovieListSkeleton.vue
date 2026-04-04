<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 6,
  },
)
</script>

<template>
  <section
    class="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
    aria-busy="true"
    aria-live="polite"
  >
    <MovieCardSkeleton
      v-for="item in count"
      :key="item"
    />
  </section>
</template>
