# AGENTS.md

Guide for agents working on Keep. Read it before changing code, opening a pull request, or marking a task done.

## Language

Write identifiers, comments, user-facing copy, accessibility labels, placeholders, and strings in tests in English. Keep library names, product names, and protocol terms as they are.

## What the project is

Keep is an on-device notes app for iOS and Android. It is a React Native project on Expo's managed workflow, with one codebase for both platforms. Notes live in MMKV. There is no backend, no accounts, and no sync.

## Stack

- Expo SDK 57 (managed workflow), Expo Router, and TypeScript (`strict`)
- React 19.2 and React Native 0.86
- React Native Reusables on NativeWind 4 (Tailwind classes). `components.json` uses the `new-york` style, `neutral` base color, and CSS variables
- `react-native-mmkv` (and `react-native-nitro-modules`) for local storage
- Jest (`jest-expo`) and React Native Testing Library
- ESLint (`eslint-config-expo` + Prettier) and Prettier (`printWidth` 100, single quotes, Tailwind plugin)
- GitHub Actions on Ubuntu: lint, typecheck, and tests with `pnpm install --frozen-lockfile`
- Pinned package manager: `pnpm@10.33.3`. Node.js 22

TypeScript alias: `@/*` points at the repo root.

## Expo Go is not supported

The app does not run in Expo Go. `react-native-mmkv` includes native code, and Expo Go does not ship that module. On a device or simulator, use a development build (`expo-dev-client`).

Web (`pnpm run web`) does start in the browser with Metro. Use it to review the interface. The notes repository still depends on MMKV and is not the store for the web build.

## Commands

```bash
pnpm install
pnpm start                  # Metro for an already installed development build
pnpm exec expo run:ios      # iOS simulator (the first run compiles native code)
pnpm exec expo run:android  # Android emulator that is already running
pnpm run web                # Metro on web: http://localhost:8081
pnpm run lint
pnpm run typecheck          # tsc --noEmit
pnpm test
pnpm run format             # rewrites with Prettier; not part of CI
```

CI (`.github/workflows/ci.yml`) runs on `push` to `main` and on pull requests: frozen install, lint, typecheck, and tests. CI does not compile the native iOS or Android apps.

## Structure

- `app/index.tsx` — home screen at `/`. Header «Keep», a "Create a note..." control, and a newest-first list. An empty list has no empty-state message.
- `app/new-note.tsx` — form sheet for writing a note. Dismissing it saves the note when the title or the body has text.
- `app/_layout.tsx` — root layout: global CSS, navigation theme, status bar, headerless stack, and `PortalHost`. The new-note route is a form sheet. On native, the color scheme follows the system. On web, only a real `light` or `dark` value from `Appearance` is applied, because NativeWind's `system` mode removes the `dark` class.
- `app/+not-found.tsx` — unknown route: «This screen does not exist.» and a link to `/`.
- `app/+html.tsx` — root HTML for web only (viewport and scroll reset).
- `components/notes-list.tsx` — newest-first list of saved notes.
- `components/ui/text.tsx` — React Native Reusables `Text` (type variants and accessibility roles).
- `components/ui/button.tsx` — `Button` with variants and sizes.
- `components/ui/input.tsx` and `components/ui/textarea.tsx` — fields used by the note composer.
- `components/ui/icon.tsx` — Lucide icons with a NativeWind `className`.
- `lib/theme.ts` — light/dark tokens and `NAV_THEME` for React Navigation.
- `lib/utils.ts` — `cn` (`clsx` + `tailwind-merge`).
- `global.css` — Tailwind color variables for light and dark.
- `src/types/Note.ts` — a note: `id`, `title`, `content`, `createdAt`, and `updatedAt`, all `string`. Dates are ISO-8601.
- `src/notes/newNote.ts` — builds a note from a draft and commits it. The caller does not import MMKV.
- `src/notes/notesNewestFirst.ts` — orders notes newest first.
- `src/storage/notesRepository.ts` — the only place that talks to MMKV.
- `src/__tests__/app/index.test.tsx` — home shows «Keep» and creating a note from the composer.
- `src/__tests__/app/homeRemount.test.tsx` — a stored note is visible when home mounts again.
- `src/__tests__/notes/newNote.test.ts` — draft trimming, commit, and newest-first order.
- `src/__tests__/storage/notesRepository.test.ts` — list, save, replace, delete, and corrupt storage.
- `jest.setup.js` — in-memory mock of `createMMKV`.

## Storage

`notesRepository` stores every note as one JSON array under the key `notes`.

- `listNotes()` returns the array.
- `saveNote(note)` inserts or replaces by `id`. The caller passes the complete note. The repository does not generate ids or dates.
- `deleteNote(id)` removes that note. If the id does not exist, it does not write. If the payload is corrupt and the id does not exist, it leaves the raw value as it was.

If the key is missing, the JSON is invalid, the value is not an array, or any element is not an object with those five string fields, `listNotes` returns an empty list. It does not throw. It does not keep the valid items from a mixed payload.

## Browser checks (required)

Any change to the interface, layout, styles, routes, client state, or rendered data is tested in the browser **with the window in mobile size** before the work is done. A Jest test does not replace this check.

1. Start the web app with `pnpm run web` and open `http://localhost:8081`.
2. Set the browser window to phone size (a viewport width of about 390 px, for example 390×844). A full desktop screenshot is not enough.
3. Walk the affected flow the way someone on a phone would: tap, type, submit, and navigate. Also check routes that share the touched state or components, the empty state, and the error state (including an unknown route).
4. Confirm that the «Keep» header, the background, and the content area read at that width, with no horizontal overflow.

## Pull request illustrations

The pull request body has to show that mobile check. Include at least:

- a screenshot of the browser window at mobile size with the affected screen visible, and
- a short recording of the same flow in that mobile window when there is interaction (navigation, forms, or state changes).

Reference the files with HTML image or video tags and a caption that says the window was in mobile size. Do not upload wide desktop screenshots, install logs, or a failed attempt.
