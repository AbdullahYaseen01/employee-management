export const EMPLOYMENT_STATUSES = ['active', 'inactive', 'on_leave'] as const

export type EmploymentStatus = (typeof EMPLOYMENT_STATUSES)[number]

export const DEPARTMENTS = [
  'Engineering',
  'Human Resources',
  'Finance',
  'Operations',
  'Sales',
  'Marketing',
  'Customer Success',
  'Legal',
] as const

export type Department = (typeof DEPARTMENTS)[number]

export interface Employee {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  jobTitle: string
  department: Department
  employmentStatus: EmploymentStatus
  joiningDate: string
}

export interface EmployeeWritePayload {
  firstName: string
  lastName: string
  email: string
  jobTitle: string
  department: Department
  employmentStatus: EmploymentStatus
  joiningDate: string
}

export interface ListEmployeesParams {
  q?: string
  department?: Department | ''
  employmentStatus?: EmploymentStatus | ''
  page: number
  pageSize: number
}

export interface PaginatedEmployees {
  items: Employee[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export const PAGE_SIZE_OPTIONS = [5, 10, 25] as const
export type PageSize = (typeof PAGE_SIZE_OPTIONS)[number]
