import { apiFetch } from '~/utils/api';
import type { Note, NoteInput } from '~/types/note';

type DbNote = Note & { _local?: boolean };

const DB_NAME = 'ocean-notes';
const DB_STORE = 'notes';
const DB_VERSION = 1;

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DB_STORE)) {
        const store = db.createObjectStore(DB_STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('updated_at', 'updated_at');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbGetAll(): Promise<DbNote[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readonly');
    const store = tx.objectStore(DB_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result as DbNote[]);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(note: DbNote): Promise<DbNote> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    const store = tx.objectStore(DB_STORE);
    const req = store.put(note);
    req.onsuccess = () => resolve({ ...note, id: req.result as number, _local: true });
    req.onerror = () => reject(req.error);
  });
}

async function idbDelete(id: Note['id']): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, 'readwrite');
    const store = tx.objectStore(DB_STORE);
    const req = store.delete(id as IDBValidKey);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// PUBLIC_INTERFACE
export function useNotes() {
  /**
   * Notes state and CRUD operations.
   * It tries to use the backend API at runtimeConfig.public.apiBase.
   * If API fails, it falls back to local IndexedDB seamlessly.
   */
  const notes = useState<DbNote[]>('notes', () => []);
  const loading = useState<boolean>('notes_loading', () => false);
  const error = useState<string | null>('notes_error', () => null);

  async function fetchNotes(force = false) {
    if (loading.value) return;
    loading.value = true;
    error.value = null;

    try {
      const data = await apiFetch<DbNote[]>('/notes', { method: 'GET' });
      notes.value = (data || []).map(n => ({ ...n, _local: false }));
    } catch (e: any) {
      if (!force) {
        // fallback to local
        try {
          const local = await idbGetAll();
          notes.value = local.map(n => ({ ...n, _local: true }));
          error.value = 'Using local storage (offline mode).';
        } catch (ie: any) {
          error.value = e?.message || 'Failed to load notes.';
        }
      } else {
        error.value = e?.message || 'Failed to refresh notes.';
      }
    } finally {
      loading.value = false;
    }
  }

  async function createNote(input: NoteInput) {
    const base: DbNote = {
      id: undefined as unknown as number,
      title: input.title,
      content: input.content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      _local: false
    };

    try {
      const created = await apiFetch<DbNote>('/notes', { method: 'POST', body: input });
      notes.value.unshift({ ...created, _local: false });
    } catch {
      const saved = await idbPut({ ...base, _local: true });
      notes.value.unshift(saved);
      error.value = 'Saved locally (offline mode).';
    }
  }

  async function updateNote(id: Note['id'], input: NoteInput) {
    try {
      const updated = await apiFetch<DbNote>(`/notes/${id}`, { method: 'PUT', body: input });
      notes.value = notes.value.map(n => n.id === id ? { ...n, ...updated, _local: false } : n);
    } catch {
      // Update local
      const existing = notes.value.find(n => n.id === id);
      if (existing) {
        const updated: DbNote = { ...existing, ...input, updated_at: new Date().toISOString(), _local: true };
        await idbPut(updated);
        notes.value = notes.value.map(n => n.id === id ? updated : n);
        error.value = 'Updated locally (offline mode).';
      }
    }
  }

  async function deleteNote(id: Note['id']) {
    try {
      await apiFetch<void>(`/notes/${id}`, { method: 'DELETE' });
      notes.value = notes.value.filter(n => n.id !== id);
    } catch {
      await idbDelete(id);
      notes.value = notes.value.filter(n => n.id !== id);
      error.value = 'Deleted locally (offline mode).';
    }
  }

  return {
    notes, loading, error,
    fetchNotes, createNote, updateNote, deleteNote
  };
}
