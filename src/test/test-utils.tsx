import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { AnnounceContext } from '@/app/announce'
import { EmployeesPage } from '@/features/employees/pages/EmployeesPage'

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        gcTime: Infinity,
      },
      mutations: { retry: false },
    },
  })
}

export function renderEmployeesPage(route = '/') {
  const queryClient = createTestQueryClient()
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <EmployeesPage />,
      },
    ],
    { initialEntries: [route] },
  )

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <AnnounceContext.Provider value={() => {}}>{children}</AnnounceContext.Provider>
      </QueryClientProvider>
    )
  }

  const view = render(<RouterProvider router={router} />, { wrapper: Wrapper })

  return {
    user: userEvent.setup(),
    queryClient,
    router,
    ...view,
  }
}
