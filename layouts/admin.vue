<script setup lang="ts">
import { MAIN_NAVIGATION } from '~/constants/navigation'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <AuthStatusBanner />
    <div class="hidden md:block">
      <div class="container-shell flex items-start pb-5 pt-3">
        <ProtectedAdminNav
          :items="MAIN_NAVIGATION"
          :show-title="false"
          :show-divider="false"
        />
      </div>
    </div>
    <main class="container-shell flex-1 pb-8 pt-2 sm:pb-10 sm:pt-4">
      <div class="md:hidden">
        <ProtectedAdminNav
          :items="MAIN_NAVIGATION"
          :show-title="false"
          :show-divider="false"
        />
      </div>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
