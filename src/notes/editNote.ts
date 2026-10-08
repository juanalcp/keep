import type { DraftCommitState, DraftCommitStatus } from '@/src/notes/newNote';
import * as notesRepository from '@/src/storage/notesRepository';
import type { Note } from '@/src/types/Note';
import type { NoteColor } from '@/src/notes/noteColors';

export type NoteEditDraft = {
  title: string;
  content: string;
  color: NoteColor;
};

export function commitEditedNote(
  original: Note,
  draft: NoteEditDraft,
  state: DraftCommitState,
  persist: (note: Note) => void | false = (note) => notesRepository.saveNote(note),
  now: () => Date = () => new Date()
): DraftCommitStatus {
  if (state.committed) {
    return 'discarded';
  }
  if (state.pending) {
    return 'pending';
  }

  const unchanged =
    original.title === draft.title &&
    original.content === draft.content &&
    original.color === draft.color;
  if (unchanged) {
    state.committed = true;
    return 'discarded';
  }

  const next: Note = {
    ...original,
    title: draft.title,
    content: draft.content,
    color: draft.color,
    updatedAt: now().toISOString(),
  };

  state.pending = true;
  try {
    const saved = persist(next);
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
