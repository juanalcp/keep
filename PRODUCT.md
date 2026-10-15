# Product

<!-- impeccable:product-schema 1 -->

## Platform

ios

## Users

People who want a quick personal note, the way they use Google Keep: a reminder, a list, or a thought, captured on their own phone and found again later.

Assumption: one person, one device. Nothing in the brief or the repository describes sharing, multiple accounts, or a team.

A second audience is the colleagues this repository is for. Keep is also a demo of agentic development, so the project has to stay readable as a codebase, not only as an app.

## Product Purpose

Fast capture and organisation of personal notes: pinning, colours, labels, search, archive, trash, and checklists.

What exists today is capture. Home lists saved notes newest first in a two-column masonry. A form sheet writes a note and saves it on dismiss when the title or the body has text. An empty draft is dropped. Success, for the slice that ships, is a note stored on the device without an account.

Pinning, colours, labels, search, archive, trash, and checklists are the purpose the brief names. They are not in the app yet. Future work should not describe them as if the screens already do them.

## Positioning

Keep is a Google Keep-style notes app that never leaves the device. There is no backend, no account, and no sync. A neighbouring cloud notes app cannot truthfully claim that.

Assumption: matching Google Keep's jobs matters more than matching its pixels. The visual system in `DESIGN.md` is the one already in the code.

## Operating Context

The note is written on an iPhone, often one-handed, and dismissed to save. The home screen is the index. The composer is a form sheet, not a separate account or editor product.

The repository also runs an Android build and a web Metro bundle used to review the interface. Assumption: those are implementation and review paths. The design target of this record is iOS.

Notes are a single JSON array in MMKV under the key `notes`. The web bundle does not use that store.

## Capabilities and Constraints

Confirmed in the code:

- A note is `id`, `title`, `content`, `createdAt`, and `updatedAt`, all strings. Dates are ISO-8601.
- `notesRepository` is the only module that talks to MMKV. Callers pass a complete note. The repository does not mint ids or dates.
- Corrupt or missing storage yields an empty list. It does not throw, and it does not keep the valid items from a mixed payload.
- There is no network, no login, and no sync.
- Expo Go is not supported. `react-native-mmkv` needs a development build.

Named in the brief and not built yet: pinning, note colours, labels, search, archive, trash, and checklists. Treat each as undecided in its interaction details until a task specifies it.

The home empty state currently reads «Las notas que añadas aparecerán aquí». The rest of the interface is English, and the repository rule is English copy. Assumption: English is the product language; that Spanish sentence is drift, not a second locale.

## Brand Commitments

The product name is Keep. The voice on the shipping screens is short and literal: «Keep», «Create a note...», «Title», «Close», «This screen does not exist.», «Go to home screen!».

No logo, wordmark file, or binding visual identity was provided beyond that name and the neutral interface already implemented.

## Evidence on Hand

- `app/index.tsx`, `app/new-note.tsx`, and `app/+not-found.tsx` are the shipping screens.
- `global.css`, `lib/theme.ts`, and `tailwind.config.js` are the tokens.
- `src/__tests__/` covers the repository, creating a note, the masonry list, and a stored note showing up when home mounts again.
- No customer quotes, usage numbers, or press exist. Do not invent them.

## Product Principles

1. Capture beats organisation. Saving on dismiss is the behaviour to protect.
2. The note stays on the device. Do not add an account or a backend to make a screen easier.
3. Unbuilt Keep features stay unnamed in the UI until they exist.
4. The demo has to stay legible. One repository, tests, and CI that a colleague can follow.
5. Say what the screen does. Controls use the words already on them.

## Accessibility & Inclusion

The app follows the system light and dark appearance. The composer names its title and content fields.

Assumption: no WCAG level, Dynamic Type size, or VoiceOver script was required. Those remain open. Do not claim a conformance level that was never set.
