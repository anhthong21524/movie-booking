<script setup lang="ts">
import { LOGIN_PATH, REDIRECT_QUERY_KEY } from '~/constants/auth'
import { sanitizeRedirectTarget } from '~/utils/auth-routing'

const route = useRoute()
const userStore = useUserStore()
const { locale } = useI18n()

const copy = computed(() => {
  if (locale.value === 'vi') {
    return {
      expiredTitle: 'Phien dang nhap da het han',
      expiredDescription:
        'Vui long dang nhap lai de tiep tuc thao tac cua ban.',
      login: 'Dang nhap lai',
    }
  }

  return {
    expiredTitle: 'Your session expired',
    expiredDescription: 'Sign in again to continue where you left off.',
    login: 'Sign in again',
  }
})

const reloginLink = computed(() => {
  return {
    path: LOGIN_PATH,
    query: {
      [REDIRECT_QUERY_KEY]: sanitizeRedirectTarget(route.fullPath),
    },
  }
})
</script>

<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="-translate-y-2 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="-translate-y-2 opacity-0"
  >
    <div
      v-if="userStore.status === 'expired'"
      class="border-b border-amber-200 bg-amber-50/95 backdrop-blur"
    >
      <div
        class="container-shell flex flex-col gap-3 py-3 text-sm text-amber-900 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <p class="font-semibold">{{ copy.expiredTitle }}</p>
          <p class="text-amber-800/90">{{ copy.expiredDescription }}</p>
        </div>

        <NuxtLink
          :to="reloginLink"
          class="btn-secondary border-amber-300 bg-white"
        >
          {{ copy.login }}
        </NuxtLink>
      </div>
    </div>
  </transition>
</template>
