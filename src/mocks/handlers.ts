import { delay, http, HttpResponse } from 'msw'
import type {
  Department,
  EmployeeWritePayload,
  EmploymentStatus,
  ListEmployeesParams,
} from '@/features/employees/types/employee'
import { PAGE_SIZE_OPTIONS } from '@/features/employees/types/employee'
import { getDemoScenario, getMockLatency } from '@/mocks/demoController'
import {
  createInStore,
  deactivateInStore,
  getFromStore,
  listFromStore,
  updateInStore,
} from '@/mocks/employeeStore'
import { isDepartment, isEmploymentStatus } from '@/mocks/seed'

const API_ROOT = '/api/employees'

export const handlers = [
  http.get(API_ROOT, async ({ request }) => {
    const blocked = await maybeFailRead()
    if (blocked) {
      return blocked
    }

    const url = new URL(request.url)
    const params: ListEmployeesParams = {
      q: url.searchParams.get('q') ?? '',
      department: parseDepartment(url.searchParams.get('department')),
      employmentStatus: parseStatus(url.searchParams.get('status')),
      page: parsePositiveInt(url.searchParams.get('page'), 1),
      pageSize: parsePageSize(url.searchParams.get('pageSize')),
    }

    return HttpResponse.json(listFromStore(params))
  }),

  http.get(`${API_ROOT}/:id`, async ({ params }) => {
    const blocked = await maybeFailRead()
    if (blocked) {
      return blocked
    }

    try {
      return HttpResponse.json(getFromStore(String(params.id)))
    } catch {
      return jsonError('Employee not found.', 404)
    }
  }),

  http.post(API_ROOT, async ({ request }) => {
    await waitForLatency()
    if (getDemoScenario() === 'create-error') {
      return jsonError('The directory service could not create this employee.', 500)
    }

    const payload = (await request.json()) as EmployeeWritePayload
    const created = createInStore(payload)
    return HttpResponse.json(created, { status: 201 })
  }),

  http.patch(`${API_ROOT}/:id`, async ({ params, request }) => {
    await waitForLatency()
    if (getDemoScenario() === 'edit-error') {
      return jsonError('The directory service could not save these changes.', 500)
    }

    try {
      const payload = (await request.json()) as EmployeeWritePayload
      return HttpResponse.json(updateInStore(String(params.id), payload))
    } catch {
      return jsonError('Employee not found.', 404)
    }
  }),

  http.post(`${API_ROOT}/:id/deactivate`, async ({ params }) => {
    await waitForLatency()
    if (getDemoScenario() === 'deactivate-error') {
      return jsonError('The directory service could not deactivate this employee.', 500)
    }

    try {
      return HttpResponse.json(deactivateInStore(String(params.id)))
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to deactivate employee.'
      const status = message.includes('already inactive') ? 409 : 404
      return jsonError(message, status)
    }
  }),
]

async function maybeFailRead() {
  await waitForLatency()
  if (getDemoScenario() === 'fetch-error') {
    return jsonError('The employee directory is temporarily unavailable.', 500)
  }
  return null
}

async function waitForLatency(): Promise<void> {
  const latency = getMockLatency()
  if (latency > 0) {
    await delay(latency)
  }
}

function jsonError(message: string, status: number) {
  return HttpResponse.json({ message }, { status })
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback
  }
  return parsed
}

function parsePageSize(value: string | null): number {
  const parsed = Number(value)
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(parsed) ? parsed : 10
}

function parseDepartment(value: string | null): Department | '' {
  if (!value) {
    return ''
  }
  return isDepartment(value) ? value : ''
}

function parseStatus(value: string | null): EmploymentStatus | '' {
  if (!value) {
    return ''
  }
  return isEmploymentStatus(value) ? value : ''
}
