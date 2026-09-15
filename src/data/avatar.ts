export type AvatarSpeaker = 'Bárbara' | 'B2'
export type AvatarMoment = 'opening' | 'bridge' | 'closing'

export interface AvatarDialogueLine {
  scene: number
  speaker: AvatarSpeaker
  text: string
  duration: number
  tone: 'executive' | 'warm' | 'playful' | 'closing'
  optionalAction?: string
  next?: string
  audioUrl?: string
}

export const avatarMoments: Record<AvatarMoment, AvatarDialogueLine[]> = {
  opening: [
    { scene: 0, speaker: 'Bárbara', text: 'Les quiero presentar a alguien que sabe bastante de Chile, bastante de Perú…', duration: 3600, tone: 'executive', next: 'b2-introduction' },
    { scene: 0, speaker: 'B2', text: 'Soy B2, el alter ego digital de Bárbara.', duration: 2800, tone: 'playful', next: 'shared-story' },
    { scene: 0, speaker: 'B2', text: 'Tenemos historias y fortalezas distintas.', duration: 2800, tone: 'warm', next: 'one-gdne' },
  ],
  bridge: [
    { scene: 1, speaker: 'Bárbara', text: 'B2, danos un update de nuestros equipos.', duration: 2400, tone: 'executive', next: 'numbers' },
    { scene: 1, speaker: 'B2', text: 'Ahora vienen los números.', duration: 1900, tone: 'playful' },
  ],
  closing: [
    { scene: 7, speaker: 'B2', text: 'Eso es complementariedad: conectar capacidades y convertirlas en oportunidades y resultados.', duration: 4100, tone: 'closing', next: 'shared-brilliance' },
    { scene: 7, speaker: 'Bárbara', text: 'Creo que ambas podemos brillar juntas.', duration: 2900, tone: 'executive', next: 'ai-everywhere' },
    { scene: 7, speaker: 'B2', text: 'AI Everywhere.', duration: 2400, tone: 'playful' },
  ],
}

export const avatarOptionalLines = {
  greeting: 'Hola, soy B2.',
  piscoJoke: 'Prometo no abrir el debate del pisco todavía.',
  transition: 'Cuando hablamos de nuestro trabajo, somos One GDN-e.',
  closing: 'AI Everywhere.',
}
