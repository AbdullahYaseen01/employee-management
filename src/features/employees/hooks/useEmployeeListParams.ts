import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  DEPARTMENTS,
  EMPLOYMENT_STATUSES,
  PAGE_SIZE_OPTIONS,
  type Department,
  type EmploymentStatus,
  type ListEmployeesParams,
  type PageSize,
} from '@/features/employees/types/employee'

const SEARCH_DEBOUNCE_MS = 300

export function useEmployeeListParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const department = parseDepartment(searchParams.get('department'))
  const status = parseStatus(searchParams.get('status'))
  const page = parsePositiveInt(searchParams.get('page'), 1)
  const pageSize = parsePageSize(searchParams.get('pageSize'))

  const [searchInput, setSearchInput] = useState(q)

  useEffect(() => {
    setSearchInput(q)
  }, [q])

  const replaceParams = useCallback(
    (updates: Record<string, string | number | undefined | null>) => {
      const next = new URLSearchParams(searchParams)
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === null || value === '') {
          next.delete(key)
        } else {
          next.set(key, String(value))
        }
      }
      setSearchParams(next, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  useEffect(() => {
    const handle = window.setTimeout(() => {
      const trimmed = searchInput.trim()
      if (trimmed === q) {
        return
      }
      replaceParams({ q: trimmed, page: 1 })
    }, SEARCH_DEBOUNCE_MS)
    return () => window.clearTimeout(handle)
  }, [q, replaceParams, searchInput])

  const setDepartment = useCallback(
    (value: Department | '') => {
      replaceParams({ department: value, page: 1 })
    },
    [replaceParams],
  )

  const setStatus = useCallback(
    (value: EmploymentStatus | '') => {
      replaceParams({ status: value, page: 1 })
    },
    [replaceParams],
  )

  const setPage = useCallback(
    (value: number) => {
      replaceParams({ page: value })
    },
    [replaceParams],
  )

  const setPageSize = useCallback(
    (value: PageSize) => {
      replaceParams({ pageSize: value, page: 1 })
    },
    [replaceParams],
  )

  const clearFilters = useCallback(() => {
    setSearchInput('')
    replaceParams({
      q: '',
      department: '',
      status: '',
      page: 1,
    })
  }, [replaceParams])

  const hasActiveFilters = Boolean(q || department || status)

  const apiParams: ListEmployeesParams = useMemo(
    () => ({
      q,
      department,
      employmentStatus: status,
      page,
      pageSize,
    }),
    [department, page, pageSize, q, status],
  )

  return {
    q,
    department,
    status,
    page,
    pageSize,
    searchInput,
    setSearchInput,
    setDepartment,
    setStatus,
    setPage,
    setPageSize,
    clearFilters,
    hasActiveFilters,
    apiParams,
  }
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback
  }
  return parsed
}

function parsePageSize(value: string | null): PageSize {
  const parsed = Number(value)
  return (PAGE_SIZE_OPTIONS as readonly number[]).includes(parsed)
    ? (parsed as PageSize)
    : 10
}

function parseDepartment(value: string | null): Department | '' {
  if (!value) {
    return ''
  }
  return (DEPARTMENTS as readonly string[]).includes(value)
    ? (value as Department)
    : ''
}

function parseStatus(value: string | null): EmploymentStatus | '' {
  if (!value) {
    return ''
  }
  return (EMPLOYMENT_STATUSES as readonly string[]).includes(value)
    ? (value as EmploymentStatus)
    : ''
}
