export function ScrollAvatarVisual({ opacity }: { opacity: number }) {
  const clamped = Math.min(1, Math.max(0, opacity))
  const scale = .84 + clamped * .16
  return <div className="avatar-visual scroll-avatar-visual" style={{ opacity: clamped, transform: `scale(${scale})` }} aria-hidden="true">
    <i className="avatar-halo" />
    <i className="avatar-core" />
    <span className="avatar-wave avatar-wave-one" />
    <span className="avatar-wave avatar-wave-two" />
    <span className="avatar-wave avatar-wave-three" />
  </div>
}
