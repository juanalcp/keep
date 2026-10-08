import { createMMKV } from 'react-native-mmkv';

import { renderRouter, screen } from 'expo-router/testing-library';

import { flashListProps } from '@/src/test-utils/flashListProps';
import { listNotes, saveNote } from '@/src/storage/notesRepository';
import type { Note } from '@/src/types/Note';

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

const EMPTY_NOTES_COPY = 'Las notas que añadas aparecerán aquí';

function note(overrides: Partial<Note> & Pick<Note, 'id'>): Note {
  return {
    title: 'Título',
    content: 'Contenido',
    createdAt: '2026-10-08T10:00:00.000Z',
    updatedAt: '2026-10-08T10:00:00.000Z',
    color: 'default',
    ...overrides,
  };
}

async function renderHome() {
  const rendered = await renderRouter('./app', { initialUrl: '/' });
  jest.useRealTimers();
  return rendered;
}

describe('home notes masonry', () => {
  beforeEach(() => {
    createMMKV().clearAll();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the empty copy under the header and composer when there are no notes', async () => {
    const home = await renderHome();

    expect(screen.getByText('Keep')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Create a note...' })).toBeTruthy();
    expect(screen.getByText(EMPTY_NOTES_COPY)).toBeTruthy();
    expect(screen.queryByTestId('note-title')).toBeNull();
    expect(screen.queryByTestId('note-content')).toBeNull();
    expect(flashListProps(home.root)).toMatchObject({
      masonry: true,
      numColumns: 2,
      optimizeItemArrangement: true,
      data: [],
    });
  });

  it('shows the empty copy when the notes store is missing or corrupt', async () => {
    createMMKV().set('notes', 'not json');

    await renderHome();

    expect(screen.getByText(EMPTY_NOTES_COPY)).toBeTruthy();
    expect(screen.queryByTestId('note-title')).toBeNull();
    expect(listNotes()).toEqual([]);
  });

  it('renders a 2-column masonry list, newest first, including an updatedAt tie', async () => {
    const older = note({
      id: 'older',
      title: 'Antigua',
      content: 'primero',
      createdAt: '2026-10-08T08:00:00.000Z',
      updatedAt: '2026-10-08T08:00:00.000Z',
    });
    const sameTimeLowId = note({
      id: 'a-low',
      title: 'Id bajo',
      content: 'empate',
      createdAt: '2026-10-08T09:00:00.000Z',
      updatedAt: '2026-10-08T12:00:00.000Z',
    });
    const sameTimeHighId = note({
      id: 'm-high',
      title: 'Id alto',
      content: 'empate',
      createdAt: '2026-10-08T09:00:00.000Z',
      updatedAt: '2026-10-08T12:00:00.000Z',
    });
    const editedEarlier = note({
      id: 'edited',
      title: 'Editada',
      content: 'reciente',
      createdAt: '2026-10-08T07:00:00.000Z',
      updatedAt: '2026-10-08T13:00:00.000Z',
    });
    saveNote(older);
    saveNote(sameTimeLowId);
    saveNote(sameTimeHighId);
    saveNote(editedEarlier);

    const home = await renderHome();
    const list = flashListProps(home.root);

    expect(list).toMatchObject({
      masonry: true,
      numColumns: 2,
      optimizeItemArrangement: true,
    });
    expect(list.data?.map((item) => item.id)).toEqual(['edited', 'm-high', 'a-low', 'older']);
    expect(screen.getAllByTestId('note-title').map((node) => node.props.children)).toEqual([
      'Editada',
      'Id alto',
      'Id bajo',
      'Antigua',
    ]);
  });

  it('omits a blank field and skips a card whose title and content are empty', async () => {
    saveNote(
      note({ id: 'blank', title: '  \n', content: '   ', updatedAt: '2026-10-08T15:00:00.000Z' })
    );
    saveNote(
      note({
        id: 'title-only',
        title: 'Solo título',
        content: ' \n ',
        updatedAt: '2026-10-08T14:00:00.000Z',
      })
    );
    saveNote(
      note({
        id: 'content-only',
        title: '',
        content: 'Solo texto',
        updatedAt: '2026-10-08T13:00:00.000Z',
      })
    );

    const home = await renderHome();

    expect(flashListProps(home.root).data?.map((item) => item.id)).toEqual([
      'title-only',
      'content-only',
    ]);
    expect(screen.getByTestId('note-title')).toHaveTextContent('Solo título');
    expect(screen.queryAllByTestId('note-title')).toHaveLength(1);
    expect(screen.getByTestId('note-content')).toHaveTextContent('Solo texto');
    expect(screen.queryAllByTestId('note-content')).toHaveLength(1);
    expect(screen.queryByText(EMPTY_NOTES_COPY)).toBeNull();
  });

  it('clips long title and content on screen without rewriting storage', async () => {
    const title = 'Título largo '.repeat(30);
    const content = 'Línea de la nota '.repeat(80);
    const stored = note({ id: 'long', title, content });
    saveNote(stored);

    await renderHome();

    expect(screen.getByTestId('note-title').props.numberOfLines).toBe(2);
    expect(screen.getByTestId('note-content').props.numberOfLines).toBe(8);
    expect(screen.getByTestId('note-title').props.children).toBe(title);
    expect(screen.getByTestId('note-content').props.children).toBe(content);
    expect(listNotes()).toEqual([stored]);
  });
});
