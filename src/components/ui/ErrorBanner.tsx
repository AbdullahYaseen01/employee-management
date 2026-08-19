import { Button } from '@/components/ui/Button'

interface ErrorBannerProps {
  title: string
  message: string
  onRetry?: () => void
}

export function ErrorBanner({ title, message, onRetry }: ErrorBannerProps) {
  return (
    <div className="banner banner--error" role="alert">
      <div>
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  )
}
