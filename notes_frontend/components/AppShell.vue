<template>
  <div>
    <header class="sticky top-0 z-30 backdrop-blur bg-[var(--surface)]/80 border-b border-[var(--border)]">
      <div class="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-blue-500/25 flex items-center justify-center text-white font-bold">N</div>
          <div>
            <h1 class="text-lg font-semibold tracking-tight">Ocean Notes</h1>
            <p class="text-[12px] text-[var(--muted)]">Focus-friendly notes, beautifully simple.</p>
          </div>
        </div>
        <slot name="actions" />
      </div>
    </header>

    <main class="mx-auto max-w-5xl p-4">
      <slot />
    </main>

    <footer class="mx-auto max-w-5xl px-4 py-6 text-[13px] text-[var(--muted)]">
      <div class="k-sep"></div>
      <div class="flex items-center justify-between">
        <span>Ocean Professional theme</span>
        <span>&copy; {{ new Date().getFullYear() }} Notes</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Shell is simple, no logic required now.
</script>

<style scoped>
</style>
