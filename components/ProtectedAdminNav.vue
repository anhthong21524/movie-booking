<script setup lang="ts">
import type { NavigationItem } from '~/constants/navigation'
import { canViewNavigationItem } from '~/utils/authz'

const props = defineProps<{
  items: NavigationItem[]
}>()

const userStore = useUserStore()
const { t } = useI18n()

const visibleItems = computed(() => {
  return props.items
    .filter((item) =>
      canViewNavigationItem(item, {
        isAuthenticated: userStore.isAuthenticated,
        role: userStore.profile?.role,
      }),
    )
    .map((item) => ({
      ...item,
      label: t(`nav.${item.key}`),
    }))
})

const placeholderCount = computed(() => {
  return props.items.filter((item) => item.requiresAuth || item.requiresAdmin).length
})
</script>

<template>
  <AuthUiGuard when="resolved">
    <template v-for="item in visibleItems" :key="item.to">
      <NuxtLink
        :to="item.to"
        class="text-sm font-medium text-slate-600 hover:text-primary-600"
      >
        {{ item.label }}
      </NuxtLink>
    </template>

    <template #fallback>
      <div
        v-for="index in placeholderCount"
        :key="index"
        class="h-4 w-24 animate-pulse rounded bg-slate-200"
        aria-hidden="true"
      />
    </template>
  </AuthUiGuard>
</template>

