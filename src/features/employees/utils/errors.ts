export const API_ERROR_CODES = [
  'NETWORK',
  'NOT_FOUND',
  'VALIDATION',
  'CONFLICT',
  'SERVER',
  'ABORTED',
] as const

export type ApiErrorCode = (typeof API_ERROR_CODES)[number]

export class ApiError extends Error {
  readonly code: ApiErrorCode
  readonly status?: number

  constructor(message: string, code: ApiErrorCode, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

export function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (error instanceof Error && error.name === 'AbortError')
  )
}
