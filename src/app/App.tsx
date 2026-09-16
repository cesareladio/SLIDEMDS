import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
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
import { AvatarOverlay } from '../components/AvatarOverlay/AvatarOverlay'
import { OpeningScene } from '../scenes/OpeningScene'
import { EarthHubScene } from '../scenes/EarthHubScene'
import { FootprintScene } from '../scenes/FootprintScene'
import { PeopleScene } from '../scenes/PeopleScene'
import { SuperpowersScene } from '../scenes/SuperpowersScene'
import { AISkillingScene } from '../scenes/AISkillingScene'
import { JourneyScene } from '../scenes/JourneyScene'
import { IBIOLScene } from '../scenes/IBIOLScene'
import { ClosingScene } from '../scenes/ClosingScene'
import { CountryExperience } from '../scenes/CountryExperience'

// Legacy slide scenes — still active for non-migrated chapters
const legacyScenes = [null, FootprintScene, PeopleScene, SuperpowersScene, AISkillingScene, JourneyScene, IBIOLScene, ClosingScene]

function Experience() {
  const { scene, capabilityFocus, setAIPhase, ibiolPhase, selectedCountry, selectCountry, clearCountry } = useStory()
  const { chapter, chapterProgress, globalProgress } = useScrollStory()

  useEffect(() => {
    if (selectedCountry && (chapter === 'earth' || chapter === 'convergence')) clearCountry()
  }, [chapter, selectedCountry, clearCountry])

  const isScrollDriven = chapter === 'opening' || chapter === 'earth' || chapter === 'country'
  const LegacyScene = !isScrollDriven && !selectedCountry ? legacyScenes[scene] : null

  return <main className={`app scene-index-${scene}`}>
    <div className="grain" />
    <ErrorBoundary fallback={<WebGLFallback />}>
      <ExperienceCanvas
        scene={scene}
        capabilityFocus={capabilityFocus}
        onAIPhase={setAIPhase}
        ibiolPhase={ibiolPhase}
        selectedCountry={selectedCountry}
        onSelectCountry={selectCountry}
        scrollChapter={chapter}
        scrollProgress={chapterProgress}
        globalScrollProgress={globalProgress}
      />
    </ErrorBoundary>
    <div className="ambient-wash" />
    <Brand />
    {!isScrollDriven && scene !== 0 && <div className="chapter-label">GDN-e / EXPERIENCIA EJECUTIVA</div>}

    {/* Scroll-driven scenes */}
    <OpeningScene />
    <EarthHubScene />

    {/* Country overlay — independent of scroll */}
    {selectedCountry && <CountryExperience key={`country-${selectedCountry}`} />}

    {/* Legacy slides for not-yet-migrated chapters */}
    {!isScrollDriven && !selectedCountry && LegacyScene && (
      <AnimatePresence mode="wait"><LegacyScene key={scene} /></AnimatePresence>
    )}

    <AvatarOverlay moment={selectedCountry || isScrollDriven ? undefined : scene === 1 ? 'bridge' : scene === 7 ? 'closing' : undefined} />
    <Navigation />
    <PresenterMode />
    <ScrollDirector />
    <ScrollStory />
    <ScrollDebugOverlay />
    {import.meta.env.DEV && <span className="mock-indicator">Chile · datos demo</span>}
  </main>
}

export default function App() {
  return <StoryProvider><ScrollProvider><Experience /></ScrollProvider></StoryProvider>
}
