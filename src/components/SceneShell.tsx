import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function SceneShell({ eyebrow, title, align = 'left', children, className = '' }: { eyebrow: string; title?: string; align?: 'left' | 'center' | 'right'; children: ReactNode; className?: string }) {
  return <motion.section className={`scene scene-${align} ${className}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .7 }}>
    <div className="scene-copy">
      <motion.p className="eyebrow" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .18 }}>{eyebrow}</motion.p>
      {title && <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3, duration: .8 }}>{title}</motion.h1>}
      {children}
    </div>
  </motion.section>
}

export const stagger = {
  hidden: {}, show: { transition: { staggerChildren: .15, delayChildren: .55 } },
}
export const rise = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: .65 } } }
