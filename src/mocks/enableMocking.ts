import { hydrateDemoController } from '@/mocks/demoController'

export async function enableMocking(): Promise<void> {
  hydrateDemoController()
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
