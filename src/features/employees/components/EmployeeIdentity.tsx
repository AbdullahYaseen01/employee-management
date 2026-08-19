import type { Department } from '@/features/employees/types/employee'
import { getInitials } from '@/features/employees/utils/employee'
import { cx } from '@/lib/cx'

export function EmployeeAvatar({
  firstName,
  lastName,
  department,
  className,
}: {
  firstName: string
  lastName: string
  department: Department
  className?: string
}) {
  return (
    <span
      className={cx('avatar', className)}
      data-department={department}
      aria-hidden="true"
    >
      {getInitials(firstName, lastName)}
    </span>
  )
}

export function DepartmentChip({ department }: { department: Department }) {
  return (
    <span className="dept-chip" data-department={department}>
      {department}
    </span>
  )
}
