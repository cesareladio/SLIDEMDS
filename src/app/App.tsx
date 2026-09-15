import { AnimatePresence } from 'framer-motion'
import { StoryProvider, useStory } from './StoryContext'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { WebGLFallback } from '../components/WebGLFallback'
import { ExperienceCanvas } from '../three/ExperienceCanvas'
import { Navigation } from '../components/Navigation'
import { PresenterMode } from '../components/PresenterMode'
import { Brand } from '../components/Brand'
import { OpeningScene } from '../scenes/OpeningScene'
import { FootprintScene } from '../scenes/FootprintScene'
import { DiversityScene } from '../scenes/DiversityScene'
import { SuperpowersScene } from '../scenes/SuperpowersScene'
import { AISkillingScene } from '../scenes/AISkillingScene'
import { JourneyScene } from '../scenes/JourneyScene'
import { FutureScene } from '../scenes/FutureScene'
import { ClosingScene } from '../scenes/ClosingScene'

const scenes = [OpeningScene, FootprintScene, DiversityScene, SuperpowersScene, AISkillingScene, JourneyScene, FutureScene, ClosingScene]

function Experience() {
  const { scene } = useStory()
  const Scene = scenes[scene]
  return <main className={`app scene-index-${scene}`}>
    <div className="grain" />
    <ErrorBoundary fallback={<WebGLFallback />}><ExperienceCanvas scene={scene} /></ErrorBoundary>
    <div className="ambient-wash" />
    <Brand />
    <div className="chapter-label">GDN-e / EXPERIENCIA EJECUTIVA</div>
    <AnimatePresence mode="wait"><Scene key={scene} /></AnimatePresence>
    <Navigation />
    <PresenterMode />
    {import.meta.env.DEV && <span className="mock-indicator">Chile · datos demo</span>}
  </main>
}

export default function App() { return <StoryProvider><Experience /></StoryProvider> }
