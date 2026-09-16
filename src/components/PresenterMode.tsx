import { motion } from 'framer-motion'
import { useScrollStory } from '../app/ScrollContext'
import { useStory } from '../app/StoryContext'

const meta = {
  opening: { title: 'DOS IDENTIDADES · UN SOLO EQUIPO', points: ['Presentación de Perú y Chile.', 'La experiencia comienza con una capacidad compartida.'] },
  earth: { title: 'DOS IDENTIDADES CONECTADAS', points: ['Selecciona Perú o Chile para explorar su historia.'] },
  country: { title: 'HUELLA · TALENTO · SUPERPODERES · CAMINO', points: ['La historia del país se despliega con el scroll.'] },
  convergence: { title: 'ONE GDN-e', points: ['Dos identidades. Un solo equipo.'] },
  ai: { title: 'PREPARANDO EL TALENTO PARA LO QUE VIENE', points: ['4,000 certificaciones IA.', '50% GH-300 del colectivo Perú.'] },
  ibiol: { title: 'NUESTRA AMBICIÓN PARA IBIOL', points: ['De capacidad disponible a crecimiento compartido.'] },
  closing: { title: 'DOS IDENTIDADES · UN SOLO EQUIPO · ONE GDN-e', points: ['La magia del sur.', 'Talento que enciende el futuro.', 'AI Everywhere.'] },
} as const

export function PresenterMode() {
  const { presenter, elapsed, selectedCountry } = useStory()
  const { chapter, chapterProgress } = useScrollStory()
  if (!presenter) return null
  const item = meta[chapter]
  const title = selectedCountry ? `${selectedCountry.toUpperCase()} · ${item.title}` : item.title
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const seconds = String(Math.floor(elapsed % 60)).padStart(2, '0')
  return <motion.aside className="presenter" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
    <div className="presenter-head"><span>MODO PRESENTADOR</span><time>{minutes}:{seconds}</time></div>
    <strong>{title}</strong><ul>{item.points.map(point => <li key={point}>{point}</li>)}</ul>
    <div className="presenter-next"><span>PROGRESO</span>{Math.round(chapterProgress * 100)}%</div>
  </motion.aside>
}
