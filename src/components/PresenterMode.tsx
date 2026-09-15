import { motion } from 'framer-motion'
import { story } from '../data/story'
import { useStory } from '../app/StoryContext'

export function PresenterMode() {
  const { scene, elapsed, presenter } = useStory()
  if (!presenter) return null
  const item = story[scene]
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const seconds = String(Math.floor(elapsed % 60)).padStart(2, '0')
  return <motion.aside className="presenter" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
    <div className="presenter-head"><span>MODO PRESENTADOR</span><time>{minutes}:{seconds}</time></div>
    <strong>{item.title}</strong>
    <ul>{item.talkingPoints.map(point => <li key={point}>{point}</li>)}</ul>
    <div className="presenter-next"><span>SIGUIENTE</span>{item.next}</div>
  </motion.aside>
}
