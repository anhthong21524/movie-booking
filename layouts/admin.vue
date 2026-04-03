<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <div
      class="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs font-semibold text-amber-700"
    >
      Admin
    </div>
    <main class="container-shell flex-1 py-8 sm:py-10">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
