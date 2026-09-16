import type { ScrollChapter } from '../app/ScrollContext'

export interface StoryBeat {
  id: string
  chapter: ScrollChapter
  progress: number
  label: string
}

export const storyBeats: StoryBeat[] = [
  { id: 'opening-identities', chapter: 'opening', progress: .25, label: 'DOS IDENTIDADES' },
  { id: 'opening-team', chapter: 'opening', progress: .62, label: 'UN SOLO EQUIPO' },
  { id: 'earth-hub', chapter: 'earth', progress: .50, label: 'PERÚ × CHILE' },
  { id: 'peru-geo', chapter: 'peru', progress: .12, label: 'PERÚ · GEO' },
  { id: 'peru-footprint', chapter: 'peru', progress: .28, label: 'PERÚ · HUELLA' },
  { id: 'peru-talent', chapter: 'peru', progress: .48, label: 'PERÚ · TALENTO' },
  { id: 'peru-capabilities', chapter: 'peru', progress: .68, label: 'PERÚ · CAPACIDADES' },
  { id: 'peru-timeline', chapter: 'peru', progress: .89, label: 'PERÚ · CAMINO' },
  { id: 'peru-exit', chapter: 'peru', progress: .96, label: 'PERÚ → CHILE' },
  { id: 'chile-geo', chapter: 'chile', progress: .15, label: 'CHILE · GEO' },
  { id: 'chile-footprint', chapter: 'chile', progress: .46, label: 'CHILE · HUELLA' },
  { id: 'chile-capabilities', chapter: 'chile', progress: .82, label: 'CHILE · CAPACIDADES' },
  { id: 'chile-exit', chapter: 'chile', progress: .95, label: 'CHILE → CONVERGENCIA' },
  { id: 'convergence-identities', chapter: 'convergence', progress: .46, label: 'DOS IDENTIDADES' },
  { id: 'convergence-team', chapter: 'convergence', progress: .67, label: 'UN SOLO EQUIPO' },
  { id: 'convergence-one', chapter: 'convergence', progress: .88, label: 'ONE GDN-e' },
  { id: 'ai-4000', chapter: 'ai', progress: .32, label: '4,000 CERT IA' },
  { id: 'ai-50', chapter: 'ai', progress: .68, label: '50% GH-300' },
  { id: 'ai-ecosystem', chapter: 'ai', progress: .92, label: 'PIMS SKILLING UPSKILLING' },
  { id: 'ibiol-today', chapter: 'ibiol', progress: .25, label: 'IBIOL · HOY' },
  { id: 'ibiol-grow', chapter: 'ibiol', progress: .52, label: 'IBIOL · CRECER' },
  { id: 'ibiol-accelerate', chapter: 'ibiol', progress: .76, label: 'IBIOL · ACELERAR' },
  { id: 'ibiol-final', chapter: 'ibiol', progress: .94, label: 'IBIOL · FINAL' },
  { id: 'closing-chile', chapter: 'closing', progress: .15, label: 'CHILE' },
  { id: 'closing-peru', chapter: 'closing', progress: .34, label: 'PERÚ' },
  { id: 'closing-pair', chapter: 'closing', progress: .47, label: 'PERÚ × CHILE' },
  { id: 'closing-identities', chapter: 'closing', progress: .58, label: 'DOS IDENTIDADES' },
  { id: 'closing-team', chapter: 'closing', progress: .69, label: 'UN SOLO EQUIPO' },
  { id: 'closing-one', chapter: 'closing', progress: .89, label: 'ONE GDN-e' },
  { id: 'closing-ntt', chapter: 'closing', progress: .955, label: 'NTT DATA' },
  { id: 'closing-everywhere', chapter: 'closing', progress: .995, label: 'AI EVERYWHERE' },
]

export function getStoryBeatIndex(chapter: ScrollChapter, progress: number): number {
  const chapterBeats = storyBeats.map((beat, index) => ({ beat, index })).filter(({ beat }) => beat.chapter === chapter)
  if (chapterBeats.length === 0) return 0
  const current = chapterBeats.filter(({ beat }) => beat.progress <= progress + .005)
  return (current[current.length - 1] ?? chapterBeats[0]).index
}

export function getNextBeat(chapter: ScrollChapter, progress: number): StoryBeat | null {
  const chapters: ScrollChapter[] = ['opening','earth','peru','chile','convergence','ai','ibiol','closing']
  const currentChapterIndex = chapters.indexOf(chapter)
  return storyBeats.find(beat => beat.chapter === chapter && beat.progress > progress + .005)
    ?? storyBeats.find(beat => chapters.indexOf(beat.chapter) > currentChapterIndex)
    ?? null
}

export function getPreviousBeat(chapter: ScrollChapter, progress: number): StoryBeat | null {
  const chapters: ScrollChapter[] = ['opening','earth','peru','chile','convergence','ai','ibiol','closing']
  const currentChapterIndex = chapters.indexOf(chapter)
  const candidates = storyBeats.filter(beat => chapters.indexOf(beat.chapter) < currentChapterIndex || (beat.chapter === chapter && beat.progress < progress - .005))
  return candidates[candidates.length - 1] ?? null
}

export function getStoryBeatTarget(beat: StoryBeat): number | null {
  const chapter = document.querySelector<HTMLElement>(`[data-chapter="${beat.chapter}"]`)
  if (!chapter) return null
  const rawTarget = chapter.offsetTop + beat.progress * chapter.offsetHeight
  const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 0)
  return Math.min(rawTarget, maxScroll)
}

export function scrollToBeat(beat: StoryBeat) {
  const target = getStoryBeatTarget(beat)
  if (target === null) return
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: target, behavior: prefersReduced ? 'auto' : 'smooth' })
}
