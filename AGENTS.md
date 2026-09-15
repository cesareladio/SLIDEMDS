# AGENTS.md

## Project overview
- **Type**: Vite + React 19 + TypeScript presentation app with 2D/3D scenes.
- **Runtime**: Browser SPA (no backend observed).
- **3D stack**: `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`.
- **Animation/UI stack**: `framer-motion`, `gsap`, `lucide-react`.

## Essential commands
From `package.json`:

```bash
npm run dev
```
- Starts Vite dev server.

```bash
npm run build
```
- Runs TypeScript project build (`tsc -b`) and then Vite production build.

```bash
npm run preview
```
- Serves built app with Vite preview.

## Repository structure
- `src/main.tsx`: React entrypoint, mounts `<App />`, imports global CSS.
- `src/app/`
  - `App.tsx`: scene composition and top-level layout (canvas, overlays, navigation, presenter mode).
  - `StoryContext.tsx`: global story state (scene index, autoplay, presenter mode, keyboard handlers).
- `src/scenes/*/index.tsx`: per-scene UI/content components.
- `src/three/`: Three.js/react-three-fiber rendering layer (`ExperienceCanvas`, globe, camera, particles, effects, world objects).
- `src/components/`: reusable UI wrappers and controls (`SceneShell`, `Navigation`, `ErrorBoundary`, etc.).
- `src/data/`: static content/state-driving data (story timeline, country/hub/capability data).
- `src/utils/math.ts`: small numeric helpers (`clamp`, etc.).
- `src/styles/global.css`: single global stylesheet with all scene/component styling.

## Architecture and flow
1. `main.tsx` renders `App` inside `StrictMode`.
2. `App.tsx` wraps the experience in `StoryProvider`.
3. `StoryContext` exposes `scene`, navigation actions, autoplay/presenter toggles, and elapsed time.
4. `App.tsx` selects current scene component from ordered `scenes` array using `scene` index.
5. `ExperienceCanvas` receives `scene` and gates/adjusts 3D elements based on active scene.
6. Scene text/content is largely data-backed (`src/data/story.ts`, capabilities/country datasets).

## Conventions and patterns observed
- **Component style**: function components with named exports in most files; `App` uses default export.
- **File naming**:
  - Components/scenes: PascalCase directories/files (e.g. `OpeningScene/index.tsx`, `ExperienceCanvas.tsx`).
  - Data/util files: lowercase (`story.ts`, `peru.ts`, `math.ts`).
- **State management**: React context + hooks (no Redux/Zustand observed).
- **Animation**: Framer Motion drives scene transitions and element entrance/exit.
- **3D scene switching**: booleans derived from numeric `scene` index control visibility/intensity.
- **Styling**: centralized global CSS classes; components rely on class names rather than CSS modules.
- **TypeScript style**: concise inline prop types are common (many one-line object type annotations).

## Input and controls (important behavior)
`StoryContext.tsx` binds keyboard shortcuts globally:
- `ArrowRight` or `Space`: next scene
- `ArrowLeft`: previous scene
- `a`: toggle autoplay
- `p`: toggle presenter mode
- `f`: toggle fullscreen
- `Escape`: exit presenter mode

When changing navigation/state behavior, update both context actions and any UI controls that depend on them.

## Data-driven story model
- `src/data/story.ts` defines ordered story metadata (`id`, `eyebrow`, `title`, `next`, `talkingPoints`) plus `sceneDurations`.
- `StoryContext` uses `sceneDurations[scene]` to schedule autoplay advancement.
- `App.tsx` uses a local `scenes` array order to map `scene` index to scene component.

**Gotcha**: these three must stay aligned:
1. `story` array order/length
2. `sceneDurations` order/length
3. `scenes` array in `App.tsx`

Any mismatch can cause wrong text, incorrect autoplay timing, or out-of-range scene behavior.

## 3D layer notes
- `ExperienceCanvas` configures camera, DPR, and fog/background centrally.
- `Globe.tsx` contains scene-gated visibility and per-frame rotations (`useFrame`).
- Geographic points are transformed via `latLonToVector3` (`src/three/Globe/geo.ts`).

When modifying 3D visuals, verify interactions with scene indices already used for visibility gating (e.g., globe visible for specific scenes only).

## Error handling and fallback
- `App.tsx` wraps the WebGL canvas in `ErrorBoundary` with `WebGLFallback` fallback UI.
- Preserve this boundary when refactoring canvas placement; it is the current resilience path for WebGL/runtime rendering failures.

## Testing/linting status
- No test scripts observed in `package.json`.
- No lint script/config observed in discovered top-level files.

For validation after code changes in this repo, current observable baseline is:
1. `npm run build` (type-check + production build)
2. manual run via `npm run dev` for behavior/visual checks

## Agent workflow recommendations for this repository
- Before scene-level changes, inspect:
  - `src/app/App.tsx`
  - `src/app/StoryContext.tsx`
  - target scene in `src/scenes/*/index.tsx`
  - related data file in `src/data/*`
- Before 3D changes, inspect:
  - `src/three/ExperienceCanvas.tsx`
  - target module under `src/three/*`
  - global styles if labels/overlays are involved.
- Keep class names and CSS selectors in sync with JSX className strings.
- Favor existing patterns: inline prop typing, Framer Motion transitions, scene-index-driven branching.

## Existing rule files
No existing agent/rule instruction files were found in:
- `.cursor/rules/*.md`
- `.cursorrules`
- `.github/copilot-instructions.md`
- `claude.md`
- `agents.md`
