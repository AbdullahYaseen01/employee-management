import type {
  Employee,
  PaginatedEmployees,
} from '@/features/employees/types/employee'
import type { EmployeeApi } from '@/features/employees/api/employeeApi'
import {
  throwIfDemoReadFails,
  throwIfDemoWriteFails,
} from '@/features/employees/api/demoFailures'
import { ApiError, isAbortError } from '@/features/employees/utils/errors'

const API_ROOT = '/api/employees'

export function createHttpEmployeeApi(baseUrl = API_ROOT): EmployeeApi {
  return {
    async listEmployees(params, options) {
      await throwIfDemoReadFails()
      const url = new URL(baseUrl, window.location.origin)
      if (params.q) url.searchParams.set('q', params.q)
      if (params.department) url.searchParams.set('department', params.department)
      if (params.employmentStatus) {
        url.searchParams.set('status', params.employmentStatus)
      }
      url.searchParams.set('page', String(params.page))
      url.searchParams.set('pageSize', String(params.pageSize))
      return requestJson<PaginatedEmployees>(url, { signal: options?.signal })
    },

    async getEmployee(id, options) {
      await throwIfDemoReadFails()
      return requestJson<Employee>(`${baseUrl}/${id}`, {
        signal: options?.signal,
      })
    },

    async createEmployee(payload) {
      await throwIfDemoWriteFails('create')
      return requestJson<Employee>(baseUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
    },

    async updateEmployee(id, payload) {
      await throwIfDemoWriteFails('edit')
      return requestJson<Employee>(`${baseUrl}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
      })
    },

    async deactivateEmployee(id) {
      await throwIfDemoWriteFails('deactivate')
      return requestJson<Employee>(`${baseUrl}/${id}/deactivate`, {
        method: 'POST',
      })
    },
  }
}

export const employeeApi = createHttpEmployeeApi()

async function requestJson<T>(
  input: string | URL,
  init: RequestInit = {},
): Promise<T> {
  try {
    const response = await fetch(input, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    })

    if (!response.ok) {
      throw await toApiError(response)
    }

    return (await response.json()) as T
  } catch (error) {
    if (isAbortError(error)) {
      throw error
    }
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(
      'Unable to reach the employee directory. Check your connection and try again.',
      'NETWORK',
    )
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  let message = 'The employee directory request failed.'
  try {
    const body = (await response.json()) as { message?: string }
    if (body.message) {
      message = body.message
    }
  } catch {
    // Body was not JSON.
  }

  if (response.status === 404) {
    return new ApiError(message, 'NOT_FOUND', 404)
  }
  if (response.status === 409) {
    return new ApiError(message, 'CONFLICT', 409)
  }
  if (response.status === 400 || response.status === 422) {
    return new ApiError(message, 'VALIDATION', response.status)
  }
  return new ApiError(message, 'SERVER', response.status)
}
