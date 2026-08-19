import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { AnnounceContext } from '@/app/announce'
import { AppToaster } from '@/components/ui/AppToaster'

export function AppProviders({ children }: { children: ReactNode }) {
  const [announcement, setAnnouncement] = useState('')
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
            refetchOnWindowFocus: false,
            staleTime: 15_000,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AnnounceContext.Provider value={setAnnouncement}>
        {children}
        <div className="live-region" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
        <AppToaster />
      </AnnounceContext.Provider>
    </QueryClientProvider>
  )
}
