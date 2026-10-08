jest.mock('@/global.css', () => ({}));

// Dismissing the new-note form sheet more than once makes the test renderer's
// unmount walk loop. Skip the automatic cleanup and let the process exit.
process.env.RNTL_SKIP_AUTO_CLEANUP = 'true';

const mockStores = new Map();

jest.mock('react-native-mmkv', () => ({
  createMMKV: (configuration) => {
    const id = configuration?.id ?? 'mmkv.default';
    let storage = mockStores.get(id);
    if (!storage) {
      storage = new Map();
      mockStores.set(id, storage);
    }

    return {
      set: (key, value) => {
        storage.set(key, value);
      },
      getString: (key) => {
        const value = storage.get(key);
        return typeof value === 'string' ? value : undefined;
      },
      remove: (key) => storage.delete(key),
      clearAll: () => {
        storage.clear();
      },
    };
  },
}));
