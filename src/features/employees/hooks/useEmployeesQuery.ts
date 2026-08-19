import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { employeeApi } from '@/features/employees/api/httpEmployeeApi'
import { employeeKeys } from '@/features/employees/api/queryKeys'
import type { ListEmployeesParams } from '@/features/employees/types/employee'

export function useEmployeesQuery(params: ListEmployeesParams) {
  return useQuery({
    queryKey: employeeKeys.list(params),
    queryFn: ({ signal }) => employeeApi.listEmployees(params, { signal }),
    placeholderData: keepPreviousData,
    retry: false,
  })
}

export function useEmployeeQuery(id: string | null) {
  return useQuery({
    queryKey: employeeKeys.detail(id ?? ''),
    queryFn: ({ signal }) => employeeApi.getEmployee(id ?? '', { signal }),
    enabled: Boolean(id),
    retry: false,
  })
}
