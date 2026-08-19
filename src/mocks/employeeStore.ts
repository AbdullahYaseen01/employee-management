import type {
  Employee,
  EmployeeWritePayload,
  ListEmployeesParams,
  PaginatedEmployees,
} from '@/features/employees/types/employee'
import { ApiError } from '@/features/employees/utils/errors'
import { getEmployeeFullName } from '@/features/employees/utils/employee'
import { getDemoScenario } from '@/mocks/demoController'
import { createSeedEmployees } from '@/mocks/seed'

const STORAGE_KEY = 'meridian.employees.v1'

let employees: Employee[] = loadEmployees()

export function resetEmployeeStore(): void {
  employees = createSeedEmployees()
  persist()
}

export function listFromStore(params: ListEmployeesParams): PaginatedEmployees {
  if (getDemoScenario() === 'empty') {
    return {
      items: [],
      page: 1,
      pageSize: params.pageSize,
      totalItems: 0,
      totalPages: 0,
    }
  }

  const query = params.q?.trim().toLowerCase() ?? ''
  let items = employees.slice()

  if (query) {
    items = items.filter((employee) => {
      const fullName = getEmployeeFullName(employee).toLowerCase()
      return (
        fullName.includes(query) ||
        employee.firstName.toLowerCase().includes(query) ||
        employee.lastName.toLowerCase().includes(query)
      )
    })
  }

  if (params.department) {
    items = items.filter((employee) => employee.department === params.department)
  }

  if (params.employmentStatus) {
    items = items.filter(
      (employee) => employee.employmentStatus === params.employmentStatus,
    )
  }

  items.sort((a, b) => {
    const last = a.lastName.localeCompare(b.lastName)
    return last !== 0 ? last : a.firstName.localeCompare(b.firstName)
  })

  const totalItems = items.length
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / params.pageSize)
  const page = totalPages === 0 ? 1 : Math.min(Math.max(params.page, 1), totalPages)
  const start = (page - 1) * params.pageSize

  return {
    items: items.slice(start, start + params.pageSize).map(cloneEmployee),
    page,
    pageSize: params.pageSize,
    totalItems,
    totalPages,
  }
}

export function getFromStore(id: string): Employee {
  const employee = employees.find((item) => item.id === id)
  if (!employee) {
    throw new ApiError('Employee not found.', 'NOT_FOUND', 404)
  }
  return cloneEmployee(employee)
}

export function createInStore(payload: EmployeeWritePayload): Employee {
  const employee: Employee = {
    id: createId(),
    employeeId: nextEmployeeId(),
    ...payload,
  }
  employees = [employee, ...employees]
  persist()
  return cloneEmployee(employee)
}

export function updateInStore(id: string, payload: EmployeeWritePayload): Employee {
  const index = employees.findIndex((item) => item.id === id)
  if (index < 0) {
    throw new ApiError('Employee not found.', 'NOT_FOUND', 404)
  }
  const current = employees[index]
  if (!current) {
    throw new ApiError('Employee not found.', 'NOT_FOUND', 404)
  }
  const updated: Employee = {
    ...current,
    ...payload,
  }
  employees = employees.map((item, itemIndex) =>
    itemIndex === index ? updated : item,
  )
  persist()
  return cloneEmployee(updated)
}

export function deactivateInStore(id: string): Employee {
  const employee = employees.find((item) => item.id === id)
  if (!employee) {
    throw new ApiError('Employee not found.', 'NOT_FOUND', 404)
  }
  if (employee.employmentStatus === 'inactive') {
    throw new ApiError('This employee is already inactive.', 'CONFLICT', 409)
  }
  const updated: Employee = {
    ...employee,
    employmentStatus: 'inactive',
  }
  employees = employees.map((item) => (item.id === id ? updated : item))
  persist()
  return cloneEmployee(updated)
}

function loadEmployees(): Employee[] {
  if (typeof window === 'undefined') {
    return createSeedEmployees()
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createSeedEmployees()
    }
    const parsed = JSON.parse(raw) as Employee[]
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return createSeedEmployees()
    }
    return parsed
  } catch {
    return createSeedEmployees()
  }
}

function persist(): void {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(employees))
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function nextEmployeeId(): string {
  const max = employees.reduce((current, employee) => {
    const numeric = Number(employee.employeeId.replace(/\D/g, ''))
    return Number.isFinite(numeric) ? Math.max(current, numeric) : current
  }, 1000)
  return `EMP-${max + 1}`
}

function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `emp-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function cloneEmployee(employee: Employee): Employee {
  return { ...employee }
}
