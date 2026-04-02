<script setup lang="ts">
import { MAIN_NAVIGATION } from '~/constants/navigation'

const { locale, setLocale, t } = useI18n()

const navigation = computed(() =>
  MAIN_NAVIGATION.map((item) => ({
    ...item,
    label: t(`nav.${item.key}`),
  })),
)
</script>

<template>
  <header class="border-b border-border/80 bg-white/80 backdrop-blur">
    <div class="container-shell flex h-18 items-center justify-between gap-6">
      <NuxtLink to="/" class="font-display text-xl font-bold text-slate-950">
        MovieHub
      </NuxtLink>

      <div class="flex items-center gap-4">
        <nav class="hidden items-center gap-6 md:flex">
          <NuxtLink
            v-for="item in navigation"
            :key="item.to"
            :to="item.to"
            class="text-sm font-medium text-slate-600 hover:text-primary-600"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <div
          class="flex items-center rounded-full border border-border bg-white p-1"
        >
          <button
            class="rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            :class="
              locale === 'en'
                ? 'bg-primary-500 text-white'
                : 'text-slate-500 hover:text-slate-700'
            "
            @click="setLocale('en')"
          >
            EN
          </button>
          <button
            class="rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            :class="
              locale === 'vi'
                ? 'bg-primary-500 text-white'
                : 'text-slate-500 hover:text-slate-700'
            "
            @click="setLocale('vi')"
          >
            VI
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
