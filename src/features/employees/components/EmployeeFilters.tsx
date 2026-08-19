import { Button } from '@/components/ui/Button'
import { SelectField, TextField } from '@/components/ui/Field'
import {
  DEPARTMENTS,
  EMPLOYMENT_STATUSES,
  PAGE_SIZE_OPTIONS,
  type Department,
  type EmploymentStatus,
  type PageSize,
} from '@/features/employees/types/employee'
import { EMPLOYMENT_STATUS_LABELS } from '@/features/employees/utils/employee'

interface EmployeeFiltersProps {
  searchInput: string
  onSearchChange: (value: string) => void
  department: Department | ''
  onDepartmentChange: (value: Department | '') => void
  status: EmploymentStatus | ''
  onStatusChange: (value: EmploymentStatus | '') => void
  pageSize: PageSize
  onPageSizeChange: (value: PageSize) => void
  onClear: () => void
  hasActiveFilters: boolean
}

export function EmployeeFilters({
  searchInput,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  pageSize,
  onPageSizeChange,
  onClear,
  hasActiveFilters,
}: EmployeeFiltersProps) {
  return (
    <div className="filters">
      <TextField
        id="employee-search"
        label="Search by name"
        type="search"
        name="q"
        autoComplete="off"
        spellCheck={false}
        placeholder="Search by first or last name…"
        value={searchInput}
        onChange={(event) => onSearchChange(event.target.value)}
      />
      <SelectField
        id="department-filter"
        label="Department"
        name="department"
        value={department}
        onChange={(event) =>
          onDepartmentChange(event.target.value as Department | '')
        }
      >
        <option value="">All departments</option>
        {DEPARTMENTS.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </SelectField>
      <SelectField
        id="status-filter"
        label="Employment status"
        name="status"
        value={status}
        onChange={(event) =>
          onStatusChange(event.target.value as EmploymentStatus | '')
        }
      >
        <option value="">All statuses</option>
        {EMPLOYMENT_STATUSES.map((item) => (
          <option key={item} value={item}>
            {EMPLOYMENT_STATUS_LABELS[item]}
          </option>
        ))}
      </SelectField>
      <SelectField
        id="page-size"
        label="Page size"
        name="pageSize"
        value={String(pageSize)}
        onChange={(event) =>
          onPageSizeChange(Number(event.target.value) as PageSize)
        }
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size} / page
          </option>
        ))}
      </SelectField>
      {hasActiveFilters ? (
        <Button variant="ghost" onClick={onClear}>
          Clear filters
        </Button>
      ) : null}
    </div>
  )
}
