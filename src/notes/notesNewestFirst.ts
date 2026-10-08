import type { Note } from '@/src/types/Note';

export function notesNewestFirst(notes: Note[]): Note[] {
  return notes
    .map((note, index) => ({ note, index }))
    .sort((left, right) => {
      if (left.note.createdAt === right.note.createdAt) {
        return right.index - left.index;
      }
      return left.note.createdAt < right.note.createdAt ? 1 : -1;
    })
    .map(({ note }) => note);
}
