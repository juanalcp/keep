import { createMMKV } from 'react-native-mmkv';

import { normalizeNoteColor } from '@/src/notes/noteColors';
import type { Note } from '@/src/types/Note';

const NOTES_KEY = 'notes';
const storage = createMMKV();

type StoredNote = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color?: unknown;
};

function isStoredNote(value: unknown): value is StoredNote {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const note = value as Record<string, unknown>;
  return (
    typeof note.id === 'string' &&
    typeof note.title === 'string' &&
    typeof note.content === 'string' &&
    typeof note.createdAt === 'string' &&
    typeof note.updatedAt === 'string'
  );
}

function toNote(note: StoredNote): Note {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    color: normalizeNoteColor(note.color),
  };
}

function readStoredNotes(): { status: 'ok'; notes: unknown[] } | { status: 'invalid' } {
  try {
    const raw = storage.getString(NOTES_KEY);
    if (raw == null) {
      return { status: 'ok', notes: [] };
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isStoredNote)) {
      return { status: 'invalid' };
    }

    return { status: 'ok', notes: parsed };
  } catch {
    return { status: 'invalid' };
  }
}

function saveNotes(notes: unknown[]): void {
  storage.set(NOTES_KEY, JSON.stringify(notes));
}

export function listNotes(): Note[] {
  const stored = readStoredNotes();
  if (stored.status !== 'ok') {
    return [];
  }

  return stored.notes.filter(isStoredNote).map(toNote);
}

export function saveNote(note: Note): void {
  const stored = readStoredNotes();
  const notes = stored.status === 'ok' ? stored.notes : [];
  const existingIndex = notes.findIndex((item) => isStoredNote(item) && item.id === note.id);

  if (existingIndex >= 0) {
    notes[existingIndex] = note;
  } else {
    notes.push(note);
  }

  saveNotes(notes);
}

export function deleteNote(id: string): void {
  const stored = readStoredNotes();
  if (stored.status !== 'ok') {
    return;
  }

  const remaining = stored.notes.filter((item) => !(isStoredNote(item) && item.id === id));
  if (remaining.length === stored.notes.length) {
    return;
  }

  saveNotes(remaining);
}
