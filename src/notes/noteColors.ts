export const NOTE_COLOR_OPTIONS = [
  {
    id: 'default',
    label: 'Predeterminado',
    lightBackgroundClass: 'bg-card',
    darkBackgroundClass: 'dark:bg-card',
  },
  {
    id: 'red',
    label: 'Rojo',
    lightBackgroundClass: 'bg-note-red',
    darkBackgroundClass: 'dark:bg-note-red-dark',
  },
  {
    id: 'orange',
    label: 'Naranja',
    lightBackgroundClass: 'bg-note-orange',
    darkBackgroundClass: 'dark:bg-note-orange-dark',
  },
  {
    id: 'yellow',
    label: 'Amarillo',
    lightBackgroundClass: 'bg-note-yellow',
    darkBackgroundClass: 'dark:bg-note-yellow-dark',
  },
  {
    id: 'green',
    label: 'Verde',
    lightBackgroundClass: 'bg-note-green',
    darkBackgroundClass: 'dark:bg-note-green-dark',
  },
  {
    id: 'blue',
    label: 'Azul',
    lightBackgroundClass: 'bg-note-blue',
    darkBackgroundClass: 'dark:bg-note-blue-dark',
  },
  {
    id: 'purple',
    label: 'Morado',
    lightBackgroundClass: 'bg-note-purple',
    darkBackgroundClass: 'dark:bg-note-purple-dark',
  },
  {
    id: 'pink',
    label: 'Rosa',
    lightBackgroundClass: 'bg-note-pink',
    darkBackgroundClass: 'dark:bg-note-pink-dark',
  },
  {
    id: 'brown',
    label: 'Marrón',
    lightBackgroundClass: 'bg-note-brown',
    darkBackgroundClass: 'dark:bg-note-brown-dark',
  },
  {
    id: 'gray',
    label: 'Gris',
    lightBackgroundClass: 'bg-note-gray',
    darkBackgroundClass: 'dark:bg-note-gray-dark',
  },
] as const;

export type NoteColor = (typeof NOTE_COLOR_OPTIONS)[number]['id'];

const NOTE_COLOR_IDS: ReadonlySet<string> = new Set(NOTE_COLOR_OPTIONS.map((option) => option.id));

export function normalizeNoteColor(value: unknown): NoteColor {
  if (typeof value === 'string' && NOTE_COLOR_IDS.has(value)) {
    return value as NoteColor;
  }

  return 'default';
}

export function noteBackgroundClass(color: NoteColor): string {
  const option = NOTE_COLOR_OPTIONS.find((item) => item.id === color) ?? NOTE_COLOR_OPTIONS[0];
  return `${option.lightBackgroundClass} ${option.darkBackgroundClass}`;
}
