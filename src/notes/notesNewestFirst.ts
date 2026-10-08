import type { Note } from '@/src/types/Note';

function compareDescending(left: string, right: string): number {
  if (left === right) {
    return 0;
  }

  return left < right ? 1 : -1;
}

export function notesNewestFirst(notes: Note[]): Note[] {
  return [...notes].sort((left, right) => {
    return (
      compareDescending(left.updatedAt, right.updatedAt) ||
      compareDescending(left.createdAt, right.createdAt) ||
      compareDescending(left.id, right.id)
    );
  });
}
