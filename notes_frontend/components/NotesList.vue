<template>
  <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <TransitionGroup name="slide-up">
      <article v-for="n in notes" :key="n.id" class="card p-4 flex flex-col gap-3 hover:shadow-lg transition-shadow">
        <header class="flex items-start justify-between gap-2">
          <h3 class="text-base font-semibold leading-snug line-clamp-2">{{ n.title || 'Untitled' }}</h3>
          <span class="badge" :title="formatDate(n.updated_at || n.created_at)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 8a1 1 0 0 1 1 1v2.586l1.707 1.707a1 1 0 1 1-1.414 1.414l-2-2A1 1 0 0 1 11 12V9a1 1 0 0 1 1-1Z"/><path fill-rule="evenodd" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm-8 10a8 8 0 1 1 16.001 0A8 8 0 0 1 4 12Z" clip-rule="evenodd"/></svg>
            <span>{{ timeAgo(n.updated_at || n.created_at) }}</span>
          </span>
        </header>
        <p class="text-[13px] text-[var(--muted)] line-clamp-3">{{ n.content }}</p>

        <div class="mt-auto flex items-center justify-between">
          <div class="text-[12px] text-[var(--muted)]">{{ (n.content || '').length }} chars</div>
          <div class="flex items-center gap-2">
            <button class="btn btn-ghost" @click="$emit('edit', n)" aria-label="Edit note">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 17.172V20h2.828l8.314-8.314-2.828-2.828L4 17.172ZM20.707 7.042a1 1 0 0 0 0-1.414l-2.335-2.335a1 1 0 0 0-1.414 0l-1.879 1.879 3.75 3.75 1.878-1.88Z"/></svg>
              Edit
            </button>
            <button class="btn btn-secondary" @click="$emit('delete', n)" aria-label="Delete note">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M9 3a1 1 0 0 0-1 1v1H5.5a1 1 0 1 0 0 2H6v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7h.5a1 1 0 1 0 0-2H16V4a1 1 0 0 0-1-1H9Zm2 3V5h4v1h-4Z"/><path d="M10 9a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1Zm5 0a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0v-7a1 1 0 0 1 1-1Z"/></svg>
              Delete
            </button>
          </div>
        </div>
      </article>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { Note } from '~/types/note';

defineProps<{
  notes: Note[]
}>();

defineEmits<{
  (e: 'edit', note: Note): void
  (e: 'delete', note: Note): void
}>();

function timeAgo(iso?: string) {
  if (!iso) return 'Just now';
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.max(1, Math.floor((now - then) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
function formatDate(iso?: string) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString();
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.line-clamp-3 {
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
</style>
