import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setDemoScenario, setMockLatency } from '@/mocks/demoController'
import { resetEmployeeStore } from '@/mocks/employeeStore'
import { server } from '@/mocks/server'

setMockLatency(0)
resetEmployeeStore()

beforeAll(() => {
  setMockLatency(0)
  server.listen({ onUnhandledRequest: 'error' })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  resetEmployeeStore()
  setDemoScenario('normal')
  setMockLatency(0)
  window.sessionStorage.clear()
})

afterAll(() => {
  server.close()
})
