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

const SCENARIO_KEY = 'meridian.demo-scenario'
const LATENCY_KEY = 'meridian.mock-latency'

let scenario: DemoScenario = 'normal'
let latencyMs = 280
const listeners = new Set<() => void>()

export function getDemoScenario(): DemoScenario {
  return scenario
}

export function setDemoScenario(next: DemoScenario): void {
  scenario = next
  persist()
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
  if (typeof window === 'undefined') {
    return
  }
  const params = new URLSearchParams(window.location.search)
  const fromQuery = params.get('demo')
  if (fromQuery && isDemoScenario(fromQuery)) {
    scenario = fromQuery
    persist()
    return
  }
  try {
    const stored = window.sessionStorage.getItem(SCENARIO_KEY)
    if (stored && isDemoScenario(stored)) {
      scenario = stored
    }
    const storedLatency = window.sessionStorage.getItem(LATENCY_KEY)
    if (storedLatency) {
      latencyMs = Number(storedLatency) || latencyMs
    }
  } catch {
    // Ignore storage failures in private browsing.
  }
}

export function isDemoScenario(value: string): value is DemoScenario {
  return (DEMO_SCENARIOS as readonly string[]).includes(value)
}

function persist(): void {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.sessionStorage.setItem(SCENARIO_KEY, scenario)
  } catch {
    // Ignore storage failures.
  }
}

function notify(): void {
  for (const listener of listeners) {
    listener()
  }
}
