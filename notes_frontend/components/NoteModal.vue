<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="open" class="fixed inset-0 z-40 bg-black/30" @click="onBackdrop" />
    </Transition>
    <Transition name="slide-up">
      <div v-if="open" class="fixed inset-x-0 bottom-0 z-50 sm:inset-0 sm:flex sm:items-center sm:justify-center">
        <div class="w-full sm:w-[560px] bg-[var(--surface)] rounded-t-2xl sm:rounded-2xl border border-[var(--border)] shadow-2xl sm:mx-0 mx-auto">
          <form @submit.prevent="handleSubmit" class="p-4 sm:p-6">
            <header class="flex items-center justify-between gap-2 mb-2">
              <h3 class="text-lg font-semibold">{{ local.id ? 'Edit Note' : 'New Note' }}</h3>
              <button type="button" class="btn btn-ghost" @click="emit('close')">Close</button>
            </header>
            <div class="k-sep"></div>

            <div class="grid gap-3">
              <div>
                <label class="block text-[13px] font-medium mb-1">Title</label>
                <input class="input" v-model="local.title" name="title" placeholder="Title" maxlength="120" />
              </div>
              <div>
                <label class="block text-[13px] font-medium mb-1">Content</label>
                <textarea class="textarea" v-model="local.content" name="content" placeholder="Type your note..." />
              </div>
            </div>

            <div class="k-sep"></div>

            <footer class="flex items-center justify-between">
              <div class="text-[12px] text-[var(--muted)]">
                <span>{{ (local.content || '').length }} characters</span>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" class="btn btn-ghost" @click="emit('close')">Cancel</button>
                <button type="submit" class="btn btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7.5 8.5 18 5 14.5l1.5-1.5 2 2L17.5 6l1.5 1.5Z"/></svg>
                  Save
                </button>
              </div>
            </footer>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Note } from '~/types/note';

const props = defineProps<{
  modelValue: boolean
  note?: Note | null
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', value: { id?: number | string, title: string, content: string }): void
  (e: 'close'): void
}>();

const open = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
});

const local = reactive<{ id?: number | string, title: string, content: string }>({
  id: undefined, title: '', content: ''
});

watch(() => props.note, (n) => {
  local.id = n?.id;
  local.title = n?.title || '';
  local.content = n?.content || '';
}, { immediate: true });

function onBackdrop(e: MouseEvent) {
  e.stopPropagation();
  emit('close');
}

function handleSubmit() {
  if (!local.title?.trim() && !local.content?.trim()) {
    // simple validation: require content or title
    return;
  }
  emit('save', { id: local.id, title: local.title?.trim() || 'Untitled', content: local.content || '' });
}
</script>

<style scoped>
</style>
