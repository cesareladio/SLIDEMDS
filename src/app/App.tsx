import { AnimatePresence } from 'framer-motion'
import { StoryProvider, useStory } from './StoryContext'
import { ScrollProvider } from './ScrollContext'
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
import { FootprintScene } from '../scenes/FootprintScene'
import { PeopleScene } from '../scenes/PeopleScene'
import { SuperpowersScene } from '../scenes/SuperpowersScene'
import { AISkillingScene } from '../scenes/AISkillingScene'
import { JourneyScene } from '../scenes/JourneyScene'
import { IBIOLScene } from '../scenes/IBIOLScene'
import { ClosingScene } from '../scenes/ClosingScene'
import { CountryExperience } from '../scenes/CountryExperience'

const scenes = [OpeningScene, FootprintScene, PeopleScene, SuperpowersScene, AISkillingScene, JourneyScene, IBIOLScene, ClosingScene]

function Experience() {
  const { scene, capabilityFocus, setAIPhase, ibiolPhase, selectedCountry, selectCountry } = useStory()
  const Scene = scenes[scene]
  return <main className={`app scene-index-${scene}`}>
    <div className="grain" />
    <ErrorBoundary fallback={<WebGLFallback />}><ExperienceCanvas scene={scene} capabilityFocus={capabilityFocus} onAIPhase={setAIPhase} ibiolPhase={ibiolPhase} selectedCountry={selectedCountry} onSelectCountry={selectCountry} /></ErrorBoundary>
    <div className="ambient-wash" />
    <Brand />
    {scene !== 0 && <div className="chapter-label">GDN-e / EXPERIENCIA EJECUTIVA</div>}
    <AnimatePresence mode="wait">{selectedCountry ? <CountryExperience key={`country-${selectedCountry}`} /> : <Scene key={scene} />}</AnimatePresence>
    <AvatarOverlay moment={selectedCountry ? undefined : scene === 0 ? 'opening' : scene === 1 ? 'bridge' : scene === 7 ? 'closing' : undefined} />
    <Navigation />
    <PresenterMode />
    <ScrollDirector />
    <ScrollStory />
    <ScrollDebugOverlay />
    {import.meta.env.DEV && <span className="mock-indicator">Chile · datos demo</span>}
  </main>
}

export default function App() { return <StoryProvider><ScrollProvider><Experience /></ScrollProvider></StoryProvider> }
