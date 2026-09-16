import type { ScrollChapter } from '../app/ScrollContext'

export type TransitionType = 'poster' | 'editorial' | 'cinematic'
export interface PresentationScene { id: string; index: number; chapter: ScrollChapter; progress: number; label: string; transitionType: TransitionType }

const sceneDefinitions: Array<[string, ScrollChapter, number, string, TransitionType]> = [
  ['opening-identities','opening',.25,'DOS IDENTIDADES','poster'],['opening-team','opening',.62,'UN SOLO EQUIPO','poster'],['earth-hub','earth',.50,'PERÚ × CHILE','cinematic'],
  ['peru-intro','peru',.12,'PERÚ · INTRO','cinematic'],['peru-footprint','peru',.28,'PERÚ · HUELLA','editorial'],['peru-talent','peru',.48,'PERÚ · TALENTO','editorial'],['peru-capabilities','peru',.68,'PERÚ · CAPACIDADES','editorial'],['peru-history','peru',.89,'PERÚ · HISTORIA','editorial'],
  ['chile-intro','chile',.15,'CHILE · INTRO','cinematic'],['chile-footprint','chile',.46,'CHILE · HUELLA','editorial'],['chile-capabilities','chile',.82,'CHILE · CAPACIDADES','editorial'],
  ['convergence-identities','convergence',.46,'DOS IDENTIDADES','cinematic'],['convergence-team','convergence',.67,'UN SOLO EQUIPO','poster'],['convergence-one','convergence',.88,'ONE GDN-e','poster'],
  ['ai-4000','ai',.32,'4,000','cinematic'],['ai-gh300','ai',.68,'50% GH-300','poster'],['ai-ecosystem','ai',.92,'PIMS  SKILLING · UPSKILLING','editorial'],
  ['ibiol-today','ibiol',.25,'IBIOL · HOY','cinematic'],['ibiol-grow','ibiol',.52,'IBIOL · CRECER','editorial'],['ibiol-accelerate','ibiol',.76,'IBIOL · ACELERAR','editorial'],['ibiol-final','ibiol',.94,'IBIOL · FINAL','cinematic'],
  ['closing-chile','closing',.15,'CHILE','cinematic'],['closing-peru','closing',.34,'PERÚ','editorial'],['closing-pair','closing',.47,'PERÚ + CHILE','editorial'],['closing-identities','closing',.58,'DOS IDENTIDADES','poster'],['closing-team','closing',.69,'UN SOLO EQUIPO','poster'],['closing-one','closing',.89,'ONE GDN-e','cinematic'],['closing-ntt','closing',.955,'NTT DATA','poster'],['closing-everywhere','closing',.995,'AI EVERYWHERE','poster'],
]

export const presentationScenes: PresentationScene[] = sceneDefinitions.map(([id, chapter, progress, label, transitionType], index) => ({ id, index, chapter, progress, label, transitionType }))

export function getSceneScrollTarget(scene: PresentationScene) {
  const chapter = document.querySelector<HTMLElement>(`[data-chapter="${scene.chapter}"]`)
  if (!chapter) return null
  return Math.min(chapter.offsetTop + scene.progress * chapter.offsetHeight, Math.max(document.documentElement.scrollHeight - window.innerHeight, 0))
}
