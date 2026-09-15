import { AnimatePresence, motion } from 'framer-motion'
import type { AvatarDialogueLine } from '../../data/avatar'

export function AvatarDialogue({ line, onAdvance }: { line?: AvatarDialogueLine; onAdvance: () => void }) {
  return <AnimatePresence mode="wait">
    {line && <motion.div className="avatar-dialogue" key={`${line.speaker}-${line.text}`} initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -8, filter: 'blur(5px)' }} transition={{ duration: .42 }}>
      <span>{line.speaker}</span>
      <p>{line.text}</p>
      <button onClick={onAdvance} aria-label="Avanzar diálogo de B2">CONTINUAR</button>
    </motion.div>}
  </AnimatePresence>
}
