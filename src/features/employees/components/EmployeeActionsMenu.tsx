import type { Employee } from '@/features/employees/types/employee'
import { Button } from '@/components/ui/Button'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

interface EmployeeActionsMenuProps {
  employee: Employee
  onView: () => void
  onEdit: () => void
  onDeactivate: () => void
}

export function EmployeeActionsMenu({
  employee,
  onView,
  onEdit,
  onDeactivate,
}: EmployeeActionsMenuProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="secondary"
          size="sm"
          aria-label={`Actions for ${employee.firstName} ${employee.lastName}`}
        >
          Actions
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="menu-content" align="end" sideOffset={6}>
          <DropdownMenu.Item className="menu-item" onSelect={onView}>
            View employee
          </DropdownMenu.Item>
          <DropdownMenu.Item className="menu-item" onSelect={onEdit}>
            Edit employee
          </DropdownMenu.Item>
          {employee.employmentStatus !== 'inactive' ? (
            <DropdownMenu.Item
              className="menu-item menu-item--danger"
              onSelect={onDeactivate}
            >
              Deactivate employee
            </DropdownMenu.Item>
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
