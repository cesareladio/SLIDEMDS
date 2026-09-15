# GDN-e Perú × Chile Experience

Experiencia ejecutiva inmersiva para comunicar la capacidad conjunta de GDN-e Perú y Chile a CEO, directores y partners. Combina narrativa editorial, visualización de datos y una capa Three.js persistente.

## Arquitectura

- **React + Vite + TypeScript** para escenas, navegación y contenido editorial.
- **React Three Fiber / Drei** para globo, constelaciones, partículas, trayectorias y redes espaciales.
- **Framer Motion** para tipografía, overlays y transiciones de interfaz.
- **GSAP** para transiciones de cámara deliberadas.
- `src/app/StoryContext.tsx` concentra estado de escena, autoplay, Presenter Mode y estados interactivos.
- `src/three/ExperienceCanvas.tsx` mantiene el canvas persistente durante toda la experiencia.

## Escenas

1. **Opening** — unión Perú × Chile y presentación de B2.
2. **Footprint** — personas, territorios y hubs operativos de Perú.
3. **People** — composición, liderazgo y progresión del talento.
4. **Superpowers** — constelación 3D de capacidades con fly-to para Back-End, Testing y SAP.
5. **IA / Skilling** — morph de partículas: 4,000 → 50% → conceptos de talento.
6. **Journey** — viaje espacial por el crecimiento 2016–2026.
7. **IBIOL** — estrategia TODAY → GROW → ASK.
8. **Closing** — cierre de complementariedad con B2.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` ejecuta el chequeo TypeScript y genera el build de producción.

## Controles

| Control | Acción |
| --- | --- |
| `ArrowRight` / `Space` | Siguiente escena |
| `ArrowLeft` | Escena anterior |
| `A` | Activar/desactivar autoplay |
| `P` | Activar/desactivar Presenter Mode |
| `F` | Alternar pantalla completa |
| `Esc` | Salir de Presenter Mode |

Presenter Mode muestra talking points, escena actual, siguiente paso y cronómetro.

## Datos y contenido

- **Perú:** `src/data/peru.ts`
- **Chile:** `src/data/chile.ts`
- **Capacidades:** `src/data/capabilityConstellation.ts`
- **Historia / Journey:** `src/data/history.ts` y `src/data/journeyPath.ts`
- **IBIOL:** `src/data/ibiol.ts`
- **B2:** `src/data/avatar.ts`
- **Narrativa y talking points:** `src/data/story.ts`

Los datos de Perú contienen las capacidades, hubs y métricas actualmente utilizadas por la experiencia. Los elementos marcados como demo, placeholders o pendientes de validación —especialmente hitos de negocio y algunos contenidos de Chile— deben validarse antes de una presentación externa.

## Integrar un avatar real

B2 está aislada en `src/components/AvatarOverlay/`:

- `AvatarOverlay.tsx` controla momento, autoplay y reset por escena.
- `AvatarDialogue.tsx` renderiza diálogo accesible en DOM.
- `AvatarVisual.tsx` es el placeholder holográfico reemplazable.

Para integrar un avatar real, sustituye `AvatarVisual.tsx` por el renderer o reproductor correspondiente. Los diálogos ya soportan `audioUrl?: string` en `src/data/avatar.ts`; no se carga audio en la versión actual.
