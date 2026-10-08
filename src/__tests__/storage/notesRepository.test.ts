import { createMMKV } from 'react-native-mmkv';

import { deleteNote, listNotes, saveNote } from '@/src/storage/notesRepository';
import type { Note } from '@/src/types/Note';

const note = (overrides: Partial<Note> = {}): Note => ({
  id: '1',
  title: 'Test Note',
  content: 'Test content',
  createdAt: '2026-10-08T00:00:00.000Z',
  updatedAt: '2026-10-08T00:00:00.000Z',
  ...overrides,
});

describe('notesRepository', () => {
  beforeEach(() => {
    createMMKV().clearAll();
  });

  it('returns an empty list when nothing has been stored', () => {
    expect(listNotes()).toEqual([]);
  });

  it('saves a note and lists it', () => {
    const stored = note();
    saveNote(stored);

    expect(listNotes()).toEqual([stored]);
  });

  it('replaces a note with the same id and keeps a single entry', () => {
    saveNote(note({ title: 'Original', content: 'Original content' }));
    const updated = note({
      title: 'Updated',
      content: 'Updated content',
      updatedAt: '2026-10-08T01:00:00.000Z',
    });
    saveNote(updated);

    expect(listNotes()).toEqual([updated]);
  });

  it('appends a note with a new id and preserves stored order', () => {
    const first = note({ id: '1', title: 'First' });
    const second = note({ id: '2', title: 'Second' });
    saveNote(first);
    saveNote(second);

    expect(listNotes()).toEqual([first, second]);
  });

  it('deletes a stored note', () => {
    saveNote(note());
    deleteNote('1');

    expect(listNotes()).toEqual([]);
  });

  it('does nothing when deleting an unknown id', () => {
    const stored = note();
    saveNote(stored);

    expect(() => deleteNote('missing')).not.toThrow();
    expect(listNotes()).toEqual([stored]);
  });

  it('leaves corrupt storage unchanged when deleting an unknown id', () => {
    createMMKV().set('notes', 'not json');

    expect(() => deleteNote('missing')).not.toThrow();
    expect(createMMKV().getString('notes')).toBe('not json');
    expect(listNotes()).toEqual([]);
  });

  it.each([
    ['missing', undefined],
    ['invalid json', 'not valid json'],
    ['not an array', JSON.stringify({ id: '1' })],
    ['a primitive array', JSON.stringify(['note'])],
    ['an incomplete note', JSON.stringify([{ id: '1', title: 'Only a title' }])],
    [
      'a note with a non-string field',
      JSON.stringify([
        {
          id: 1,
          title: 'Bad id',
          content: 'content',
          createdAt: '2026-10-08T00:00:00.000Z',
          updatedAt: '2026-10-08T00:00:00.000Z',
        },
      ]),
    ],
    [
      'a mix of valid and invalid notes',
      JSON.stringify([note(), { id: '2', title: 'Missing the rest' }]),
    ],
  ])('returns an empty list when storage is %s', (_label: string, raw?: string) => {
    if (raw !== undefined) {
      createMMKV().set('notes', raw);
    }

    expect(() => listNotes()).not.toThrow();
    expect(listNotes()).toEqual([]);
  });
});
