<script setup lang="ts">
const { locale } = useAppLocale()

useHead({
  htmlAttrs: {
    lang: locale,
  },
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <NuxtLoadingIndicator color="var(--color-primary-500)" :height="3" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
