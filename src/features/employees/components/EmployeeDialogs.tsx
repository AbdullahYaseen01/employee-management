import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmployeeForm } from '@/features/employees/components/EmployeeForm'
import {
  DepartmentChip,
  EmployeeAvatar,
} from '@/features/employees/components/EmployeeIdentity'
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
} from '@/features/employees/hooks/useEmployeeMutations'
import type { EmployeeFormValues } from '@/features/employees/schemas/employeeFormSchema'
import type { Employee } from '@/features/employees/types/employee'
import { getEmployeeFullName } from '@/features/employees/utils/employee'
import { useAnnounce } from '@/app/announce'
import { toast } from 'sonner'

interface EmployeeFormDialogProps {
  open: boolean
  mode: 'create' | 'edit'
  employee?: Employee
  onOpenChange: (open: boolean) => void
}

export function EmployeeFormDialog({
  open,
  mode,
  employee,
  onOpenChange,
}: EmployeeFormDialogProps) {
  const announce = useAnnounce()
  const createMutation = useCreateEmployeeMutation()
  const updateMutation = useUpdateEmployeeMutation()
  const mutation = mode === 'create' ? createMutation : updateMutation

  async function handleSubmit(values: EmployeeFormValues) {
    try {
      if (mode === 'create') {
        const created = await createMutation.mutateAsync(values)
        const message = `${getEmployeeFullName(created)} was added to the directory.`
        toast.success(message)
        announce(message)
        onOpenChange(false)
        return
      }
      if (!employee) {
        return
      }
      const updated = await updateMutation.mutateAsync({
        id: employee.id,
        payload: values,
      })
      const message = `${getEmployeeFullName(updated)} was updated.`
      toast.success(message)
      announce(message)
      onOpenChange(false)
    } catch {
      // Keep the dialog open and preserve field values for retry.
    }
  }

  return (
    <Modal
      open={open}
      dismissible={!mutation.isPending}
      onOpenChange={(next) => {
        if (mutation.isPending) {
          return
        }
        if (!next) {
          mutation.reset()
        }
        onOpenChange(next)
      }}
      title={mode === 'create' ? 'Add employee' : 'Edit employee'}
      description={
        mode === 'create'
          ? 'Create a new employee record. All fields are required.'
          : 'Update this employee record. The employee ID cannot be changed.'
      }
    >
      {open ? (
        <EmployeeForm
          mode={mode}
          employee={employee}
          isSubmitting={mutation.isPending}
          apiError={mutation.error}
          onCancel={() => onOpenChange(false)}
          onSubmit={handleSubmit}
        />
      ) : null}
    </Modal>
  )
}

interface EmployeeDetailsDialogProps {
  open: boolean
  employee?: Employee
  onOpenChange: (open: boolean) => void
  onEdit: () => void
  onDeactivate: () => void
}

export function EmployeeDetailsDialog({
  open,
  employee,
  onOpenChange,
  onEdit,
  onDeactivate,
}: EmployeeDetailsDialogProps) {
  if (!employee) {
    return null
  }

  const fullName = getEmployeeFullName(employee)

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={fullName}
      description="Employee record details."
    >
      <div className="details-hero">
        <EmployeeAvatar
          firstName={employee.firstName}
          lastName={employee.lastName}
          department={employee.department}
        />
        <div className="details-hero__meta">
          <DepartmentChip department={employee.department} />
          <StatusBadge status={employee.employmentStatus} />
        </div>
      </div>
      <dl className="details-list">
        <dt>Employee ID</dt>
        <dd>{employee.employeeId}</dd>
        <dt>Email</dt>
        <dd>{employee.email}</dd>
        <dt>Job title</dt>
        <dd>{employee.jobTitle}</dd>
        <dt>Department</dt>
        <dd>{employee.department}</dd>
        <dt>Employment status</dt>
        <dd>
          <StatusBadge status={employee.employmentStatus} />
        </dd>
        <dt>Joining date</dt>
        <dd>
          {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }).format(new Date(`${employee.joiningDate}T00:00:00`))}
        </dd>
      </dl>
      <div className="dialog-actions">
        {employee.employmentStatus !== 'inactive' ? (
          <Button variant="danger" onClick={onDeactivate}>
            Deactivate employee
          </Button>
        ) : null}
        <Button variant="secondary" onClick={onEdit}>
          Edit employee
        </Button>
      </div>
    </Modal>
  )
}
