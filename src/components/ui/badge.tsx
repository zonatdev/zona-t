import { cn } from '@/lib/utils'

interface BadgeProps {
  className?: string
  children: React.ReactNode
}

export function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
