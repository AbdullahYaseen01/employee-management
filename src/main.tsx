import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import '@/styles/global.css'

async function bootstrap() {
  if (import.meta.env.VITE_ENABLE_MOCKS !== 'false') {
    const { enableMocking } = await import('@/mocks/enableMocking')
    await enableMocking()
  }

  const root = document.getElementById('root')
  if (!root) {
    throw new Error('Root element not found.')
  }

  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
