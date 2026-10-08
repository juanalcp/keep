import { commitEditedNote } from '@/src/notes/editNote';
import type { Note } from '@/src/types/Note';

const original: Note = {
  id: 'note-1',
  title: 'Title',
  content: 'Body',
  createdAt: '2026-10-08T08:00:00.000Z',
  updatedAt: '2026-10-08T08:00:00.000Z',
  color: 'default',
};

const later = new Date('2026-10-08T18:00:00.000Z');

describe('commitEditedNote', () => {
  const state = () => ({ committed: false, pending: false });

  it('leaves updatedAt unchanged when the color is the one already stored', () => {
    const writes: Note[] = [];
    const session = state();

    expect(
      commitEditedNote(
        original,
        { title: 'Title', content: 'Body', color: 'default' },
        session,
        (note) => {
          writes.push(note);
        },
        () => later
      )
    ).toBe('discarded');
    expect(writes).toEqual([]);
    expect(session.committed).toBe(true);
  });

  it('stores a different color and updates updatedAt', () => {
    const writes: Note[] = [];

    expect(
      commitEditedNote(
        original,
        { title: 'Title', content: 'Body', color: 'red' },
        state(),
        (note) => {
          writes.push(note);
        },
        () => later
      )
    ).toBe('saved');
    expect(writes).toEqual([
      {
        ...original,
        color: 'red',
        updatedAt: '2026-10-08T18:00:00.000Z',
      },
    ]);
  });

  it('stores default when a tint is cleared and updates updatedAt', () => {
    const tinted: Note = { ...original, color: 'green' };
    const writes: Note[] = [];

    commitEditedNote(
      tinted,
      { title: tinted.title, content: tinted.content, color: 'default' },
      state(),
      (note) => {
        writes.push(note);
      },
      () => later
    );

    expect(writes[0]).toMatchObject({
      color: 'default',
      updatedAt: '2026-10-08T18:00:00.000Z',
      createdAt: tinted.createdAt,
    });
  });

  it('does not write again after a successful save', () => {
    const writes: Note[] = [];
    const session = state();
    const persist = (note: Note) => {
      writes.push(note);
    };

    commitEditedNote(
      original,
      { title: 'Changed', content: 'Body', color: 'default' },
      session,
      persist,
      () => later
    );
    expect(
      commitEditedNote(
        original,
        { title: 'Changed again', content: 'Body', color: 'blue' },
        session,
        persist,
        () => later
      )
    ).toBe('discarded');
    expect(writes).toHaveLength(1);
  });

  it('keeps the draft uncommitted when save fails', () => {
    const session = state();

    expect(
      commitEditedNote(
        original,
        { title: 'Title', content: 'Body', color: 'pink' },
        session,
        () => {
          throw new Error('disk');
        }
      )
    ).toBe('failed');
    expect(session).toEqual({ committed: false, pending: false });
    expect(
      commitEditedNote(
        original,
        { title: 'Title', content: 'Body', color: 'pink' },
        state(),
        () => false
      )
    ).toBe('failed');
  });
});
