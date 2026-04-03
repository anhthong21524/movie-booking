<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const { t } = useAppLocale()
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
