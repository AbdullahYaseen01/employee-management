import { cx } from '@/lib/cx'

interface SkeletonProps {
  className?: string
  width?: string
  height?: string
}

export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <span
      className={cx('skeleton', className)}
      style={{ width, height }}
      aria-hidden="true"
    />
  )
}
