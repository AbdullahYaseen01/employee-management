import { getDemoScenario, getMockLatency } from '@/mocks/demoController'
import { ApiError } from '@/features/employees/utils/errors'

async function waitDemoLatency(): Promise<void> {
  const ms = getMockLatency()
  if (ms > 0) {
    await new Promise((resolve) => {
      window.setTimeout(resolve, ms)
    })
  }
}

export async function throwIfDemoReadFails(): Promise<void> {
  if (getDemoScenario() !== 'fetch-error') {
    return
  }
  await waitDemoLatency()
  throw new ApiError(
    'The employee directory is temporarily unavailable.',
    'SERVER',
  )
}

export async function throwIfDemoWriteFails(
  kind: 'create' | 'edit' | 'deactivate',
): Promise<void> {
  const scenario = getDemoScenario()
  const shouldFail =
    (kind === 'create' && scenario === 'create-error') ||
    (kind === 'edit' && scenario === 'edit-error') ||
    (kind === 'deactivate' && scenario === 'deactivate-error')
  if (!shouldFail) {
    return
  }
  await waitDemoLatency()
  if (kind === 'create') {
    throw new ApiError(
      'The directory service could not create this employee.',
      'SERVER',
    )
  }
  if (kind === 'edit') {
    throw new ApiError(
      'The directory service could not save these changes.',
      'SERVER',
    )
  }
  throw new ApiError(
    'The directory service could not deactivate this employee.',
    'SERVER',
  )
}
