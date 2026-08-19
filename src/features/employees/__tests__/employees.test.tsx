import { http, HttpResponse, delay } from 'msw'
import { screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderEmployeesPage } from '@/test/test-utils'
import { setDemoScenario, setMockLatency } from '@/mocks/demoController'
import { server } from '@/mocks/server'

async function waitForDirectory() {
  await screen.findAllByRole('button', { name: 'Actions for James Chen' })
}

async function openJamesAction(
  user: ReturnType<typeof renderEmployeesPage>['user'],
  action: 'View employee' | 'Edit employee' | 'Deactivate employee',
) {
  const triggers = screen.getAllByRole('button', {
    name: 'Actions for James Chen',
  })
  await user.click(triggers[0]!)
  await user.click(await screen.findByRole('menuitem', { name: action }))
}

function expectText(text: string) {
  expect(screen.getAllByText(text).length).toBeGreaterThan(0)
}

function expectNoText(text: string) {
  expect(screen.queryAllByText(text)).toHaveLength(0)
}

describe('Employee list', () => {
  it('renders employee data in an accessible table', async () => {
    renderEmployeesPage()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Employees' }),
    ).toBeInTheDocument()
    await waitForDirectory()
    expectText('EMP-1002')
    expect(
      screen.getByRole('table', { name: 'Employee directory' }),
    ).toBeInTheDocument()
  })

  it('filters by employee name from the search field', async () => {
    const { user } = renderEmployeesPage()
    await waitForDirectory()

    await user.type(screen.getByLabelText('Search by name'), 'amina')

    await screen.findAllByText('Amina Okonkwo')
    await waitFor(() => {
      expectNoText('James Chen')
    })
  })

  it('filters by department', async () => {
    const { user, router } = renderEmployeesPage()
    await waitForDirectory()

    await user.selectOptions(screen.getByLabelText('Department'), 'Engineering')

    await screen.findAllByText('Amina Okonkwo')
    expectText('Staff Engineer')
    await waitFor(() => {
      expectNoText('James Chen')
      expect(router.state.location.search).toContain('department=Engineering')
    })
  })

  it('filters by employment status', async () => {
    const { user, router } = renderEmployeesPage()
    await waitForDirectory()

    await user.selectOptions(
      screen.getByLabelText('Employment status'),
      'on_leave',
    )

    await screen.findAllByText('Priya Nair')
    await waitFor(() => {
      expectNoText('James Chen')
      expect(router.state.location.search).toContain('status=on_leave')
    })
  })

  it('clears search and filters', async () => {
    const { user } = renderEmployeesPage(
      '/?q=Amina&department=Engineering&status=active',
    )

    await screen.findAllByText('Amina Okonkwo')
    expectNoText('James Chen')

    await user.click(screen.getAllByRole('button', { name: 'Clear filters' })[0]!)

    await waitForDirectory()
    expect(screen.getByLabelText('Search by name')).toHaveValue('')
  })

  it('opens employee details from the actions menu', async () => {
    const { user } = renderEmployeesPage()
    await waitForDirectory()
    await openJamesAction(user, 'View employee')

    const dialog = await screen.findByRole('dialog', { name: 'James Chen' })
    expect(within(dialog).getByText('james.chen@meridian.test')).toBeInTheDocument()
    expect(within(dialog).getByText('Finance Manager')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Edit employee' })).toBeInTheDocument()
    expect(
      within(dialog).getByRole('button', { name: 'Deactivate employee' }),
    ).toBeInTheDocument()
  })

  it('paginates results and keeps state in the URL', async () => {
    const { user, router } = renderEmployeesPage()
    await waitForDirectory()

    await user.click(screen.getByRole('button', { name: 'Next' }))

    await waitFor(() => {
      expectNoText('James Chen')
      expect(router.state.location.search).toContain('page=2')
    })
    expect(screen.getByText(/of 42/)).toBeInTheDocument()
  })

  it('reflects list state from URL parameters', async () => {
    renderEmployeesPage('/?q=Chen&pageSize=5')

    await waitForDirectory()
    expect(screen.getByLabelText('Search by name')).toHaveValue('Chen')
    expect(screen.getByLabelText('Page size')).toHaveValue('5')
    expectNoText('Hannah Brooks')
  })
})

describe('Loading, empty, and error states', () => {
  it('shows loading skeletons instead of an empty message', async () => {
    server.use(
      http.get('/api/employees', async () => {
        await delay(2500)
        return HttpResponse.json({
          items: [],
          page: 1,
          pageSize: 10,
          totalItems: 0,
          totalPages: 0,
        })
      }),
    )

    renderEmployeesPage()

    expect(await screen.findByText(/Loading employees/)).toBeInTheDocument()
    expect(
      screen.queryByText('No employees have been added'),
    ).not.toBeInTheDocument()
  })

  it('shows the empty dataset state', async () => {
    setDemoScenario('empty')
    renderEmployeesPage()

    expect(
      await screen.findByRole('heading', {
        name: 'No employees have been added',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: 'Add employee' }).length,
    ).toBeGreaterThan(0)
  })

  it('shows the no-match state when filters exclude everyone', async () => {
    renderEmployeesPage('/?q=zzz-no-such-employee')

    expect(
      await screen.findByRole('heading', {
        name: 'No employees match the current criteria',
      }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('button', { name: 'Clear filters' }).length,
    ).toBeGreaterThan(0)
  })

  it('shows a fetch error with retry that reloads data', async () => {
    setDemoScenario('fetch-error')
    const { user } = renderEmployeesPage()

    expect(
      await screen.findByRole('heading', { name: 'Unable to load employees' }),
    ).toBeInTheDocument()
    const retry = screen.getByRole('button', { name: 'Retry' })

    setDemoScenario('normal')
    await user.click(retry)

    await waitForDirectory()
  })
})

describe('Employee create form', () => {
  it('validates required fields and invalid email', async () => {
    const { user } = renderEmployeesPage()
    await waitForDirectory()
    await user.click(screen.getByRole('button', { name: 'Add employee' }))

    const dialog = await screen.findByRole('dialog', { name: 'Add employee' })
    await user.click(within(dialog).getByRole('button', { name: 'Add employee' }))

    expect(await within(dialog).findByText('First name is required.')).toBeInTheDocument()
    expect(within(dialog).getByText('Last name is required.')).toBeInTheDocument()
    expect(within(dialog).getByText('Email is required.')).toBeInTheDocument()
    expect(within(dialog).getByText('Job title is required.')).toBeInTheDocument()
    expect(within(dialog).getByText('Department is required.')).toBeInTheDocument()
    expect(within(dialog).getByText('Employment status is required.')).toBeInTheDocument()
    expect(within(dialog).getByText('Joining date is required.')).toBeInTheDocument()

    await user.type(within(dialog).getByLabelText('Email'), 'not-an-email')
    await user.click(within(dialog).getByRole('button', { name: 'Add employee' }))
    expect(
      await within(dialog).findByText('Enter a valid email address.'),
    ).toBeInTheDocument()
  })

  it('creates an employee and shows a loading state', async () => {
    setMockLatency(250)
    const { user } = renderEmployeesPage()
    await waitForDirectory()
    await user.click(screen.getByRole('button', { name: 'Add employee' }))

    const dialog = await screen.findByRole('dialog', { name: 'Add employee' })
    await fillEmployeeForm(user, dialog)
    await user.click(within(dialog).getByRole('button', { name: 'Add employee' }))

    expect(
      await within(dialog).findByRole('button', { name: /Adding employee/ }),
    ).toBeDisabled()
    await screen.findAllByText('Aaron Adebayo')
    expect(screen.queryByRole('dialog', { name: 'Add employee' })).not.toBeInTheDocument()
  })

  it('preserves values after a create failure and allows retry', async () => {
    setDemoScenario('create-error')
    const { user } = renderEmployeesPage()
    await waitForDirectory()
    await user.click(screen.getByRole('button', { name: 'Add employee' }))

    const dialog = await screen.findByRole('dialog', { name: 'Add employee' })
    await fillEmployeeForm(user, dialog)
    await user.click(within(dialog).getByRole('button', { name: 'Add employee' }))

    expect(
      await within(dialog).findByText(
        'The directory service could not create this employee.',
      ),
    ).toBeInTheDocument()
    expect(within(dialog).getByLabelText('First name')).toHaveValue('Aaron')
    expect(within(dialog).getByLabelText('Email')).toHaveValue(
      'aaron.adebayo@meridian.test',
    )

    setDemoScenario('normal')
    await user.click(within(dialog).getByRole('button', { name: 'Add employee' }))
    await screen.findAllByText('Aaron Adebayo')
  })
})

describe('Employee edit form', () => {
  it('populates the form and updates the list', async () => {
    const { user } = renderEmployeesPage()
    await waitForDirectory()
    await openJamesAction(user, 'Edit employee')

    const dialog = await screen.findByRole('dialog', { name: 'Edit employee' })
    expect(within(dialog).getByLabelText('First name')).toHaveValue('James')
    expect(within(dialog).getByLabelText('Employee ID')).toHaveValue('EMP-1002')

    await user.clear(within(dialog).getByLabelText('Job title'))
    await user.type(within(dialog).getByLabelText('Job title'), 'Director of Finance')
    await user.click(within(dialog).getByRole('button', { name: 'Save changes' }))

    await screen.findAllByText('Director of Finance')
    expectNoText('Finance Manager')
  })

  it('keeps edit failures recoverable', async () => {
    setDemoScenario('edit-error')
    const { user } = renderEmployeesPage()
    await waitForDirectory()
    await openJamesAction(user, 'Edit employee')

    const dialog = await screen.findByRole('dialog', { name: 'Edit employee' })
    await user.clear(within(dialog).getByLabelText('Job title'))
    await user.type(within(dialog).getByLabelText('Job title'), 'Director of Finance')
    await user.click(within(dialog).getByRole('button', { name: 'Save changes' }))

    expect(
      await within(dialog).findByText(
        'The directory service could not save these changes.',
      ),
    ).toBeInTheDocument()
    expect(within(dialog).getByLabelText('Job title')).toHaveValue(
      'Director of Finance',
    )

    setDemoScenario('normal')
    await user.click(within(dialog).getByRole('button', { name: 'Save changes' }))
    await screen.findAllByText('Director of Finance')
  })
})

describe('Deactivation', () => {
  it('requires confirmation and cancel performs no mutation', async () => {
    const { user } = renderEmployeesPage()
    await waitForDirectory()
    await openJamesAction(user, 'Deactivate employee')

    const dialog = await screen.findByRole('dialog', {
      name: 'Deactivate James Chen?',
    })
    expect(within(dialog).getByText(/EMP-1002/)).toBeInTheDocument()
    expect(within(dialog).getByText(/Inactive/)).toBeInTheDocument()

    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }))
    expect(
      screen.queryByRole('dialog', { name: 'Deactivate James Chen?' }),
    ).not.toBeInTheDocument()
    expect(screen.getAllByText('Active').length).toBeGreaterThan(0)
  })

  it('deactivates after confirm and does not show inactive on failure', async () => {
    setDemoScenario('deactivate-error')
    const { user } = renderEmployeesPage()
    await waitForDirectory()
    await openJamesAction(user, 'Deactivate employee')

    const dialog = await screen.findByRole('dialog', {
      name: 'Deactivate James Chen?',
    })
    await user.click(
      within(dialog).getByRole('button', { name: 'Deactivate employee' }),
    )

    expect(
      await within(dialog).findByText(
        'The directory service could not deactivate this employee.',
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('dialog', { name: 'Deactivate James Chen?' }),
    ).toBeInTheDocument()

    const jamesRow = screen
      .getAllByRole('button', { name: 'Actions for James Chen', hidden: true })[0]!
      .closest('tr')
    expect(jamesRow).not.toBeNull()
    expect(within(jamesRow!).getByText('Active')).toBeInTheDocument()

    setDemoScenario('normal')
    await user.click(
      within(dialog).getByRole('button', { name: 'Deactivate employee' }),
    )
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: 'Deactivate James Chen?' }),
      ).not.toBeInTheDocument()
    })

    const updatedRow = screen
      .getAllByRole('button', { name: 'Actions for James Chen' })[0]!
      .closest('tr')
    expect(within(updatedRow!).getByText('Inactive')).toBeInTheDocument()
  })
})

describe('Accessibility-oriented workflows', () => {
  it('exposes core controls by role and accessible name', async () => {
    const { user } = renderEmployeesPage()
    await waitForDirectory()

    expect(screen.getByRole('button', { name: 'Add employee' })).toBeInTheDocument()
    expect(screen.getByLabelText('Search by name')).toBeInTheDocument()
    expect(screen.getByLabelText('Department')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Add employee' }))
    const dialog = await screen.findByRole('dialog', { name: 'Add employee' })
    expect(within(dialog).getByLabelText('First name')).toHaveAccessibleName(
      'First name',
    )
  })

  it('associates validation messages with fields', async () => {
    const { user } = renderEmployeesPage()
    await waitForDirectory()
    await user.click(screen.getByRole('button', { name: 'Add employee' }))
    const dialog = await screen.findByRole('dialog', { name: 'Add employee' })
    await user.click(within(dialog).getByRole('button', { name: 'Add employee' }))

    const firstName = await within(dialog).findByLabelText('First name')
    expect(firstName).toHaveAccessibleErrorMessage('First name is required.')
  })
})

async function fillEmployeeForm(
  user: ReturnType<typeof renderEmployeesPage>['user'],
  dialog: HTMLElement,
) {
  await user.type(within(dialog).getByLabelText('First name'), 'Aaron')
  await user.type(within(dialog).getByLabelText('Last name'), 'Adebayo')
  await user.type(
    within(dialog).getByLabelText('Email'),
    'aaron.adebayo@meridian.test',
  )
  await user.type(within(dialog).getByLabelText('Job title'), 'People Analyst')
  await user.selectOptions(
    within(dialog).getByLabelText('Department'),
    'Human Resources',
  )
  await user.selectOptions(
    within(dialog).getByLabelText('Employment status'),
    'active',
  )
  await user.type(within(dialog).getByLabelText('Joining date'), '2024-01-15')
}
