import { BrowserRouter } from 'react-router-dom'
import { AppProviders } from '@/app/providers'
import { DemoStateToolbar } from '@/features/employees/components/DemoStateToolbar'
import { EmployeesPage } from '@/features/employees/pages/EmployeesPage'

export function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <a className="skip-link" href="#employee-directory">
          Skip to employee directory
        </a>
        <div className="app-shell">
          <header className="app-header">
            <div className="app-brand">
              <span className="app-brand__logo" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M3 15V3h2.4l3.5 8.1L12.3 3H15v12h-2.2V7.4L9.5 15H8.1L5.2 7.4V15H3Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <div>
                <span className="app-brand__mark">Meridian</span>
                <span className="app-brand__meta">People operations</span>
              </div>
            </div>
          </header>
          <main id="employee-directory" className="app-main">
            <EmployeesPage />
          </main>
        </div>
        <DemoStateToolbar />
      </AppProviders>
    </BrowserRouter>
  )
}
