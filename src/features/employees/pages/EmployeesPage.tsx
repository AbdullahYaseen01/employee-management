import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { DeactivateEmployeeDialog } from '@/features/employees/components/DeactivateEmployeeDialog'
import { EmployeeCardList } from '@/features/employees/components/EmployeeCardList'
import {
  EmployeeDetailsDialog,
  EmployeeFormDialog,
} from '@/features/employees/components/EmployeeDialogs'
import { EmployeeFilters } from '@/features/employees/components/EmployeeFilters'
import { EmployeePagination } from '@/features/employees/components/EmployeePagination'
import { EmployeeTable } from '@/features/employees/components/EmployeeTable'
import {
  EmployeeListSkeletons,
  EmptyDataset,
  FetchErrorState,
  NoMatchState,
} from '@/features/employees/components/EmployeeListStates'
import { useEmployeeListParams } from '@/features/employees/hooks/useEmployeeListParams'
import { useEmployeesQuery } from '@/features/employees/hooks/useEmployeesQuery'
import type { Employee } from '@/features/employees/types/employee'
import { EMPLOYMENT_STATUS_LABELS } from '@/features/employees/utils/employee'
import '@/features/employees/components/employees.css'

type DialogState =
  | { type: 'closed' }
  | { type: 'create' }
  | { type: 'view'; employee: Employee }
  | { type: 'edit'; employee: Employee }
  | { type: 'deactivate'; employee: Employee }

export function EmployeesPage() {
  const list = useEmployeeListParams()
  const query = useEmployeesQuery(list.apiParams)
  const [dialog, setDialog] = useState<DialogState>({ type: 'closed' })

  const data = query.data
  const showInitialLoading = query.isPending && !data
  const showBackgroundFetch = query.isFetching && Boolean(data)
  const employees = data?.items ?? []
  const hasUsefulCache = Boolean(data && data.items.length > 0)
  const isEmptyDirectory =
    !query.isError &&
    data !== undefined &&
    data.totalItems === 0 &&
    !list.hasActiveFilters
  const isNoMatch =
    !query.isError &&
    data !== undefined &&
    data.totalItems === 0 &&
    list.hasActiveFilters

  const filterSummary = useMemo(
    () => buildFilterSummary(list.q, list.department, list.status),
    [list.department, list.q, list.status],
  )

  function openCreate() {
    setDialog({ type: 'create' })
  }

  return (
    <section>
      <header className="page-header">
        <div>
          <p className="page-kicker">Directory</p>
          <h1>Employees</h1>
          <p className="page-header__copy">
            Search, filter, and maintain the people directory. Records stay in
            this browser session until you reset the demo data.
          </p>
          {data ? (
            <div className="metric-row">
              <p className="metric-chip">
                {data.totalItems}{' '}
                {data.totalItems === 1 ? 'employee' : 'employees'}
              </p>
            </div>
          ) : null}
        </div>
        <Button onClick={openCreate}>Add employee</Button>
      </header>

      <div className="filter-panel surface-card">
        <EmployeeFilters
          searchInput={list.searchInput}
          onSearchChange={list.setSearchInput}
          department={list.department}
          onDepartmentChange={list.setDepartment}
          status={list.status}
          onStatusChange={list.setStatus}
          pageSize={list.pageSize}
          onPageSizeChange={list.setPageSize}
          onClear={list.clearFilters}
          hasActiveFilters={list.hasActiveFilters}
        />
      </div>

      {list.hasActiveFilters && filterSummary ? (
        <div className="filter-summary">
          <p>{filterSummary}</p>
          <Button variant="ghost" size="sm" onClick={list.clearFilters}>
            Clear filters
          </Button>
        </div>
      ) : null}

      {showBackgroundFetch ? (
        <div className="refetch-bar" aria-live="polite">
          <span className="btn__spinner" aria-hidden="true" />
          Updating directory…
        </div>
      ) : null}

      {query.isError ? (
        <FetchErrorState
          onRetry={() => {
            void query.refetch()
          }}
          hasCachedData={hasUsefulCache}
        />
      ) : null}

      {showInitialLoading ? <EmployeeListSkeletons /> : null}

      {!showInitialLoading && isEmptyDirectory ? (
        <EmptyDataset onAdd={openCreate} />
      ) : null}

      {!showInitialLoading && isNoMatch ? (
        <NoMatchState onClear={list.clearFilters} />
      ) : null}

      {!showInitialLoading && employees.length > 0 ? (
        <div className="surface-card">
          <EmployeeTable
            employees={employees}
            onView={(employee) => setDialog({ type: 'view', employee })}
            onEdit={(employee) => setDialog({ type: 'edit', employee })}
            onDeactivate={(employee) =>
              setDialog({ type: 'deactivate', employee })
            }
          />
          <EmployeeCardList
            employees={employees}
            onView={(employee) => setDialog({ type: 'view', employee })}
            onEdit={(employee) => setDialog({ type: 'edit', employee })}
            onDeactivate={(employee) =>
              setDialog({ type: 'deactivate', employee })
            }
          />
          <EmployeePagination
            page={data?.page ?? list.page}
            totalPages={data?.totalPages ?? 0}
            totalItems={data?.totalItems ?? 0}
            pageSize={data?.pageSize ?? list.pageSize}
            onPageChange={list.setPage}
          />
        </div>
      ) : null}

      <EmployeeFormDialog
        open={dialog.type === 'create'}
        mode="create"
        onOpenChange={(open) => {
          if (!open) setDialog({ type: 'closed' })
        }}
      />
      <EmployeeFormDialog
        open={dialog.type === 'edit'}
        mode="edit"
        employee={dialog.type === 'edit' ? dialog.employee : undefined}
        onOpenChange={(open) => {
          if (!open) setDialog({ type: 'closed' })
        }}
      />
      <EmployeeDetailsDialog
        open={dialog.type === 'view'}
        employee={dialog.type === 'view' ? dialog.employee : undefined}
        onOpenChange={(open) => {
          if (!open) setDialog({ type: 'closed' })
        }}
        onEdit={() => {
          if (dialog.type === 'view') {
            setDialog({ type: 'edit', employee: dialog.employee })
          }
        }}
        onDeactivate={() => {
          if (dialog.type === 'view') {
            setDialog({ type: 'deactivate', employee: dialog.employee })
          }
        }}
      />
      <DeactivateEmployeeDialog
        open={dialog.type === 'deactivate'}
        employee={dialog.type === 'deactivate' ? dialog.employee : undefined}
        onOpenChange={(open) => {
          if (!open) setDialog({ type: 'closed' })
        }}
      />
    </section>
  )
}

function buildFilterSummary(
  q: string,
  department: string,
  status: string,
): string {
  const parts: string[] = []
  if (q) {
    parts.push(`“${q}”`)
  }
  if (department) {
    parts.push(department)
  }
  if (status === 'active' || status === 'inactive' || status === 'on_leave') {
    parts.push(EMPLOYMENT_STATUS_LABELS[status])
  }
  if (parts.length === 0) {
    return ''
  }
  return `Showing results for ${parts.join(', ')}.`
}
