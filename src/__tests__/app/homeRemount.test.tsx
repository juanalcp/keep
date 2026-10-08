import { createMMKV } from 'react-native-mmkv';

import { renderRouter, screen } from 'expo-router/testing-library';

import { saveNote } from '@/src/storage/notesRepository';

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

describe('HomeScreen remount', () => {
  beforeEach(() => {
    createMMKV().clearAll();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows a note that was already stored when the screen mounts again', async () => {
    saveNote({
      id: 'stored-note',
      title: 'Shopping',
      content: 'milk\n bread',
      createdAt: '2026-10-08T12:00:00.000Z',
      updatedAt: '2026-10-08T12:00:00.000Z',
    });

    await renderRouter('./app', { initialUrl: '/' });
    jest.useRealTimers();

    expect(screen.getByText('Keep')).toBeTruthy();
    expect(screen.getByTestId('note-title')).toHaveTextContent('Shopping');
    expect(screen.getByTestId('note-content')).toHaveTextContent('milk\n bread');
  });
});
