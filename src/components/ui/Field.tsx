import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { cx } from '@/lib/cx'

interface FieldProps {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  children: ReactNode
  className?: string
}

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: FieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined
  const errorId = error ? `${htmlFor}-error` : undefined
  return (
    <div className={cx('field', className)}>
      <label className="field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {hint ? (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      ) : null}
      {children}
      {error ? (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export function TextField({
  id,
  label,
  error,
  hint,
  className,
  ...props
}: TextFieldProps) {
  const fieldId = id ?? props.name ?? label
  const describedBy = [hint ? `${fieldId}-hint` : null, error ? `${fieldId}-error` : null]
    .filter(Boolean)
    .join(' ')
  const errorId = error ? `${fieldId}-error` : undefined
  return (
    <Field
      label={label}
      htmlFor={fieldId}
      error={error}
      hint={hint}
      className={className}
    >
      <input
        id={fieldId}
        className="field__control"
        {...props}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        aria-errormessage={errorId}
      />
    </Field>
  )
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  hint?: string
  children: ReactNode
}

export function SelectField({
  id,
  label,
  error,
  hint,
  className,
  children,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? props.name ?? label
  const describedBy = [hint ? `${fieldId}-hint` : null, error ? `${fieldId}-error` : null]
    .filter(Boolean)
    .join(' ')
  const errorId = error ? `${fieldId}-error` : undefined
  return (
    <Field
      label={label}
      htmlFor={fieldId}
      error={error}
      hint={hint}
      className={className}
    >
      <select
        id={fieldId}
        className="field__control"
        {...props}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        aria-errormessage={errorId}
      >
        {children}
      </select>
    </Field>
  )
}
