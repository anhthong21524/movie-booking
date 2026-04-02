<template>
  <div class="flex min-h-screen flex-col">
    <AppHeader />
    <main class="container-shell flex-1 py-8 sm:py-10">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
