<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    description: string
    icon?: string
    actionLabel?: string
    actionTo?: string
    variant?: 'page' | 'section'
  }>(),
  {
    icon: '○',
    actionLabel: undefined,
    actionTo: undefined,
    variant: 'page',
  },
)
</script>

<template>
  <div
    class="rounded-[2rem] border border-border bg-white text-center shadow-sm"
    :class="variant === 'page' ? 'card p-8 sm:p-10' : 'p-6 sm:p-8'"
  >
    <div
      class="mx-auto flex items-center justify-center rounded-full bg-primary-50"
      :class="variant === 'page' ? 'mb-5 h-16 w-16' : 'mb-4 h-14 w-14'"
      aria-hidden="true"
    >
      <span
        class="font-semibold text-primary-500"
        :class="variant === 'page' ? 'text-2xl' : 'text-xl'"
      >
        {{ icon }}
      </span>
    </div>

    <h2
      class="font-bold text-slate-950"
      :class="variant === 'page' ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'"
    >
      {{ title }}
    </h2>

    <p
      class="mx-auto mt-3 max-w-xl text-slate-600"
      :class="variant === 'page' ? 'text-base leading-7' : 'text-sm leading-6 sm:text-base'"
    >
      {{ description }}
    </p>

    <NuxtLink
      v-if="actionLabel && actionTo"
      :to="actionTo"
      class="btn-primary mt-6"
    >
      {{ actionLabel }}
    </NuxtLink>
  </div>
</template>
