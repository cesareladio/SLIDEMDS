import { ScrollChapterBlock } from './ScrollChapterBlock'

const chapters: { id: string; height: string }[] = [
  { id: 'opening', height: '220vh' },
  { id: 'earth', height: '180vh' },
  { id: 'peru', height: '500vh' },
  { id: 'chile', height: '340vh' },
  { id: 'convergence', height: '140vh' },
  { id: 'ai', height: '240vh' },
  { id: 'ibiol', height: '260vh' },
  { id: 'closing', height: '280vh' },
]

export function ScrollStory() {
  return <div className="scroll-story">
    {chapters.map(chapter => <ScrollChapterBlock key={chapter.id} chapter={chapter.id} height={chapter.height} />)}
  </div>
}
