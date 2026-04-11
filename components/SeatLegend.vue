<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 text-sm text-slate-600">
    <div class="flex items-center gap-2">
      <span class="h-3.5 w-3.5 rounded-full bg-white ring-1 ring-slate-300" />
      <span>{{ t('bookingPage.available') }}</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="h-3.5 w-3.5 rounded-full bg-primary-500" />
      <span>{{ t('bookingPage.selected') }}</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="h-3.5 w-3.5 rounded-full bg-slate-400" />
      <span>{{ t('bookingPage.booked') }}</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="h-3.5 w-3.5 rounded-full bg-amber-300" />
      <span>{{ t('bookingPage.unavailable') }}</span>
    </div>
  </div>
</template>
