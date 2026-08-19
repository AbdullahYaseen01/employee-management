import type {
  Employee,
  EmployeeWritePayload,
  ListEmployeesParams,
  PaginatedEmployees,
} from '@/features/employees/types/employee'

export interface EmployeeApi {
  listEmployees(
    params: ListEmployeesParams,
    options?: { signal?: AbortSignal },
  ): Promise<PaginatedEmployees>
  getEmployee(
    id: string,
    options?: { signal?: AbortSignal },
  ): Promise<Employee>
  createEmployee(payload: EmployeeWritePayload): Promise<Employee>
  updateEmployee(id: string, payload: EmployeeWritePayload): Promise<Employee>
  deactivateEmployee(id: string): Promise<Employee>
}
