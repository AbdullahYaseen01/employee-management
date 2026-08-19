import { Button } from '@/components/ui/Button'

interface EmployeePaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function EmployeePagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: EmployeePaginationProps) {
  if (totalItems === 0) {
    return null
  }

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="pagination">
      <p aria-live="polite">
        {start}-{end} of {totalItems}
      </p>
      <div className="pagination__controls">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <p>
          Page {page} of {totalPages}
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
