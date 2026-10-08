# Keep

On-device notes for iOS and Android. The app is a React Native project on Expo's managed workflow, with one codebase for both platforms. Notes stay on the device in MMKV. There is no backend.

## Stack

- Expo SDK 57 (managed workflow), Expo Router, and TypeScript
- React Native Reusables on NativeWind 4 (Tailwind classes)
- `react-native-mmkv` for on-device storage
- Jest (`jest-expo`) and React Native Testing Library
- ESLint and Prettier
- GitHub Actions on Ubuntu for lint, typecheck, and tests (`pnpm install --frozen-lockfile`)

## Prerequisites

- Node.js 22
- pnpm 10 (`package.json` pins `pnpm@10.33.3`)
- Xcode, for the iOS simulator
- Android Studio with an emulator, for Android

## Expo Go is not supported

This app does not run in Expo Go. `react-native-mmkv` ships native code, and Expo Go does not include that module. Use a development build on the iOS simulator or the Android emulator.

## Install

```bash
pnpm install
```

## Run a development build

The first build compiles the native app, including `expo-dev-client`, and takes several minutes. Later launches reuse that build.

### iOS simulator

```bash
pnpm exec expo run:ios
```

### Android emulator

Start an emulator, then:

```bash
pnpm exec expo run:android
```

After the development build is installed, `pnpm start` opens the Metro bundler for that build.

## Local checks

```bash
pnpm run lint
pnpm run typecheck
pnpm test
pnpm run format
```

`typecheck` is `tsc --noEmit`. `format` rewrites files with Prettier and is not part of CI. CI does not compile the native iOS or Android apps.

## Project layout

- `app/index.tsx` is the provisional home screen at `/`.
- `components/ui/text.tsx` is the React Native Reusables `Text` component used by that screen.
- `src/types/Note.ts` defines a note: `id`, `title`, `content`, `createdAt`, and `updatedAt`, all strings. Timestamps are ISO-8601.
- `src/storage/notesRepository.ts` is the only place that talks to MMKV. It lists, saves, and deletes notes stored as one JSON array. Callers pass a complete note; the repository does not create ids or timestamps.

Missing or corrupt storage (absent key, invalid JSON, a non-array, or any element that is not an object with those five string fields) makes `listNotes` return an empty list. It does not throw, and it does not keep the valid items from a bad payload.
