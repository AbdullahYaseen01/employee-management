import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { SelectField, TextField } from '@/components/ui/Field'
import {
  defaultEmployeeFormValues,
  employeeFormSchema,
  type EmployeeFormValues,
} from '@/features/employees/schemas/employeeFormSchema'
import {
  DEPARTMENTS,
  EMPLOYMENT_STATUSES,
  type Employee,
} from '@/features/employees/types/employee'
import { EMPLOYMENT_STATUS_LABELS } from '@/features/employees/utils/employee'
import { getErrorMessage } from '@/features/employees/utils/errors'

interface EmployeeFormProps {
  mode: 'create' | 'edit'
  employee?: Employee
  onSubmit: (values: EmployeeFormValues) => Promise<void>
  onCancel: () => void
  isSubmitting: boolean
  apiError: unknown
}

type EmployeeFormInput = z.input<typeof employeeFormSchema>

export function EmployeeForm({
  mode,
  employee,
  onSubmit,
  onCancel,
  isSubmitting,
  apiError,
}: EmployeeFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<EmployeeFormInput, unknown, EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues:
      mode === 'edit' && employee
        ? toFormValues(employee)
        : defaultEmployeeFormValues,
  })

  useEffect(() => {
    if (mode === 'edit' && employee) {
      reset(toFormValues(employee))
    }
    if (mode === 'create') {
      reset(defaultEmployeeFormValues)
    }
  }, [employee, mode, reset])

  const formError = apiError
    ? getErrorMessage(apiError, 'Unable to save this employee. Try again.')
    : null

  return (
    <form
      noValidate
      className="form-grid"
      onSubmit={handleSubmit(
        async (values) => {
          if (isSubmitting) {
            return
          }
          await onSubmit(values)
        },
        (fieldErrors) => {
          const order = [
            'firstName',
            'lastName',
            'email',
            'jobTitle',
            'department',
            'employmentStatus',
            'joiningDate',
          ] as const
          const first = order.find((key) => fieldErrors[key])
          if (first) {
            setFocus(first)
          }
        },
      )}
    >
      {formError ? (
        <p className="form-error" role="alert">
          {formError}
        </p>
      ) : null}

      {mode === 'edit' && employee ? (
        <TextField
          className="field--full"
          label="Employee ID"
          value={employee.employeeId}
          readOnly
        />
      ) : null}

      <TextField
        label="First name"
        autoComplete="given-name"
        disabled={isSubmitting}
        error={errors.firstName?.message}
        {...register('firstName')}
      />
      <TextField
        label="Last name"
        autoComplete="family-name"
        disabled={isSubmitting}
        error={errors.lastName?.message}
        {...register('lastName')}
      />
      <TextField
        className="field--full"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        spellCheck={false}
        disabled={isSubmitting}
        error={errors.email?.message}
        {...register('email')}
      />
      <TextField
        className="field--full"
        label="Job title"
        autoComplete="organization-title"
        disabled={isSubmitting}
        error={errors.jobTitle?.message}
        {...register('jobTitle')}
      />
      <SelectField
        label="Department"
        disabled={isSubmitting}
        error={errors.department?.message}
        {...register('department')}
      >
        <option value="">Select department</option>
        {DEPARTMENTS.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </SelectField>
      <SelectField
        label="Employment status"
        disabled={isSubmitting}
        error={errors.employmentStatus?.message}
        {...register('employmentStatus')}
      >
        <option value="">Select status</option>
        {EMPLOYMENT_STATUSES.map((status) => (
          <option key={status} value={status}>
            {EMPLOYMENT_STATUS_LABELS[status]}
          </option>
        ))}
      </SelectField>
      <TextField
        className="field--full"
        label="Joining date"
        type="date"
        disabled={isSubmitting}
        error={errors.joiningDate?.message}
        {...register('joiningDate')}
      />

      <div className="dialog-actions field--full">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {isSubmitting
            ? mode === 'create'
              ? 'Adding employee…'
              : 'Saving changes…'
            : mode === 'create'
              ? 'Add employee'
              : 'Save changes'}
        </Button>
      </div>
    </form>
  )
}

function toFormValues(employee: Employee): EmployeeFormValues {
  return {
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    jobTitle: employee.jobTitle,
    department: employee.department,
    employmentStatus: employee.employmentStatus,
    joiningDate: employee.joiningDate,
  }
}
