<template>
  <AppShell>
    <template #actions>
      <div class="flex items-center gap-2">
        <button class="btn btn-secondary" @click="refreshNotes" :disabled="loading">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V2L7 7l5 5V9c2.757 0 5 2.243 5 5a5 5 0 1 1-5-5Z"/></svg>
          Refresh
        </button>
        <button class="btn btn-primary" @click="startCreate">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M11 4a1 1 0 0 1 2 0v7h7a1 1 0 1 1 0 2h-7v7a1 1 0 1 1-2 0v-7H4a1 1 0 1 1 0-2h7V4Z"/></svg>
          New Note
        </button>
      </div>
    </template>

    <section class="mt-4">
      <div class="card p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-gray-50 border border-[var(--border)] flex items-center justify-center text-[var(--primary)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5.5 w-5.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5a2 2 0 0 0-2 2v14l4-2h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold">Your Notes</h2>
            <p class="text-[13px] text-[var(--muted)]">Create, edit, and organize your ideas.</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <input class="input sm:w-64" v-model="query" placeholder="Search notes..." />
        </div>
      </div>

      <div v-if="error" class="card border-red-200 bg-red-50 p-3 mb-4 text-red-700">
        {{ error }}
      </div>

      <NotesList
        :notes="filtered"
        @edit="openEdit"
        @delete="confirmDelete"
      />

      <div v-if="!loading && filtered.length === 0" class="text-center text-[var(--muted)] py-12">
        No notes found. Create your first note!
      </div>
    </section>

    <NoteModal
      v-model="showModal"
      :note="activeNote"
      @save="saveNote"
      @close="closeModal"
    />
  </AppShell>
</template>

<script setup lang="ts">
import NotesList from '~/components/NotesList.vue';
import NoteModal from '~/components/NoteModal.vue';
import { useNotes } from '~/composables/useNotes';
import type { Note } from '~/types/note';

const {
  notes, loading, error, fetchNotes,
  createNote, updateNote, deleteNote
} = useNotes();

const showModal = ref(false);
const activeNote = ref<Note | null>(null);
const query = ref('');

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return notes.value;
  return notes.value.filter(n =>
    (n.title || '').toLowerCase().includes(q) ||
    (n.content || '').toLowerCase().includes(q)
  );
});

onMounted(() => {
  fetchNotes();
});

function startCreate() {
  activeNote.value = null;
  showModal.value = true;
}
function openEdit(n: Note) {
  activeNote.value = { ...n };
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}

async function saveNote(payload: { id?: number | string, title: string, content: string }) {
  if (payload.id) {
    await updateNote(payload.id, { title: payload.title, content: payload.content });
  } else {
    await createNote({ title: payload.title, content: payload.content });
  }
  showModal.value = false;
}

async function confirmDelete(n: Note) {
  if (confirm('Delete this note?')) {
    await deleteNote(n.id);
  }
}

function refreshNotes() {
  fetchNotes(true);
}
</script>
