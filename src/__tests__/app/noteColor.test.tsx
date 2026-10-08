import { createMMKV } from 'react-native-mmkv';

import { router } from 'expo-router';
import { act, fireEvent, renderRouter, screen, within } from 'expo-router/testing-library';

import * as notesRepository from '@/src/storage/notesRepository';
import { listNotes } from '@/src/storage/notesRepository';
import type { Note } from '@/src/types/Note';

jest.mock('@rn-primitives/popover', () => {
  // The factory is hoisted above imports, so the mock has to load these itself.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react') as typeof import('react');
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Pressable, View } = require('react-native') as typeof import('react-native');
  const PopoverContext = React.createContext<{
    open: boolean;
    setOpen: (open: boolean) => void;
  }>({
    open: false,
    setOpen: () => undefined,
  });

  function Root({ children }: { children?: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);
    const value = React.useMemo(() => ({ open, setOpen }), [open]);
    return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
  }

  function Trigger({
    children,
    asChild,
  }: {
    children?: React.ReactElement<{ onPress?: () => void }>;
    asChild?: boolean;
  }) {
    const { open, setOpen } = React.useContext(PopoverContext);
    const onPress = () => setOpen(!open);
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, { onPress });
    }
    return <Pressable onPress={onPress}>{children}</Pressable>;
  }

  function Portal({ children }: { children?: React.ReactNode }) {
    const { open } = React.useContext(PopoverContext);
    return open ? <>{children}</> : null;
  }

  function Overlay({ children }: { children?: React.ReactNode }) {
    return <View>{children}</View>;
  }

  function Content({ children }: { children?: React.ReactNode }) {
    return <View>{children}</View>;
  }

  return { Root, Trigger, Portal, Overlay, Content };
});

jest.mock('nativewind', () => {
  const actual = jest.requireActual('nativewind');
  return {
    ...actual,
    useColorScheme: () => ({
      colorScheme: 'light',
      setColorScheme: jest.fn(),
      toggleColorScheme: jest.fn(),
    }),
  };
});

jest.mock('react-native-screens', () => {
  const actual = jest.requireActual('react-native-screens');
  return {
    ...actual,
    FullWindowOverlay: ({ children }: { children?: unknown }) => children,
  };
});

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

function note(overrides: Partial<Note> & Pick<Note, 'id' | 'title'>): Note {
  return {
    content: 'milk',
    createdAt: '2026-10-08T08:00:00.000Z',
    updatedAt: '2026-10-08T08:00:00.000Z',
    color: 'default',
    ...overrides,
  };
}

function classNameOf(element: { props: { className?: string } }): string {
  return element.props.className ?? '';
}

function cardClass(label: string): string {
  return classNameOf(within(screen.getByLabelText(label)).getByTestId('note-card'));
}

async function openNote(title: string) {
  await fireEvent.press(screen.getByRole('button', { name: `Open note, ${title}` }));
}

async function openPalette() {
  await fireEvent.press(screen.getByRole('button', { name: 'Color de la nota' }));
}

async function closeNote() {
  await fireEvent.press(screen.getByRole('button', { name: 'Close' }));
}

describe('note colors', () => {
  beforeEach(() => {
    createMMKV().clearAll();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('colors a note from the editor and shows that color on the grid', async () => {
    const shopping = note({ id: 'shopping', title: 'Shopping' });
    const garden = note({
      id: 'garden',
      title: 'Garden',
      color: 'green',
      updatedAt: '2026-10-08T09:00:00.000Z',
    });
    const pink = note({ id: 'pink', title: 'Pink', color: 'pink' });
    const legacy = {
      id: 'legacy',
      title: 'Sin color',
      content: 'Texto viejo',
      createdAt: '2026-10-08T07:00:00.000Z',
      updatedAt: '2026-10-08T07:00:00.000Z',
    };
    const unknown = {
      id: 'odd',
      title: 'Rara',
      content: 'Sigue',
      createdAt: '2026-10-08T06:00:00.000Z',
      updatedAt: '2026-10-08T06:00:00.000Z',
      color: 'magenta',
    };
    createMMKV().set('notes', JSON.stringify([shopping, garden, pink, legacy, unknown]));

    await renderRouter('./app', { initialUrl: '/' });
    jest.useRealTimers();

    expect(screen.queryByRole('button', { name: 'Color de la nota' })).toBeNull();
    expect(cardClass('Open note, Shopping')).toContain('bg-card');
    expect(cardClass('Open note, Garden')).toContain('bg-note-green');
    expect(cardClass('Open note, Pink')).toContain('bg-note-pink');
    expect(cardClass('Open note, Sin color')).toContain('bg-card');
    expect(cardClass('Open note, Sin color')).not.toContain('bg-note-');
    expect(cardClass('Open note, Rara')).not.toContain('bg-note-');
    expect(screen.getByText('Texto viejo')).toBeTruthy();
    expect(screen.getByText('Sigue')).toBeTruthy();

    await openNote('Shopping');
    expect(screen.getByDisplayValue('Shopping')).toBeTruthy();
    expect(screen.getByDisplayValue('milk')).toBeTruthy();
    expect(classNameOf(screen.getByTestId('note-editor'))).toContain('bg-card');
    expect(screen.queryByRole('radio', { name: 'Rojo' })).toBeNull();

    await openPalette();
    expect(screen.getAllByRole('radio').map((node) => node.props.accessibilityLabel)).toEqual(
      LABELS
    );
    expect(screen.getByRole('radio', { name: 'Predeterminado', selected: true })).toBeTruthy();

    await fireEvent.press(screen.getByRole('radio', { name: 'Rojo' }));
    expect(screen.getByRole('radio', { name: 'Rojo', selected: true })).toBeTruthy();
    expect(screen.getByRole('radio', { name: 'Amarillo' })).toBeTruthy();
    expect(classNameOf(screen.getByTestId('note-editor'))).toContain('bg-note-red');
    expect(classNameOf(screen.getByTestId('note-editor'))).toContain('dark:bg-note-red-dark');
    expect(classNameOf(screen.getByTestId('note-color-swatch'))).toContain('bg-note-red');
    expect(listNotes().find((item) => item.id === 'shopping')?.updatedAt).toBe(shopping.updatedAt);

    await openPalette();
    expect(screen.queryByRole('radio', { name: 'Rojo' })).toBeNull();

    await closeNote();
    const savedShopping = listNotes().find((item) => item.id === 'shopping');
    expect(savedShopping).toMatchObject({
      color: 'red',
      title: 'Shopping',
      content: 'milk',
      createdAt: shopping.createdAt,
    });
    expect(savedShopping?.updatedAt).not.toBe(shopping.updatedAt);
    expect(cardClass('Open note, Shopping')).toContain('bg-note-red');

    await openNote('Shopping');
    await openPalette();
    expect(screen.getByRole('radio', { name: 'Rojo', selected: true })).toBeTruthy();
    await closeNote();
    expect(listNotes().find((item) => item.id === 'shopping')?.updatedAt).toBe(
      savedShopping?.updatedAt
    );

    await openNote('Garden');
    expect(classNameOf(screen.getByTestId('note-editor'))).toContain('bg-note-green');
    await openPalette();
    expect(screen.getByRole('radio', { name: 'Verde', selected: true })).toBeTruthy();
    await fireEvent.press(screen.getByRole('radio', { name: 'Verde' }));
    await closeNote();
    expect(listNotes().find((item) => item.id === 'garden')).toMatchObject({
      color: 'green',
      updatedAt: garden.updatedAt,
    });

    await openNote('Garden');
    await openPalette();
    await fireEvent.press(screen.getByRole('radio', { name: 'Predeterminado' }));
    expect(classNameOf(screen.getByTestId('note-editor'))).toContain('bg-card');
    expect(classNameOf(screen.getByTestId('note-editor'))).not.toContain('bg-note-');
    await closeNote();
    expect(listNotes().find((item) => item.id === 'garden')?.color).toBe('default');
    expect(listNotes().find((item) => item.id === 'garden')?.updatedAt).not.toBe(garden.updatedAt);
    expect(cardClass('Open note, Garden')).not.toContain('bg-note-');

    const rawBeforeLegacyClose = createMMKV().getString('notes');
    await openNote('Sin color');
    expect(screen.getByDisplayValue('Sin color')).toBeTruthy();
    expect(screen.getByDisplayValue('Texto viejo')).toBeTruthy();
    expect(classNameOf(screen.getByTestId('note-editor'))).toContain('bg-card');
    await openPalette();
    expect(screen.getByRole('radio', { name: 'Predeterminado', selected: true })).toBeTruthy();
    await closeNote();
    expect(createMMKV().getString('notes')).toBe(rawBeforeLegacyClose);
    expect(listNotes().find((item) => item.id === 'legacy')).toMatchObject({
      title: 'Sin color',
      content: 'Texto viejo',
      color: 'default',
    });
    expect(listNotes().find((item) => item.id === 'odd')?.color).toBe('default');

    await act(async () => {
      router.push({ pathname: '/note/[id]', params: { id: 'missing' } });
    });
    expect(screen.getByText('This note does not exist.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Color de la nota' })).toBeNull();
    expect(screen.queryByLabelText('Title')).toBeNull();
    await closeNote();

    jest.spyOn(notesRepository, 'saveNote').mockImplementation(() => {
      throw new Error('save failed');
    });
    await openNote('Pink');
    await openPalette();
    await fireEvent.press(screen.getByRole('radio', { name: 'Azul' }));
    expect(classNameOf(screen.getByTestId('note-editor'))).toContain('bg-note-blue');
    await closeNote();
    expect(screen.getByDisplayValue('Pink')).toBeTruthy();
    expect(listNotes().find((item) => item.id === 'pink')?.color).toBe('pink');
  });
});
