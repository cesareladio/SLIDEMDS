import { useEffect, useState } from 'react'
import * as THREE from 'three'

export interface EarthTextureSet {
  day: THREE.Texture
  night: THREE.Texture
  normal: THREE.Texture
  specular: THREE.Texture
  clouds: THREE.Texture
}

const texturePaths = {
  day: '/textures/earth/earth_day.jpg',
  night: '/textures/earth/earth_night.png',
  normal: '/textures/earth/earth_normal.jpg',
  specular: '/textures/earth/earth_specular.jpg',
  clouds: '/textures/earth/earth_clouds.png',
}

export function useEarthTextures() {
  const [textures, setTextures] = useState<EarthTextureSet | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const loader = new THREE.TextureLoader()
    const keys = Object.keys(texturePaths) as (keyof typeof texturePaths)[]
    const loaded: Partial<EarthTextureSet> = {}
    let pending = keys.length
    let hasFailed = false

    keys.forEach(key => {
      loader.load(
        texturePaths[key],
        texture => {
          if (cancelled) return
          texture.colorSpace = key === 'day' || key === 'night' || key === 'clouds' ? THREE.SRGBColorSpace : THREE.NoColorSpace
          texture.anisotropy = 4
          loaded[key] = texture
          pending--
          if (pending === 0 && !hasFailed) setTextures(loaded as EarthTextureSet)
        },
        undefined,
        () => {
          hasFailed = true
          if (!cancelled) setFailed(true)
        },
      )
    })

    return () => { cancelled = true }
  }, [])

  return { textures, failed }
}
