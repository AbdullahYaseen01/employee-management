import { z } from 'zod'
import {
  DEPARTMENTS,
  EMPLOYMENT_STATUSES,
  type Department,
  type EmploymentStatus,
} from '@/features/employees/types/employee'
import { isValidIsoDate } from '@/features/employees/utils/employee'

export const employeeFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required.'),
  lastName: z.string().trim().min(1, 'Last name is required.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required.')
    .email('Enter a valid email address.'),
  jobTitle: z.string().trim().min(1, 'Job title is required.'),
  department: z
    .string()
    .trim()
    .min(1, 'Department is required.')
    .refine(
      (value): value is Department =>
        (DEPARTMENTS as readonly string[]).includes(value),
      'Select a department.',
    ),
  employmentStatus: z
    .string()
    .trim()
    .min(1, 'Employment status is required.')
    .refine(
      (value): value is EmploymentStatus =>
        (EMPLOYMENT_STATUSES as readonly string[]).includes(value),
      'Select an employment status.',
    ),
  joiningDate: z
    .string()
    .trim()
    .min(1, 'Joining date is required.')
    .refine(isValidIsoDate, 'Enter a valid joining date.'),
})

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>

export const defaultEmployeeFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  jobTitle: '',
  department: '',
  employmentStatus: '',
  joiningDate: '',
}
