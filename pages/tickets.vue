<template>
  <div class="space-y-8">
    <PageHero
      title="Your tickets"
      description="Ready for authenticated ticket history, QR codes, and booking lookup."
    />
    <EmptyState
      title="No tickets yet"
      description="Purchased tickets will appear here once your booking and payment flows are connected."
      action-label="Browse movies"
      action-to="/movies"
    />
  </div>
</template>
