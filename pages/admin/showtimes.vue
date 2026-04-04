<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="space-y-8">
    <PageHero
      :title="t('adminShowtimesPage.heroTitle')"
      :description="t('adminShowtimesPage.heroDescription')"
    />
    <EmptyState
      :title="t('adminShowtimesPage.emptyTitle')"
      :description="t('adminShowtimesPage.emptyDescription')"
    />
  </div>
</template>
