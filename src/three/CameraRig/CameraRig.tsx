import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'

const positions = [
  [0, .15, 8.5], [1.05, .1, 6.3], [.3, .2, 7.4], [0, 0, 7.1], [0, 0, 9.5], [-1.6, .1, 7.5], [0, -.2, 8.6], [0, .1, 8.2],
]

export function CameraRig({ scene }: { scene: number }) {
  const { camera } = useThree()
  useEffect(() => {
    const target = positions[scene] ?? positions[0]
    const tween = gsap.to(camera.position, { x: target[0], y: target[1], z: target[2], duration: 2.2, ease: 'power3.inOut', onUpdate: () => camera.lookAt(0, 0, 0) })
    return () => { tween.kill() }
  }, [camera, scene])
  return null
}
