<script setup lang="ts">
const { locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: locale,
  },
})
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <GlobalLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
