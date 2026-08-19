import { useState, useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/Button'
import { useQueryClient } from '@tanstack/react-query'
import { employeeKeys } from '@/features/employees/api/queryKeys'
import {
  DEMO_SCENARIOS,
  DEMO_SCENARIO_LABELS,
  getDemoScenario,
  setDemoScenario,
  subscribeDemoScenario,
  type DemoScenario,
} from '@/mocks/demoController'
import { resetEmployeeStore } from '@/mocks/employeeStore'

export function DemoStateToolbar() {
  const [open, setOpen] = useState(false)
  const scenario = useSyncExternalStore(
    subscribeDemoScenario,
    getDemoScenario,
    getDemoScenario,
  )
  const queryClient = useQueryClient()

  async function apply(next: DemoScenario) {
    setDemoScenario(next)
    await queryClient.invalidateQueries({ queryKey: employeeKeys.all })
  }

  async function resetData() {
    resetEmployeeStore()
    setDemoScenario('normal')
    await queryClient.invalidateQueries({ queryKey: employeeKeys.all })
  }

  return (
    <div className="demo-dock">
      {open ? (
        <div className="demo-panel" role="region" aria-label="Demo states">
          <h2>Demo states</h2>
          <p className="demo-panel__hint">
            Reviewer controls only. These options simulate loading, empty, and
            error states in the UI. They do not mean the app is broken. Choose
            Normal populated data, then refresh, to see the working directory.
          </p>
          {DEMO_SCENARIOS.map((item) => (
            <label key={item}>
              <input
                type="radio"
                name="demo-scenario"
                value={item}
                checked={scenario === item}
                onChange={() => {
                  void apply(item)
                }}
              />
              {DEMO_SCENARIO_LABELS[item]}
            </label>
          ))}
          <Button variant="secondary" size="sm" onClick={() => void resetData()}>
            Reset mock data
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Hide demo controls
          </Button>
        </div>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          Demo states
        </Button>
      )}
    </div>
  )
}
