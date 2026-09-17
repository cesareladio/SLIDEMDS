// Shared prelude state — used by Globe.tsx (drives it) and OpeningScene.tsx (reads it)
export const openingPreludeState = {
  progress: 0,     // 0–1, clock-based within prelude
  done: false,     // true once prelude completes
}
