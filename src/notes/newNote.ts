import * as notesRepository from '@/src/storage/notesRepository';
import type { Note } from '@/src/types/Note';

export type NoteDraft = {
  title: string;
  content: string;
};

export type DraftCommitState = {
  committed: boolean;
  pending: boolean;
};

export type DraftCommitStatus = 'saved' | 'discarded' | 'failed' | 'pending';

export function createNoteId(): string {
  const randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto);
  if (randomUUID) {
    return randomUUID();
  }

  const bytes = new Uint8Array(16);
  const getRandomValues = globalThis.crypto?.getRandomValues?.bind(globalThis.crypto);
  if (getRandomValues) {
    getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function buildNoteFromDraft(
  draft: NoteDraft,
  options: { id?: string; now?: Date } = {}
): Note | null {
  const title = draft.title.trim();
  const content = draft.content.trim();
  if (title === '' && content === '') {
    return null;
  }

  const timestamp = (options.now ?? new Date()).toISOString();
  return {
    id: options.id ?? createNoteId(),
    title,
    content,
    createdAt: timestamp,
    updatedAt: timestamp,
    color: 'default',
  };
}

export function commitNewNote(
  draft: NoteDraft,
  state: DraftCommitState,
  persist: (note: Note) => void | false = (note) => notesRepository.saveNote(note),
  now: () => Date = () => new Date(),
  createId: () => string = createNoteId
): DraftCommitStatus {
  if (state.committed) {
    return 'discarded';
  }
  if (state.pending) {
    return 'pending';
  }

  const note = buildNoteFromDraft(draft, { id: createId(), now: now() });
  if (!note) {
    return 'discarded';
  }

  state.pending = true;
  try {
    const saved = persist(note);
    if (saved === false) {
      state.pending = false;
      return 'failed';
    }
  } catch {
    state.pending = false;
    return 'failed';
  }

  state.pending = false;
  state.committed = true;
  return 'saved';
}
