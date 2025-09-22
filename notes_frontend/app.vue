<template>
  <div class="min-h-screen bg-[var(--bg)] text-[var(--text)]">
    <NuxtRouteAnnouncer />
    <AppShell>
      <NuxtPage />
    </AppShell>
  </div>
</template>

<script setup lang="ts">
// Root-level setup if needed in future
</script>

<style>
:root {
  --primary: #2563EB;   /* Blue 600 */
  --primary-500: #3B82F6;
  --primary-600: #2563EB;
  --primary-700: #1D4ED8;

  --secondary: #F59E0B; /* Amber 500 */
  --secondary-600: #D97706;

  --error: #EF4444;
  --bg: #f9fafb;        /* Gray 50 */
  --surface: #ffffff;   /* White */
  --text: #111827;      /* Gray 900 */
  --muted: #6B7280;     /* Gray 500 */
  --border: #E5E7EB;    /* Gray 200 */
  --shadow: 0 10px 30px -12px rgba(37, 99, 235, 0.15);
}
html, body, #__nuxt {
  height: 100%;
}
* {
  box-sizing: border-box;
}
</style>
