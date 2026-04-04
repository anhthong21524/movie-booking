<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    loading?: boolean
    loadingLabel?: string
    disabled?: boolean
    block?: boolean
    variant?: 'primary' | 'secondary'
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    loading: false,
    loadingLabel: undefined,
    disabled: false,
    block: false,
    variant: 'primary',
    type: 'button',
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    class="relative min-h-[2.875rem]"
    :class="[
      variant === 'primary' ? 'btn-primary' : 'btn-secondary',
      block ? 'w-full' : '',
    ]"
  >
    <span :class="loading ? 'opacity-0' : 'opacity-100'">
      {{ label }}
    </span>
    <span
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center gap-2"
    >
      <span class="loading-spinner" aria-hidden="true" />
      <span>{{ loadingLabel || label }}</span>
    </span>
  </button>
</template>
