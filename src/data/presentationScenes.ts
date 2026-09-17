import type { ScrollChapter } from '../app/ScrollContext'

export type TransitionType = 'poster' | 'editorial' | 'cinematic'
export interface PresentationScene { id: string; index: number; chapter: ScrollChapter; progress: number; label: string; transitionType: TransitionType }

const sceneDefinitions: Array<[string, ScrollChapter, number, string, TransitionType]> = [
  ['opening-identities','opening',.25,'DOS IDENTIDADES · UN SOLO EQUIPO','poster'],['earth-hub','earth',.50,'PERÚ × CHILE','cinematic'],
  ['peru-intro','peru',.12,'PERÚ · INTRO','cinematic'],['peru-footprint','peru',.28,'PERÚ · HUELLA','editorial'],['peru-talent','peru',.48,'PERÚ · TALENTO','editorial'],['peru-capabilities','peru',.68,'PERÚ · CAPACIDADES','editorial'],['peru-history','peru',.89,'PERÚ · HISTORIA','editorial'],
  ['chile-scale','chile',.10,'CHILE · ESCALA','cinematic'],['chile-footprint','chile',.24,'CHILE · HUELLA','editorial'],['chile-talent','chile',.40,'CHILE · TALENTO','editorial'],['chile-capabilities','chile',.56,'CHILE · CAPACIDADES','editorial'],['chile-certifications','chile',.72,'CHILE · CERTIFICACIONES','editorial'],['chile-history','chile',.98,'CHILE · HISTORIA','editorial'],
  ['convergence-identities','convergence',.46,'DOS IDENTIDADES','cinematic'],['convergence-team','convergence',.67,'UN SOLO EQUIPO','poster'],['convergence-one','convergence',.88,'ONE GDN-e','poster'],
  ['ai-certifications','ai',.32,'PERÚ · CERTIFICACIONES','cinematic'],['ai-upskilling','ai',.68,'PERÚ · UPSKILLING','editorial'],['ai-ecosystem','ai',.92,'SKILLING · CERTIFICACIÓN · UPSKILLING','editorial'],
  ['ibiol-today','ibiol',.25,'IBIOL · HOY','cinematic'],['ibiol-grow','ibiol',.52,'IBIOL · CRECER','editorial'],['ibiol-accelerate','ibiol',.76,'IBIOL · ACELERAR','editorial'],['ibiol-final','ibiol',.94,'IBIOL · FINAL','cinematic'],
  ['closing-chile','closing',.15,'CHILE','cinematic'],['closing-peru','closing',.34,'PERÚ','editorial'],['closing-pair','closing',.47,'PERÚ + CHILE','editorial'],['closing-identities','closing',.58,'DOS IDENTIDADES','poster'],['closing-team','closing',.69,'UN SOLO EQUIPO','poster'],['closing-one','closing',.89,'ONE GDN-e','cinematic'],['closing-ntt','closing',.955,'NTT DATA','poster'],['closing-everywhere','closing',.995,'AI EVERYWHERE','poster'],
]

export const presentationScenes: PresentationScene[] = sceneDefinitions.map(([id, chapter, progress, label, transitionType], index) => ({ id, index, chapter, progress, label, transitionType }))

export function getSceneScrollTarget(scene: PresentationScene) {
  const chapter = document.querySelector<HTMLElement>(`[data-chapter="${scene.chapter}"]`)
  if (!chapter) return null
  return Math.min(chapter.offsetTop + scene.progress * chapter.offsetHeight, Math.max(document.documentElement.scrollHeight - window.innerHeight, 0))
}
