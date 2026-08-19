import type { Employee, EmploymentStatus } from '@/features/employees/types/employee'

export const EMPLOYMENT_STATUS_LABELS: Record<EmploymentStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  on_leave: 'On leave',
}

export function getEmployeeFullName(
  employee: Pick<Employee, 'firstName' | 'lastName'>,
): string {
  return `${employee.firstName} ${employee.lastName}`
}

export function getInitials(firstName: string, lastName: string): string {
  const first = firstName.trim().charAt(0)
  const last = lastName.trim().charAt(0)
  return `${first}${last}`.toUpperCase()
}

export function formatJoiningDate(isoDate: string): string {
  const parsed = parseIsoDate(isoDate)
  if (!parsed) {
    return isoDate
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed)
}

export function parseIsoDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!match) {
    return null
  }
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

export function isValidIsoDate(value: string): boolean {
  return parseIsoDate(value) !== null
}
