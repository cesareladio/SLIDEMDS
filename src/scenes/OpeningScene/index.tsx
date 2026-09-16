import { useScrollStory } from '../../app/ScrollContext'
import { fadeWindow, rangeProgress } from '../../utils/scrollMotion'

function scrollText(p: number, start: number, end: number): React.CSSProperties {
  const op = fadeWindow(p, start, start + .08, end - .08, end)
  const y  = op < 0.01 ? 14 : (1 - op) * 14
  const bl = op < 0.99 ? `blur(${(1 - op) * 7}px)` : 'none'
  return { opacity: op, transform: `translateY(${y}px)`, filter: bl, willChange: 'opacity, transform, filter' }
}

export function OpeningScene() {
  const { chapter, chapterProgress: progress } = useScrollStory()
  const isOpening = chapter === 'opening' || chapter === 'earth'
  if (!isOpening) return null

  // eyebrow fades in from 0.12
  const eyebrowOp = rangeProgress(progress, 0.12, 0.24)

  // beats: 0-0.15 earth only, 0.15-0.32 identidades, 0.32-0.48 paises, 0.48-0.66 equipo, 0.66-0.84 combined, 0.84-1.0 onegdne
  const showIdentidades = progress >= 0.13 && progress < 0.44
  const showPaises      = progress >= 0.30 && progress < 0.60
  const showEquipo      = progress >= 0.46 && progress < 0.76
  const showCombined    = progress >= 0.64 && progress < 0.90
  const showOneGDNe     = progress >= 0.82

  // overlay opacity for the full scene: fade-out when leaving
  const sceneOp = chapter === 'earth' ? fadeWindow(0, 0, 1, 0, 0) : 1

  return (
    <section className="scene opening-scene" style={{ opacity: sceneOp }}>
      <div className="scene-copy opening-copy">
        <p className="eyebrow" style={{ opacity: eyebrowOp, transition: 'none' }}>GDN-e</p>

        <div style={{ position: 'relative', minHeight: 140 }}>
          {showIdentidades && (
            <div className="opening-beat" style={{ position: 'absolute', ...scrollText(progress, 0.13, 0.44) }}>
              <h1 className="opening-beat-h1">DOS<br />IDENTIDADES</h1>
            </div>
          )}
          {showPaises && (
            <div className="opening-beat" style={{ position: 'absolute', ...scrollText(progress, 0.30, 0.60) }}>
              <h1 className="opening-beat-h1">PERÚ <em>×</em> CHILE</h1>
              <p className="opening-sub">Talento que conecta el sur con el mundo</p>
            </div>
          )}
          {showEquipo && (
            <div className="opening-beat" style={{ position: 'absolute', ...scrollText(progress, 0.46, 0.76) }}>
              <h1 className="opening-beat-h1">UN SOLO<br />EQUIPO</h1>
            </div>
          )}
          {showCombined && (
            <div className="opening-beat" style={{ position: 'absolute', ...scrollText(progress, 0.64, 0.90) }}>
              <h1 className="opening-beat-h1">DOS IDENTIDADES<br /><em>UN SOLO EQUIPO</em></h1>
            </div>
          )}
          {showOneGDNe && (
            <div className="opening-beat" style={{ position: 'absolute', ...scrollText(progress, 0.82, 1.05) }}>
              <p className="opening-one-eyebrow">ONE GDN-e</p>
              <h1 className="opening-beat-h1">DOS IDENTIDADES<br /><em>UN SOLO EQUIPO</em></h1>
              <p className="opening-sub" style={{ marginTop: 12, letterSpacing: '.3em', fontSize: 10, color: 'var(--cyan)' }}>↓ CONTINÚA</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
