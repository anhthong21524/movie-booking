<script setup lang="ts">
import type { PasswordPolicyRuleVm } from '~/types/auth-validation'

defineProps<{
  title: string
  description: string
  rules: PasswordPolicyRuleVm[]
}>()
</script>

<template>
  <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <p class="text-sm font-semibold text-slate-900">{{ title }}</p>
    <p class="mt-1 text-sm leading-6 text-slate-600">{{ description }}</p>

    <ul class="mt-3 space-y-2 text-sm text-slate-700">
      <li
        v-for="rule in rules"
        :key="rule.id"
        class="flex items-start gap-2"
      >
        <span
          class="mt-1 inline-block h-2.5 w-2.5 rounded-full"
          :class="rule.valid ? 'bg-emerald-500' : 'bg-slate-300'"
          aria-hidden="true"
        />
        <span :class="rule.valid ? 'text-emerald-700' : 'text-slate-600'">
          {{ rule.label }}
        </span>
      </li>
    </ul>
  </div>
</template>
