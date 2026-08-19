import { Button } from '@/components/ui/Button'
import { ErrorBanner } from '@/components/ui/ErrorBanner'
import { Skeleton } from '@/components/ui/Skeleton'

interface EmployeeListSkeletonsProps {
  rows?: number
}

export function EmployeeListSkeletons({ rows = 8 }: EmployeeListSkeletonsProps) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading employees…</span>
      <div className="table-wrap">
        <table className="data-table">
          <caption className="sr-only">Loading employee directory</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Employee ID</th>
              <th scope="col">Job title</th>
              <th scope="col">Department</th>
              <th scope="col">Status</th>
              <th scope="col">Joining date</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, index) => (
              <tr key={index}>
                {Array.from({ length: 7 }, (_, cell) => (
                  <td key={cell}>
                    <Skeleton height="0.9rem" width={cell === 0 ? '70%' : '55%'} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-list">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="employee-card surface-card">
            <Skeleton height="1.2rem" width="60%" />
            <Skeleton height="0.9rem" width="40%" />
            <Skeleton height="0.9rem" width="80%" />
            <Skeleton height="0.9rem" width="50%" />
          </div>
        ))}
      </div>
    </div>
  )
}

interface EmptyDatasetProps {
  onAdd: () => void
}

export function EmptyDataset({ onAdd }: EmptyDatasetProps) {
  return (
    <div className="empty-state empty-state--empty surface-card">
      <span className="empty-state__icon" aria-hidden="true">
        +
      </span>
      <h2>No employees have been added</h2>
      <p>
        The directory is empty. Add the first employee to start managing records,
        departments, and employment status.
      </p>
      <Button onClick={onAdd}>Add employee</Button>
    </div>
  )
}

interface NoMatchStateProps {
  onClear: () => void
}

export function NoMatchState({ onClear }: NoMatchStateProps) {
  return (
    <div className="empty-state empty-state--nomatch surface-card">
      <span className="empty-state__icon" aria-hidden="true">
        ?
      </span>
      <h2>No employees match the current criteria</h2>
      <p>
        Try a different name, department, or employment status, or clear the
        filters to see the full directory.
      </p>
      <Button variant="secondary" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  )
}

interface FetchErrorStateProps {
  onRetry: () => void
  hasCachedData: boolean
}

export function FetchErrorState({ onRetry, hasCachedData }: FetchErrorStateProps) {
  if (hasCachedData) {
    return (
      <ErrorBanner
        title="Unable to refresh employees"
        message="Showing the last loaded directory while the latest request failed."
        onRetry={onRetry}
      />
    )
  }

  return (
    <div className="empty-state empty-state--error surface-card" role="alert">
      <span className="empty-state__icon" aria-hidden="true">
        !
      </span>
      <h2>Unable to load employees</h2>
      <p>
        The employee directory could not be retrieved. Check your connection and
        try again.
      </p>
      <Button onClick={onRetry}>Retry</Button>
    </div>
  )
}
