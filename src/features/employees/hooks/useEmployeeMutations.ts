import { useMutation, useQueryClient } from '@tanstack/react-query'
import { employeeApi } from '@/features/employees/api/httpEmployeeApi'
import { employeeKeys } from '@/features/employees/api/queryKeys'
import type {
  Employee,
  EmployeeWritePayload,
} from '@/features/employees/types/employee'

export function useCreateEmployeeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: EmployeeWritePayload) =>
      employeeApi.createEmployee(payload),
    onSuccess: async (employee) => {
      queryClient.setQueryData(employeeKeys.detail(employee.id), employee)
      await queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
    },
  })
}

export function useUpdateEmployeeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string
      payload: EmployeeWritePayload
    }) => employeeApi.updateEmployee(id, payload),
    onSuccess: async (employee) => {
      queryClient.setQueryData(employeeKeys.detail(employee.id), employee)
      await queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
    },
  })
}

export function useDeactivateEmployeeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => employeeApi.deactivateEmployee(id),
    onSuccess: async (employee: Employee) => {
      queryClient.setQueryData(employeeKeys.detail(employee.id), employee)
      await queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
    },
  })
}
