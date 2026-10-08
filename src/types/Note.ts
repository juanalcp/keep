import type { NoteColor } from '@/src/notes/noteColors';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  color: NoteColor;
}
