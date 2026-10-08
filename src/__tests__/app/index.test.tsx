import { createMMKV } from 'react-native-mmkv';

import { act, fireEvent, renderRouter, screen } from 'expo-router/testing-library';
import { router } from 'expo-router';

import * as notesRepository from '@/src/storage/notesRepository';

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

async function renderHome() {
  const rendered = await renderRouter('./app', { initialUrl: '/' });
  jest.useRealTimers();
  return rendered;
}

async function setInputValue(
  element: { props: { onChangeText?: (value: string) => void } },
  value: string
) {
  await act(() => {
    element.props.onChangeText?.(value);
  });
}

async function openComposer() {
  await fireEvent.press(screen.getByRole('button', { name: 'Crear una nota...' }));
  expect(screen.getByPlaceholderText('Título')).toBeTruthy();
}

async function closeComposer() {
  await fireEvent.press(screen.getByRole('button', { name: 'Cerrar' }));
}

describe('creating a note from the home screen', () => {
  beforeEach(() => {
    createMMKV().clearAll();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('saves a note on dismiss and drops an empty draft', async () => {
    await renderHome();

    expect(screen.getByText('Keep')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Crear una nota...' })).toBeTruthy();
    expect(screen.queryByTestId('note-title')).toBeNull();

    await openComposer();
    await closeComposer();
    expect(notesRepository.listNotes()).toEqual([]);
    expect(screen.getByText('Crear una nota...')).toBeTruthy();
    expect(screen.queryByTestId('note-title')).toBeNull();

    await openComposer();
    await setInputValue(screen.getByPlaceholderText('Título'), '   \n');
    await setInputValue(screen.getByLabelText('Contenido'), ' \n\n  ');
    await closeComposer();
    expect(notesRepository.listNotes()).toEqual([]);

    await openComposer();
    await setInputValue(screen.getByPlaceholderText('Título'), 'Borrador');
    await setInputValue(screen.getByLabelText('Contenido'), 'Texto');
    await setInputValue(screen.getByPlaceholderText('Título'), '   ');
    await setInputValue(screen.getByLabelText('Contenido'), '\n');
    await closeComposer();
    expect(notesRepository.listNotes()).toEqual([]);
    expect(screen.queryByText('Borrador')).toBeNull();

    await openComposer();
    await setInputValue(screen.getByPlaceholderText('Título'), '  Compras  ');
    await setInputValue(screen.getByLabelText('Contenido'), '  leche\n pan  ');
    await closeComposer();

    expect(screen.getByText('Crear una nota...')).toBeTruthy();
    expect(screen.queryByPlaceholderText('Título')).toBeNull();
    expect(screen.getByTestId('note-title')).toHaveTextContent('Compras');
    expect(screen.getByTestId('note-content')).toHaveTextContent('leche\n pan');

    const [saved] = notesRepository.listNotes();
    expect(notesRepository.listNotes()).toHaveLength(1);
    expect(saved).toMatchObject({
      title: 'Compras',
      content: 'leche\n pan',
    });
    expect(saved?.createdAt).toBe(saved?.updatedAt);
    expect(saved?.createdAt).toEqual(expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/));
    expect(saved?.id).toEqual(expect.any(String));
    expect(saved?.id).not.toBe('Compras');

    await openComposer();
    await setInputValue(screen.getByPlaceholderText('Título'), 'Solo título');
    await closeComposer();

    await openComposer();
    await setInputValue(screen.getByLabelText('Contenido'), 'Solo texto');
    await closeComposer();

    const notes = notesRepository.listNotes();
    expect(notes).toHaveLength(3);
    expect(new Set(notes.map((note) => note.id)).size).toBe(3);
    expect(notes.find((note) => note.title === 'Solo título')).toMatchObject({
      title: 'Solo título',
      content: '',
    });
    expect(notes.find((note) => note.content === 'Solo texto')).toMatchObject({
      title: '',
      content: 'Solo texto',
    });

    const titles = screen.getAllByTestId('note-title');
    const contents = screen.getAllByTestId('note-content');
    expect(contents[0]).toHaveTextContent('Solo texto');
    expect(titles[1]).toHaveTextContent('Solo título');
    expect(titles[2]).toHaveTextContent('Compras');
    expect(contents[2]).toHaveTextContent('leche\n pan');

    await openComposer();
    await setInputValue(screen.getByPlaceholderText('Título'), 'Volver');
    await act(async () => {
      router.back();
    });
    expect(screen.queryByPlaceholderText('Título')).toBeNull();
    expect(notesRepository.listNotes().map((note) => note.title)).toContain('Volver');

    await openComposer();
    await setInputValue(screen.getByPlaceholderText('Título'), 'Compras');
    await setInputValue(screen.getByLabelText('Contenido'), 'Leche');
    jest.spyOn(notesRepository, 'saveNote').mockImplementation(() => {
      throw new Error('save failed');
    });
    await closeComposer();

    expect(screen.getByDisplayValue('Compras')).toBeTruthy();
    expect(screen.getByDisplayValue('Leche')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Cerrar' })).toBeTruthy();
    expect(notesRepository.listNotes()).toHaveLength(4);
  });
});
