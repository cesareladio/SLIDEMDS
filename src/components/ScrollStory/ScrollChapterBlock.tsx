import type { ReactNode } from 'react'

export interface ScrollChapterBlockProps {
  chapter: string
  height: string
  children?: ReactNode
}

export function ScrollChapterBlock({ chapter, height, children }: ScrollChapterBlockProps) {
  return <section data-chapter={chapter} className={`scroll-chapter scroll-chapter-${chapter}`} style={{ minHeight: height }}>
    {children}
  </section>
}
