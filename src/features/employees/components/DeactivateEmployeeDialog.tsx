import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { useDeactivateEmployeeMutation } from '@/features/employees/hooks/useEmployeeMutations'
import type { Employee } from '@/features/employees/types/employee'
import { getEmployeeFullName } from '@/features/employees/utils/employee'
import { getErrorMessage } from '@/features/employees/utils/errors'
import { useAnnounce } from '@/app/announce'
import { toast } from 'sonner'

interface DeactivateEmployeeDialogProps {
  open: boolean
  employee?: Employee
  onOpenChange: (open: boolean) => void
}

export function DeactivateEmployeeDialog({
  open,
  employee,
  onOpenChange,
}: DeactivateEmployeeDialogProps) {
  const announce = useAnnounce()
  const mutation = useDeactivateEmployeeMutation()

  if (!employee) {
    return null
  }

  const fullName = getEmployeeFullName(employee)

  async function handleConfirm() {
    if (!employee || mutation.isPending) {
      return
    }
    try {
      await mutation.mutateAsync(employee.id)
      const message = `${fullName} is now inactive.`
      toast.success(message)
      announce(message)
      onOpenChange(false)
    } catch {
      // Keep the confirmation dialog open so the user can retry.
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
      title={`Deactivate ${fullName}?`}
      description={`This will set employee ${employee.employeeId} to Inactive. They will remain in the directory, and their current record will not be deleted.`}
    >
      {mutation.error ? (
        <p className="form-error" role="alert">
          {getErrorMessage(
            mutation.error,
            'Unable to deactivate this employee. Try again.',
          )}
        </p>
      ) : null}
      <div className="dialog-actions">
        <Button
          variant="secondary"
          onClick={() => onOpenChange(false)}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          loading={mutation.isPending}
          onClick={() => {
            void handleConfirm()
          }}
        >
          {mutation.isPending ? 'Deactivating…' : 'Deactivate employee'}
        </Button>
      </div>
    </Modal>
  )
}
