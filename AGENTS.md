# AGENTS.md

Guía para agentes que trabajan en Keep. Léela antes de cambiar código, abrir un pull request o dar una tarea por terminada.

## Qué es el proyecto

Keep es una app de notas en el dispositivo para iOS y Android. Es un proyecto React Native en el flujo gestionado de Expo, con un solo código para ambas plataformas. Las notas viven en MMKV. No hay backend, cuentas ni sincronización.

## Stack

- Expo SDK 57 (managed workflow), Expo Router y TypeScript (`strict`)
- React 19.2 y React Native 0.86
- React Native Reusables sobre NativeWind 4 (clases de Tailwind). `components.json` usa el estilo `new-york`, color base `neutral` y variables CSS
- `react-native-mmkv` (y `react-native-nitro-modules`) para el almacenamiento local
- Jest (`jest-expo`) y React Native Testing Library
- ESLint (`eslint-config-expo` + Prettier) y Prettier (`printWidth` 100, comillas simples, plugin de Tailwind)
- GitHub Actions en Ubuntu: lint, typecheck y tests con `pnpm install --frozen-lockfile`
- Gestor de paquetes fijado: `pnpm@10.33.3`. Node.js 22

Alias de TypeScript: `@/*` apunta a la raíz del repo.

## Expo Go no está soportado

La app no corre en Expo Go. `react-native-mmkv` incluye código nativo y Expo Go no trae ese módulo. En dispositivo o simulador hay que usar un development build (`expo-dev-client`).

La web (`pnpm run web`) sí arranca en el navegador con Metro. Sirve para revisar la interfaz. El repositorio de notas sigue dependiendo de MMKV y no es el almacén de la versión web.

## Comandos

```bash
pnpm install
pnpm start                  # Metro para un development build ya instalado
pnpm exec expo run:ios      # simulador iOS (primera vez compila nativo)
pnpm exec expo run:android  # emulador Android ya iniciado
pnpm run web                # Metro en web: http://localhost:8081
pnpm run lint
pnpm run typecheck          # tsc --noEmit
pnpm test
pnpm run format             # reescribe con Prettier; no forma parte de CI
```

CI (`.github/workflows/ci.yml`) corre en `push` a `main` y en pull requests: install congelado, lint, typecheck y tests. CI no compila las apps nativas de iOS ni Android.

## Estructura

- `app/index.tsx` — pantalla de inicio provisional en `/`. Cabecera «Keep» y un área de notas vacía. No hay botones ni texto de estado vacío.
- `app/_layout.tsx` — layout raíz: CSS global, tema de navegación, barra de estado, stack sin cabecera y `PortalHost`. En nativo el esquema de color sigue al sistema. En web solo aplica `light` o `dark` reales de `Appearance`, porque el modo `system` de NativeWind quita la clase `dark`.
- `app/+not-found.tsx` — ruta desconocida: «This screen does not exist.» y un enlace a `/`.
- `app/+html.tsx` — HTML raíz solo para web (viewport y reset de scroll).
- `components/ui/text.tsx` — `Text` de React Native Reusables (variantes tipográficas y roles de accesibilidad).
- `components/ui/button.tsx` — `Button` con variantes y tamaños. La pantalla de inicio todavía no lo usa.
- `components/ui/icon.tsx` — iconos Lucide con `className` de NativeWind.
- `lib/theme.ts` — tokens claro/oscuro y `NAV_THEME` para React Navigation.
- `lib/utils.ts` — `cn` (`clsx` + `tailwind-merge`).
- `global.css` — variables de color de Tailwind para claro y oscuro.
- `src/types/Note.ts` — una nota: `id`, `title`, `content`, `createdAt` y `updatedAt`, todos `string`. Las fechas son ISO-8601.
- `src/storage/notesRepository.ts` — único sitio que habla con MMKV.
- `src/__tests__/app/index.test.tsx` — la home muestra «Keep» y ningún botón ni mensaje de vacío.
- `src/__tests__/storage/notesRepository.test.ts` — listar, guardar, reemplazar, borrar y almacenamiento corrupto.
- `jest.setup.js` — mock en memoria de `createMMKV`.

## Almacenamiento

`notesRepository` guarda todas las notas como un único array JSON bajo la clave `notes`.

- `listNotes()` devuelve el array.
- `saveNote(note)` inserta o reemplaza por `id`. El llamador pasa la nota completa. El repositorio no genera ids ni fechas.
- `deleteNote(id)` quita esa nota. Si el id no existe, no escribe. Si el payload está corrupto y el id no existe, deja el valor crudo como estaba.

Si falta la clave, el JSON es inválido, el valor no es un array o algún elemento no es un objeto con esos cinco campos de tipo string, `listNotes` devuelve una lista vacía. No lanza. No conserva los elementos válidos de un payload mezclado.

## Pruebas en el navegador (obligatorias)

Cualquier cambio de interfaz, layout, estilos, rutas, estado de cliente o datos renderizados se prueba en el navegador **con la ventana en modo móvil** antes de dar el trabajo por hecho. Un test de Jest no sustituye esta prueba.

1. Arranca la web con `pnpm run web` y abre `http://localhost:8081`.
2. Pon la ventana del navegador en tamaño de teléfono (anchura de viewport de unos 390 px, por ejemplo 390×844). Una ventana de escritorio ancha no sirve para esta prueba.
3. Recorre el flujo afectado como lo haría alguien en el móvil: tocar, escribir, enviar y navegar. Comprueba también las rutas que comparten el estado o los componentes tocados, el estado vacío y el de error (incluida una ruta inexistente).
4. Confirma que la cabecera «Keep», el fondo y el área de contenido se leen en esa anchura, sin desbordes horizontales.

## Pull requests

Describe el cambio y la prueba en texto. No incluyas imágenes, capturas, grabaciones ni etiquetas HTML de imagen o vídeo en el cuerpo del pull request. Esa evidencia alarga el trabajo y no forma parte de la entrega.
