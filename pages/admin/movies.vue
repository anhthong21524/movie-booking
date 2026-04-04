<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="space-y-8">
    <PageHero
      :title="t('adminMoviesPage.heroTitle')"
      :description="t('adminMoviesPage.heroDescription')"
    />
    <EmptyState
      :title="t('adminMoviesPage.emptyTitle')"
      :description="t('adminMoviesPage.emptyDescription')"
    />
  </div>
</template>
