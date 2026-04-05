<script setup lang="ts">
import { useBookingStore } from '~/stores/booking'

definePageMeta({ middleware: 'auth' })

const userStore = useUserStore()
const bookingStore = useBookingStore()
const { locale } = useI18n()

const profile = computed(() => userStore.profile)

const initials = computed(() => {
  const name = profile.value?.name ?? ''
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
})

const confirmedCount = computed(
  () => bookingStore.bookingHistory.filter((b) => b.status === 'CONFIRMED').length,
)
const cancelledCount = computed(
  () => bookingStore.bookingHistory.filter((b) => b.status === 'CANCELLED').length,
)
const totalSpend = computed(() =>
  bookingStore.bookingHistory
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + (b.totalAmount ?? 0), 0),
)

const totalSpendLabel = computed(() =>
  new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'USD' }).format(totalSpend.value),
)

</script>

<template>
  <div class="space-y-8">
    <PageHero
      title="My Profile"
      description="Manage your account details and view your booking activity."
    />

    <div class="grid gap-6 lg:grid-cols-[20rem_1fr]">
      <!-- Left: identity card -->
      <div class="space-y-4">
        <div class="card p-6">
          <!-- Avatar -->
          <div class="flex flex-col items-center text-center">
            <div
              class="flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white shadow-soft"
              :class="userStore.isAdmin ? 'bg-primary-600' : 'bg-primary-500'"
            >
              {{ initials || '?' }}
            </div>

            <h2 class="mt-4 text-xl font-bold text-slate-950">
              {{ profile?.name || '—' }}
            </h2>
            <p class="mt-0.5 text-sm text-slate-500">{{ profile?.email || '—' }}</p>

            <span
              class="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              :class="userStore.isAdmin
                ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200'
                : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'"
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="userStore.isAdmin ? 'bg-primary-500' : 'bg-slate-400'"
              />
              {{ userStore.isAdmin ? 'Administrator' : 'Member' }}
            </span>
          </div>

        </div>

        <!-- Quick links -->
        <div class="card p-5">
          <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Quick links</p>
          <div class="mt-3 space-y-1">
            <NuxtLink
              to="/tickets"
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary-600"
            >
              <svg class="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 12.5C2 8.91 4.91 6 8.5 6H18l3 3-3 3H8.5C4.91 12 2 9.09 2 5.5" />
                <path d="M18 12v7a2 2 0 01-2 2H8a2 2 0 01-2-2v-7" />
              </svg>
              My tickets
            </NuxtLink>
            <NuxtLink
              v-if="userStore.isAdmin"
              to="/admin/movies"
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary-600"
            >
              <svg class="h-4 w-4 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              Admin panel
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Right: activity -->
      <div class="space-y-6">
        <!-- Booking stats -->
        <div>
          <h3 class="mb-4 text-lg font-bold text-slate-950">Booking activity</h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="card p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Total</p>
              <p class="mt-2 text-3xl font-bold text-slate-950">
                {{ bookingStore.bookingHistory.length }}
              </p>
              <p class="mt-1 text-xs text-slate-500">bookings made</p>
            </div>

            <div class="card p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600">Confirmed</p>
              <p class="mt-2 text-3xl font-bold text-slate-950">{{ confirmedCount }}</p>
              <p class="mt-1 text-xs text-slate-500">seats reserved</p>
            </div>

            <div class="card p-5">
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Cancelled</p>
              <p class="mt-2 text-3xl font-bold text-slate-950">{{ cancelledCount }}</p>
              <p class="mt-1 text-xs text-slate-500">bookings cancelled</p>
            </div>
          </div>
        </div>

        <!-- Total spend -->
        <div class="card p-6">
          <div class="flex items-center gap-4">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
              <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
              </svg>
            </span>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Total spent</p>
              <p class="mt-1 text-2xl font-bold text-slate-950">{{ totalSpendLabel }}</p>
              <p class="mt-0.5 text-xs text-slate-500">across all confirmed bookings</p>
            </div>
          </div>
        </div>

        <!-- Account details -->
        <div class="card divide-y divide-border overflow-hidden">
          <div class="px-6 py-4">
            <p class="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Account details</p>
          </div>

          <div class="grid grid-cols-[8rem_1fr] items-center gap-4 px-6 py-4">
            <span class="text-sm font-medium text-slate-500">Display name</span>
            <span class="text-sm font-semibold text-slate-900">{{ profile?.name || '—' }}</span>
          </div>

          <div class="grid grid-cols-[8rem_1fr] items-center gap-4 px-6 py-4">
            <span class="text-sm font-medium text-slate-500">Email</span>
            <span class="text-sm font-semibold text-slate-900">{{ profile?.email || '—' }}</span>
          </div>

          <div class="grid grid-cols-[8rem_1fr] items-center gap-4 px-6 py-4">
            <span class="text-sm font-medium text-slate-500">Role</span>
            <span
              class="inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
              :class="userStore.isAdmin
                ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-200'
                : 'bg-slate-100 text-slate-600 ring-1 ring-slate-200'"
            >
              {{ userStore.isAdmin ? 'Administrator' : 'Member' }}
            </span>
          </div>

          <div class="grid grid-cols-[8rem_1fr] items-center gap-4 px-6 py-4">
            <span class="text-sm font-medium text-slate-500">User ID</span>
            <code class="text-xs font-semibold text-slate-600">{{ profile?.id || '—' }}</code>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
