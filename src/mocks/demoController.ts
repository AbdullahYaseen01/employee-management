export const DEMO_SCENARIOS = [
  'normal',
  'slow',
  'empty',
  'fetch-error',
  'create-error',
  'edit-error',
  'deactivate-error',
] as const

export type DemoScenario = (typeof DEMO_SCENARIOS)[number]

export const DEMO_SCENARIO_LABELS: Record<DemoScenario, string> = {
  normal: 'Normal populated data',
  slow: 'Slow loading',
  empty: 'Empty directory',
  'fetch-error': 'Fetch failure',
  'create-error': 'Create failure',
  'edit-error': 'Edit failure',
  'deactivate-error': 'Deactivation failure',
}

let scenario: DemoScenario = 'normal'
let latencyMs = 280
const listeners = new Set<() => void>()

export function getDemoScenario(): DemoScenario {
  return scenario
}

export function setDemoScenario(next: DemoScenario): void {
  scenario = next
  notify()
}

export function getMockLatency(): number {
  if (scenario === 'slow') {
    return 2200
  }
  return latencyMs
}

export function setMockLatency(ms: number): void {
  latencyMs = ms
}

export function subscribeDemoScenario(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function hydrateDemoController(): void {
  scenario = 'normal'
}

export function isDemoScenario(value: string): value is DemoScenario {
  return (DEMO_SCENARIOS as readonly string[]).includes(value)
}

function notify(): void {
  for (const listener of listeners) {
    listener()
  }
}
