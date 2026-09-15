import type { Capability } from './types'

export type CapabilityFocus = 'overview' | 'backend' | 'testing' | 'sap'

export interface CapabilityNode extends Capability {
  position: [number, number, number]
  focus?: Exclude<CapabilityFocus, 'overview'>
}

export const capabilityNodes: CapabilityNode[] = [
  { id: 'backend', label: 'Back-End', value: 368, position: [-2.35, .8, .65], focus: 'backend', details: [{ label: 'Microservices', value: 161 }, { label: 'Java', value: 146 }, { label: '.NET', value: 108 }] },
  { id: 'testing', label: 'Testing', value: 279, position: [-.5, -1.05, -1.05], focus: 'testing', details: [{ label: 'Automation Testing', value: 156 }, { label: 'Functional Testing', value: 99 }] },
  { id: 'sap', label: 'SAP', value: 230, position: [1.65, .95, .35], focus: 'sap', details: [{ label: 'ABAP', value: 99 }] },
  { id: 'microsoft', label: 'Microsoft', value: 115, position: [2.55, -.85, -1.15] },
  { id: 'frontend', label: 'Front-End', value: 77, position: [-1.45, -1.55, 1.25] },
  { id: 'data-ai', label: 'Data & AI', value: 54, position: [.15, 1.65, 1.6] },
]

export const capabilityFocusNodes = capabilityNodes.filter(node => node.focus)

export function finitePosition(position: [number, number, number]): [number, number, number] {
  return position.every(Number.isFinite) ? position : [0, 0, 0]
}
