import {
  NOTE_COLOR_OPTIONS,
  normalizeNoteColor,
  noteBackgroundClass,
} from '@/src/notes/noteColors';

const LABELS = [
  'Predeterminado',
  'Rojo',
  'Naranja',
  'Amarillo',
  'Verde',
  'Azul',
  'Morado',
  'Rosa',
  'Marrón',
  'Gris',
];

describe('note colors', () => {
  it('lists the ten Keep colors in palette order with light and dark classes', () => {
    expect(NOTE_COLOR_OPTIONS.map((option) => option.id)).toEqual([
      'default',
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'purple',
      'pink',
      'brown',
      'gray',
    ]);
    expect(NOTE_COLOR_OPTIONS.map((option) => option.label)).toEqual(LABELS);
    for (const option of NOTE_COLOR_OPTIONS) {
      expect(option.lightBackgroundClass.startsWith('bg-')).toBe(true);
      expect(option.darkBackgroundClass.startsWith('dark:bg-')).toBe(true);
    }
    expect(noteBackgroundClass('default')).toBe('bg-card dark:bg-card');
    expect(noteBackgroundClass('red')).toBe('bg-note-red dark:bg-note-red-dark');
  });

  it('treats a missing or unrecognized color as default', () => {
    expect(normalizeNoteColor(undefined)).toBe('default');
    expect(normalizeNoteColor('magenta')).toBe('default');
    expect(normalizeNoteColor(12)).toBe('default');
    expect(normalizeNoteColor('blue')).toBe('blue');
  });
});
