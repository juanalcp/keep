import { buildNoteFromDraft, commitNewNote, createNoteId } from '@/src/notes/newNote';
import { notesNewestFirst } from '@/src/notes/notesNewestFirst';
import type { Note } from '@/src/types/Note';

const now = new Date('2026-10-08T12:00:00.000Z');

describe('buildNoteFromDraft', () => {
  it('returns null when both fields are empty or whitespace', () => {
    expect(buildNoteFromDraft({ title: '', content: '' })).toBeNull();
    expect(buildNoteFromDraft({ title: '   ', content: '\n\n' })).toBeNull();
    expect(buildNoteFromDraft({ title: ' \n ', content: ' \t ' })).toBeNull();
  });

  it('trims the ends and keeps whitespace in the middle', () => {
    expect(
      buildNoteFromDraft(
        { title: '  hello   world  ', content: '  line\n  two  ' },
        { id: 'note-1', now }
      )
    ).toEqual({
      id: 'note-1',
      title: 'hello   world',
      content: 'line\n  two',
      createdAt: '2026-10-08T12:00:00.000Z',
      updatedAt: '2026-10-08T12:00:00.000Z',
    });
  });

  it('saves a title without a body and a body without a title', () => {
    expect(buildNoteFromDraft({ title: ' Title ', content: '  ' }, { id: 'a', now })).toMatchObject(
      { title: 'Title', content: '' }
    );
    expect(buildNoteFromDraft({ title: '\n', content: ' Text ' }, { id: 'b', now })).toMatchObject({
      title: '',
      content: 'Text',
    });
  });

  it('uses a new id that is not derived from the title', () => {
    const first = buildNoteFromDraft({ title: 'Same', content: '' }, { now });
    const second = buildNoteFromDraft({ title: 'Same', content: '' }, { now });

    expect(first?.id).toEqual(expect.any(String));
    expect(first?.id).not.toBe(second?.id);
    expect(first?.id).not.toBe('Same');
    expect(createNoteId()).not.toBe(createNoteId());
  });
});

describe('commitNewNote', () => {
  const state = () => ({ committed: false, pending: false });

  it('discards an empty draft without writing', () => {
    const writes: Note[] = [];
    const session = state();

    expect(
      commitNewNote({ title: '  ', content: '\n' }, session, (note) => {
        writes.push(note);
      })
    ).toBe('discarded');
    expect(writes).toEqual([]);
    expect(session.committed).toBe(false);
  });

  it('writes one note for one dismiss and ignores a second dismiss', () => {
    const writes: Note[] = [];
    const session = state();
    const draft = { title: 'One', content: 'Note' };
    const persist = (note: Note) => {
      writes.push(note);
    };

    expect(
      commitNewNote(
        draft,
        session,
        persist,
        () => now,
        () => 'id-1'
      )
    ).toBe('saved');
    expect(
      commitNewNote(
        draft,
        session,
        persist,
        () => now,
        () => 'id-2'
      )
    ).toBe('discarded');
    expect(writes).toEqual([
      {
        id: 'id-1',
        title: 'One',
        content: 'Note',
        createdAt: '2026-10-08T12:00:00.000Z',
        updatedAt: '2026-10-08T12:00:00.000Z',
      },
    ]);
  });

  it('ignores a dismiss that starts while the first save is still running', () => {
    const session = state();
    let writes = 0;

    const status = commitNewNote({ title: 'One', content: '' }, session, () => {
      writes += 1;
      const nested = commitNewNote({ title: 'One', content: '' }, session, () => {
        writes += 1;
      });
      expect(nested).toBe('pending');
    });

    expect(status).toBe('saved');
    expect(writes).toBe(1);
  });

  it('keeps the draft uncommitted when save throws or returns failure', () => {
    const thrown = state();
    expect(
      commitNewNote({ title: 'Hello', content: 'Text' }, thrown, () => {
        throw new Error('disk');
      })
    ).toBe('failed');
    expect(thrown).toEqual({ committed: false, pending: false });

    const rejected = state();
    expect(commitNewNote({ title: 'Hello', content: 'Text' }, rejected, () => false)).toBe(
      'failed'
    );
    expect(rejected.committed).toBe(false);
  });

  it('discards a draft that was typed and then cleared', () => {
    const writes: Note[] = [];
    expect(
      commitNewNote({ title: '', content: '' }, state(), (note) => {
        writes.push(note);
      })
    ).toBe('discarded');
    expect(writes).toEqual([]);
  });
});

describe('notesNewestFirst', () => {
  const note = (overrides: Partial<Note> & Pick<Note, 'id'>): Note => ({
    title: overrides.id,
    content: '',
    createdAt: '2026-10-08T10:00:00.000Z',
    updatedAt: '2026-10-08T10:00:00.000Z',
    ...overrides,
  });

  it('orders by updatedAt, then createdAt, then id, without mutating the input', () => {
    const notes = [
      note({
        id: 'low',
        updatedAt: '2026-10-08T12:00:00.000Z',
        createdAt: '2026-10-08T09:00:00.000Z',
      }),
      note({
        id: 'z-late-insert',
        updatedAt: '2026-10-08T11:00:00.000Z',
        createdAt: '2026-10-08T11:00:00.000Z',
      }),
      note({
        id: 'm',
        updatedAt: '2026-10-08T12:00:00.000Z',
        createdAt: '2026-10-08T08:00:00.000Z',
      }),
      note({
        id: 'a-early-insert',
        updatedAt: '2026-10-08T11:00:00.000Z',
        createdAt: '2026-10-08T11:00:00.000Z',
      }),
      note({
        id: 'newer-created',
        updatedAt: '2026-10-08T11:00:00.000Z',
        createdAt: '2026-10-08T11:30:00.000Z',
      }),
    ];
    const original = notes.map((item) => item.id);

    expect(notesNewestFirst(notes).map((item) => item.id)).toEqual([
      'low',
      'm',
      'newer-created',
      'z-late-insert',
      'a-early-insert',
    ]);
    expect(notes.map((item) => item.id)).toEqual(original);
  });
});
