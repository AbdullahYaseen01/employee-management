import { hydrateDemoController } from '@/mocks/demoController'

export async function enableMocking(): Promise<void> {
  hydrateDemoController()
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    if (url.searchParams.has('demo')) {
      url.searchParams.delete('demo')
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    }
  }
  const { worker } = await import('@/mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
      options: {
        scope: '/',
        updateViaCache: 'none',
      },
    },
    quiet: true,
  })
}
