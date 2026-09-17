import { motion } from 'framer-motion'
import { useStory } from '../app/StoryContext'
import { useScrollStory } from '../app/ScrollContext'
import { countryFromChapter } from '../data/countryScroll'
import type { ScrollChapter } from '../app/ScrollContext'

const meta: Record<ScrollChapter, { title: string; points: string[] }> = {
  opening: { title: 'DOS IDENTIDADES · UN SOLO EQUIPO', points: ['Presentación de Perú y Chile.', 'La experiencia comienza.'] },
  earth: { title: 'DOS PAÍSES · UNA CAPACIDAD', points: ['El planeta conecta Perú y Chile.'] },
  peru: { title: 'PERÚ · HUELLA · TALENTO · CAPACIDADES · HISTORIA', points: ['1,408 personas en Perú.', 'Back-End, Testing y SAP a escala.', '2016 Trujillo → 2023 Arequipa.'] },
  chile: { title: 'CHILE · HUELLA · TALENTO · CAPACIDADES · CERTIFICACIONES · HISTORIA', points: ['609 personas bajo gestión.', 'La Araucanía · Biobío: 72% del HC.', 'Back-End, Data, Quality, Front-End.'] },
  convergence: { title: 'ONE GDN-e', points: ['Dos identidades. Un solo equipo.'] },
  ai: { title: 'CERTIFICACIONES Y UPSKILLING · PERÚ', points: ['860 certificaciones hoy → 1,500 proyección Q3.', '3 rutas de upskilling: Data · Backend · Frontend.', '150 certificaciones estratégicas FY26.'] },
  ibiol: { title: 'NUESTRA AMBICIÓN PARA IBIOL', points: ['De capacidad disponible a crecimiento compartido.'] },
  closing: { title: 'DOS IDENTIDADES · UN SOLO EQUIPO · ONE GDN-e', points: ['La magia del sur.', 'Talento que enciende el futuro.', 'AI Everywhere.'] },
}

export function PresenterMode() {
  const { presenter, elapsed } = useStory()
  const { chapter, chapterProgress } = useScrollStory()
  if (!presenter) return null
  const item = meta[chapter] ?? meta.opening
  // peru/chile titles already include the country name — no double-prefix.
  const title = item.title
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const seconds = String(Math.floor(elapsed % 60)).padStart(2, '0')
  return <motion.aside className="presenter" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
    <div className="presenter-head"><span>MODO PRESENTADOR</span><time>{minutes}:{seconds}</time></div>
    <strong>{title}</strong>
    <ul>{item.points.map(point => <li key={point}>{point}</li>)}</ul>
    <div className="presenter-next"><span>PROGRESO</span>{Math.round(chapterProgress * 100)}%</div>
  </motion.aside>
}
