<script setup lang="ts">
definePageMeta({
  middleware: ['auth'],
})

const { t } = useI18n()
</script>

<template>
  <div class="space-y-8">
    <PageHero
      :title="t('ticketsPage.heroTitle')"
      :description="t('ticketsPage.heroDescription')"
    />
    <EmptyState
      :title="t('ticketsPage.emptyTitle')"
      :description="t('ticketsPage.emptyDescription')"
      :action-label="t('ticketsPage.action')"
      action-to="/movies"
    />
  </div>
</template>
