import type { EmploymentStatus } from '@/features/employees/types/employee'
import { EMPLOYMENT_STATUS_LABELS } from '@/features/employees/utils/employee'
import { cx } from '@/lib/cx'

interface StatusBadgeProps {
  status: EmploymentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cx('badge', `badge--${status}`)}>
      <span className="badge__dot" aria-hidden="true" />
      {EMPLOYMENT_STATUS_LABELS[status]}
    </span>
  )
}
