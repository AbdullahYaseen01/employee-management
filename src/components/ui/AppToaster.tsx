import { Toaster } from 'sonner'

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
      }}
    />
  )
}
