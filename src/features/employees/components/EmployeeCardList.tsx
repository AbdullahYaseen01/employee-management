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

interface EmployeeCardListProps {
  employees: Employee[]
  onView: (employee: Employee) => void
  onEdit: (employee: Employee) => void
  onDeactivate: (employee: Employee) => void
}

export function EmployeeCardList({
  employees,
  onView,
  onEdit,
  onDeactivate,
}: EmployeeCardListProps) {
  return (
    <div className="card-list">
      {employees.map((employee) => {
        const fullName = getEmployeeFullName(employee)
        return (
          <article
            key={employee.id}
            className="employee-card"
            aria-label={fullName}
          >
            <header>
              <div className="employee-card__identity">
                <EmployeeAvatar
                  firstName={employee.firstName}
                  lastName={employee.lastName}
                  department={employee.department}
                />
                <div>
                  <p className="employee-card__name">{fullName}</p>
                  <p className="employee-card__id">{employee.employeeId}</p>
                </div>
              </div>
              <EmployeeActionsMenu
                employee={employee}
                onView={() => onView(employee)}
                onEdit={() => onEdit(employee)}
                onDeactivate={() => onDeactivate(employee)}
              />
            </header>
            <dl>
              <dt>Job title</dt>
              <dd>{employee.jobTitle}</dd>
              <dt>Department</dt>
              <dd>
                <DepartmentChip department={employee.department} />
              </dd>
              <dt>Status</dt>
              <dd>
                <StatusBadge status={employee.employmentStatus} />
              </dd>
              <dt>Joining date</dt>
              <dd>{formatJoiningDate(employee.joiningDate)}</dd>
            </dl>
          </article>
        )
      })}
    </div>
  )
}
