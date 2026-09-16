import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useScrollStory, type ScrollChapter } from './ScrollContext'

gsap.registerPlugin(ScrollTrigger)

export function ScrollDirector() {
  const { setScrollState } = useScrollStory()
  const lastScrollY = useRef(0)

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'))
    if (elements.length === 0) return

    const triggers = elements.map(element => {
      const chapter = element.dataset.chapter as ScrollChapter
      return ScrollTrigger.create({
        trigger: element,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: self => {
          const scrollY = window.scrollY
          const direction = scrollY >= lastScrollY.current ? 1 : -1
          lastScrollY.current = scrollY

          const doc = document.documentElement
          const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1)
          const globalProgress = scrollY / maxScroll

          setScrollState({
            chapter,
            chapterProgress: self.progress,
            globalProgress,
            direction,
          })
        },
      })
    })

    ScrollTrigger.refresh()

    return () => { triggers.forEach(trigger => trigger.kill()) }
  }, [setScrollState])

  return null
}
