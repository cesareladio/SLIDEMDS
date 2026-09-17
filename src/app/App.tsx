import { StoryProvider, useStory } from './StoryContext'
import { ScrollProvider, useScrollStory } from './ScrollContext'
import { PresentationProvider, usePresentation } from './PresentationContext'
import { ScrollDirector } from './ScrollDirector'
import { ScrollStory } from '../components/ScrollStory'
import { ScrollDebugOverlay } from '../components/ScrollDebugOverlay'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { WebGLFallback } from '../components/WebGLFallback'
import { ExperienceCanvas } from '../three/ExperienceCanvas'
import { Navigation } from '../components/Navigation'
import { PresenterMode } from '../components/PresenterMode'
import { Brand } from '../components/Brand'
import { OpeningScene } from '../scenes/OpeningScene'
import { EarthHubScene } from '../scenes/EarthHubScene'
import { OpeningEarthHandoff } from '../components/OpeningEarthHandoff'
import { CountryExperience } from '../scenes/CountryExperience'
import { ConvergenceScene } from '../scenes/ConvergenceScene'
import { AIScrollScene } from '../scenes/AIScrollScene'
import { IBIOLScrollScene } from '../scenes/IBIOLScrollScene'
import { ClosingScrollScene } from '../scenes/ClosingScrollScene'
import { countryFromChapter } from '../data/countryScroll'

function Experience() {
  const { presenter, elapsed } = useStory()
  const { chapter, chapterProgress } = useScrollStory()
  const { activeSceneIndex } = usePresentation()
  const activeCountry = countryFromChapter(chapter)

  return <main className="app">
    <div className="grain" />
    <ErrorBoundary fallback={<WebGLFallback />}>
      <ExperienceCanvas scrollChapter={chapter} scrollProgress={chapterProgress} activeSceneIndex={activeSceneIndex} />
    </ErrorBoundary>
    <div className="ambient-wash" />
    <Brand />
    <OpeningScene />
    <EarthHubScene />
    <OpeningEarthHandoff />
    {(chapter === 'peru' || chapter === 'chile') && <CountryExperience key={chapter} />}
    <ConvergenceScene />
    <AIScrollScene />
    <IBIOLScrollScene />
    <ClosingScrollScene />
    <Navigation />
    <PresenterMode />
    <ScrollDirector />
    <ScrollStory />
    <ScrollDebugOverlay />
    {import.meta.env.DEV && chapter === 'chile' && <span className="mock-indicator">Chile · datos demo</span>}
  </main>
}

export default function App() {
  return <StoryProvider><ScrollProvider><PresentationProvider><Experience /></PresentationProvider></ScrollProvider></StoryProvider>
}
