import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: ReactNode
  dismissible?: boolean
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  dismissible = true,
}: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="dialog-overlay" />
        <DialogPrimitive.Content
          className="dialog-content"
          onPointerDownOutside={(event) => {
            if (!dismissible) event.preventDefault()
          }}
          onEscapeKeyDown={(event) => {
            if (!dismissible) event.preventDefault()
          }}
        >
          <div className="dialog-header">
            <div>
              <DialogPrimitive.Title className="dialog-title">
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="dialog-description">
                  {description}
                </DialogPrimitive.Description>
              ) : (
                <DialogPrimitive.Description className="sr-only">
                  {title}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Close dialog"
                disabled={!dismissible}
              >
                Close
              </Button>
            </DialogPrimitive.Close>
          </div>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
