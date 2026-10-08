import { createMMKV } from 'react-native-mmkv';

import type { Note } from '@/src/types/Note';

const NOTES_KEY = 'notes';
const storage = createMMKV();

function isValidNote(value: unknown): value is Note {
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

function loadNotes(): Note[] {
  try {
    const raw = storage.getString(NOTES_KEY);
    if (raw == null) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isValidNote)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]): void {
  storage.set(NOTES_KEY, JSON.stringify(notes));
}

export function listNotes(): Note[] {
  return loadNotes();
}

export function saveNote(note: Note): void {
  const notes = loadNotes();
  const existingIndex = notes.findIndex((stored) => stored.id === note.id);

  if (existingIndex >= 0) {
    notes[existingIndex] = note;
  } else {
    notes.push(note);
  }

  saveNotes(notes);
}

export function deleteNote(id: string): void {
  const notes = loadNotes();
  const remaining = notes.filter((note) => note.id !== id);
  if (remaining.length === notes.length) {
    return;
  }

  saveNotes(remaining);
}
