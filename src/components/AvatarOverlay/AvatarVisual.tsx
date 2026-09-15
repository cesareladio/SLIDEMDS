import { motion } from 'framer-motion'

export function AvatarVisual({ active }: { active: boolean }) {
  return <motion.div className="avatar-visual" initial={{ opacity: 0, scale: .72 }} animate={{ opacity: active ? 1 : 0, scale: active ? 1 : .72 }} transition={{ duration: .7, ease: 'easeOut' }} aria-hidden="true">
    <i className="avatar-halo" />
    <i className="avatar-core" />
    <span className="avatar-wave avatar-wave-one" />
    <span className="avatar-wave avatar-wave-two" />
    <span className="avatar-wave avatar-wave-three" />
  </motion.div>
}
