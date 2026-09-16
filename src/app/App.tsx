import { useEffect, useRef } from 'react'
import { StoryProvider, useStory } from './StoryContext'
import { ScrollProvider, useScrollStory } from './ScrollContext'
import { ScrollDirector } from './ScrollDirector'
import { ScrollStory } from '../components/ScrollStory'
import { ScrollDebugOverlay } from '../components/ScrollDebugOverlay'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { WebGLFallback } from '../components/WebGLFallback'
import { ExperienceCanvas } from '../three/ExperienceCanvas'
import { Navigation } from '../components/Navigation'
import { PresenterMode } from '../components/PresenterMode'
import { Brand } from '../components/Brand'
import { ScrollAvatarOverlay } from '../components/ScrollAvatarOverlay'
import { OpeningScene } from '../scenes/OpeningScene'
import { EarthHubScene } from '../scenes/EarthHubScene'
import { ConvergenceScene } from '../scenes/ConvergenceScene'
import { AIScrollScene } from '../scenes/AIScrollScene'
import { IBIOLScrollScene } from '../scenes/IBIOLScrollScene'
import { ClosingScrollScene } from '../scenes/ClosingScrollScene'
import { CountryExperience } from '../scenes/CountryExperience'

function Experience() {
  const { selectedCountry, selectCountry, clearCountry } = useStory()
  const { chapter, chapterProgress } = useScrollStory()
  const previousChapterRef = useRef(chapter)

  useEffect(() => {
    const previousChapter = previousChapterRef.current
    if (selectedCountry && previousChapter === 'country' && (chapter === 'earth' || chapter === 'convergence')) clearCountry()
    previousChapterRef.current = chapter
  }, [chapter, selectedCountry, clearCountry])

  return <main className="app">
    <div className="grain" />
    <ErrorBoundary fallback={<WebGLFallback />}>
      <ExperienceCanvas selectedCountry={selectedCountry} onSelectCountry={selectCountry} scrollChapter={chapter} scrollProgress={chapterProgress} />
    </ErrorBoundary>
    <div className="ambient-wash" />
    <Brand />
    <OpeningScene />
    <EarthHubScene />
    <ConvergenceScene />
    <AIScrollScene />
    <IBIOLScrollScene />
    <ClosingScrollScene />
    {selectedCountry && <CountryExperience key={`country-${selectedCountry}`} />}
    <ScrollAvatarOverlay />
    <Navigation />
    <PresenterMode />
    <ScrollDirector />
    <ScrollStory />
    <ScrollDebugOverlay />
    {import.meta.env.DEV && chapter === 'country' && selectedCountry === 'chile' && <span className="mock-indicator">Chile · datos demo</span>}
  </main>
}

export default function App() {
  return <StoryProvider><ScrollProvider><Experience /></ScrollProvider></StoryProvider>
}
