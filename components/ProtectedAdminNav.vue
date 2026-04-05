<script setup lang="ts">
import { ADMIN_NAVIGATION } from '~/constants/navigation'
import { canViewNavigationItem } from '~/utils/authz'

withDefaults(
  defineProps<{
    showTitle?: boolean
    showDivider?: boolean
  }>(),
  {
    showTitle: true,
    showDivider: true,
  },
)

const userStore = useUserStore()
const route = useRoute()
const { t } = useI18n()

const adminItems = computed(() => {
  if (
    !canViewNavigationItem(
      { key: 'admin', to: '/admin/movies', requiresAdmin: true },
      {
        isAuthenticated: userStore.isAuthenticated,
        role: userStore.profile?.role,
      },
    )
  ) {
    return []
  }

  return ADMIN_NAVIGATION.map((item) => ({
    ...item,
    label: t(`nav.${item.key}`),
    isActive: route.path === item.to || route.path.startsWith(`${item.to}/`),
  }))
})

const isAdminMenuActive = computed(() => {
  return adminItems.value.some((item) => item.isActive)
})

</script>

<template>
  <AuthUiGuard when="resolved">
    <div
      v-if="adminItems.length"
      class="min-w-[15rem]"
    >
      <div
        class="flex flex-col gap-2"
      >
        <div class="px-1">
          <p
            v-if="showTitle"
            class="text-center text-sm font-semibold"
            :class="isAdminMenuActive ? 'text-primary-700' : 'text-slate-700'"
          >
            {{ t('nav.admin') }}
          </p>
          <div
            v-if="showDivider"
            class="mt-2 h-px bg-border"
            aria-hidden="true"
          />
        </div>

        <div class="relative flex flex-wrap items-center gap-10 border-b border-border/80 pb-0">
          <NuxtLink
            v-for="item in adminItems"
            :key="item.to"
            :to="item.to"
            class="relative inline-flex items-center gap-2 pb-3 text-sm font-medium transition-colors"
            :class="
              item.isActive
                ? 'text-primary-700'
                : 'text-slate-600 hover:text-primary-600'
            "
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
              class="h-4 w-4 shrink-0"
            >
              <rect x="3" y="3" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5" />
              <rect x="12" y="3" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5" />
              <rect x="3" y="12" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5" />
              <rect x="12" y="12" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.5" />
            </svg>
            <span>{{ item.label }}</span>
            <span
              v-if="item.isActive"
              class="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary-500"
              aria-hidden="true"
            />
          </NuxtLink>
        </div>
      </div>
    </div>

    <template #fallback>
      <div
        class="min-w-[15rem]"
        aria-hidden="true"
      >
        <div class="px-1">
          <div
            v-if="showTitle"
            class="mx-auto h-4 w-16 animate-pulse rounded bg-slate-200"
          />
          <div
            v-if="showDivider"
            class="mt-2 h-px bg-slate-200"
          />
        </div>

        <div class="mt-2 border-b border-slate-200 pb-0">
          <div class="flex gap-10">
            <div class="h-6 w-28 animate-pulse rounded bg-slate-200" />
            <div class="h-6 w-32 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </div>
    </template>
  </AuthUiGuard>
</template>

