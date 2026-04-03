<script setup lang="ts">
const { t } = useAppLocale()
</script>

<template>
  <footer class="border-t border-border/80 bg-white/80">
    <div class="container-shell py-5">
      <div
        class="flex flex-col items-center justify-center gap-2 text-center text-sm text-slate-500 sm:flex-row sm:gap-3"
      >
        <span class="font-medium text-slate-700">MovieHub</span>
        <span class="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
        <span>{{ t('footer.tagline') }}</span>
        <span class="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
        <span>{{ t('footer.copyright') }}</span>
      </div>
    </div>
  </footer>
</template>
