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
  await fireEvent.press(screen.getByRole('button', { name: 'Create a note...' }));
  expect(screen.getByPlaceholderText('Title')).toBeTruthy();
}

async function closeComposer() {
  await fireEvent.press(screen.getByRole('button', { name: 'Close' }));
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
    expect(screen.getByRole('button', { name: 'Create a note...' })).toBeTruthy();
    expect(screen.queryByTestId('note-title')).toBeNull();

    await openComposer();
    await closeComposer();
    expect(notesRepository.listNotes()).toEqual([]);
    expect(screen.getByText('Create a note...')).toBeTruthy();
    expect(screen.queryByTestId('note-title')).toBeNull();

    await openComposer();
    await setInputValue(screen.getByPlaceholderText('Title'), '   \n');
    await setInputValue(screen.getByLabelText('Content'), ' \n\n  ');
    await closeComposer();
    expect(notesRepository.listNotes()).toEqual([]);

    await openComposer();
    await setInputValue(screen.getByPlaceholderText('Title'), 'Draft');
    await setInputValue(screen.getByLabelText('Content'), 'Text');
    await setInputValue(screen.getByPlaceholderText('Title'), '   ');
    await setInputValue(screen.getByLabelText('Content'), '\n');
    await closeComposer();
    expect(notesRepository.listNotes()).toEqual([]);
    expect(screen.queryByText('Draft')).toBeNull();

    await openComposer();
    await setInputValue(screen.getByPlaceholderText('Title'), '  Shopping  ');
    await setInputValue(screen.getByLabelText('Content'), '  milk\n bread  ');
    await closeComposer();

    expect(screen.getByText('Create a note...')).toBeTruthy();
    expect(screen.queryByPlaceholderText('Title')).toBeNull();
    expect(screen.getByTestId('note-title')).toHaveTextContent('Shopping');
    expect(screen.getByTestId('note-content')).toHaveTextContent('milk\n bread');

    const [saved] = notesRepository.listNotes();
    expect(notesRepository.listNotes()).toHaveLength(1);
    expect(saved).toMatchObject({
      title: 'Shopping',
      content: 'milk\n bread',
    });
    expect(saved?.createdAt).toBe(saved?.updatedAt);
    expect(saved?.createdAt).toEqual(expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/));
    expect(saved?.id).toEqual(expect.any(String));
    expect(saved?.id).not.toBe('Shopping');

    await openComposer();
    await setInputValue(screen.getByPlaceholderText('Title'), 'Title only');
    await closeComposer();

    await openComposer();
    await setInputValue(screen.getByLabelText('Content'), 'Text only');
    await closeComposer();

    const notes = notesRepository.listNotes();
    expect(notes).toHaveLength(3);
    expect(new Set(notes.map((note) => note.id)).size).toBe(3);
    expect(notes.find((note) => note.title === 'Title only')).toMatchObject({
      title: 'Title only',
      content: '',
    });
    expect(notes.find((note) => note.content === 'Text only')).toMatchObject({
      title: '',
      content: 'Text only',
    });

    const titles = screen.getAllByTestId('note-title');
    const contents = screen.getAllByTestId('note-content');
    expect(contents[0]).toHaveTextContent('Text only');
    expect(titles[1]).toHaveTextContent('Title only');
    expect(titles[2]).toHaveTextContent('Shopping');
    expect(contents[2]).toHaveTextContent('milk\n bread');

    await openComposer();
    await setInputValue(screen.getByPlaceholderText('Title'), 'Back');
    await act(async () => {
      router.back();
    });
    expect(screen.queryByPlaceholderText('Title')).toBeNull();
    expect(notesRepository.listNotes().map((note) => note.title)).toContain('Back');

    await openComposer();
    await setInputValue(screen.getByPlaceholderText('Title'), 'Shopping');
    await setInputValue(screen.getByLabelText('Content'), 'Milk');
    jest.spyOn(notesRepository, 'saveNote').mockImplementation(() => {
      throw new Error('save failed');
    });
    await closeComposer();

    expect(screen.getByDisplayValue('Shopping')).toBeTruthy();
    expect(screen.getByDisplayValue('Milk')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Close' })).toBeTruthy();
    expect(notesRepository.listNotes()).toHaveLength(4);
  });
});
