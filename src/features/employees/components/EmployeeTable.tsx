import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmployeeActionsMenu } from '@/features/employees/components/EmployeeActionsMenu'
import {
  DepartmentChip,
  EmployeeAvatar,
} from '@/features/employees/components/EmployeeIdentity'
import type { Employee } from '@/features/employees/types/employee'
import {
  formatJoiningDate,
  getEmployeeFullName,
} from '@/features/employees/utils/employee'

interface EmployeeTableProps {
  employees: Employee[]
  onView: (employee: Employee) => void
  onEdit: (employee: Employee) => void
  onDeactivate: (employee: Employee) => void
}

export function EmployeeTable({
  employees,
  onView,
  onEdit,
  onDeactivate,
}: EmployeeTableProps) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="sr-only">Employee directory</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Employee ID</th>
            <th scope="col">Job title</th>
            <th scope="col">Department</th>
            <th scope="col">Status</th>
            <th scope="col">Joining date</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => {
            const fullName = getEmployeeFullName(employee)
            return (
              <tr key={employee.id}>
                <td>
                  <div className="name-cell">
                    <EmployeeAvatar
                      firstName={employee.firstName}
                      lastName={employee.lastName}
                      department={employee.department}
                    />
                    <div className="cell-primary cell-clip" title={fullName}>
                      {fullName}
                    </div>
                  </div>
                </td>
                <td className="cell-id">{employee.employeeId}</td>
                <td>
                  <div className="cell-clip" title={employee.jobTitle}>
                    {employee.jobTitle}
                  </div>
                </td>
                <td>
                  <DepartmentChip department={employee.department} />
                </td>
                <td>
                  <StatusBadge status={employee.employmentStatus} />
                </td>
                <td className="cell-date">
                  {formatJoiningDate(employee.joiningDate)}
                </td>
                <td>
                  <EmployeeActionsMenu
                    employee={employee}
                    onView={() => onView(employee)}
                    onEdit={() => onEdit(employee)}
                    onDeactivate={() => onDeactivate(employee)}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
