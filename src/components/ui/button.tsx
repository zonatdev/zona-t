import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

export function Button({ 
  className, 
  variant = 'default', 
  size = 'default', 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        {
          "bg-emerald-700 text-white hover:bg-emerald-800": variant === 'default',
          "bg-red-600 text-white hover:bg-red-700": variant === 'destructive',
          "border border-gray-300 bg-white hover:bg-gray-50": variant === 'outline',
          "bg-gray-100 text-gray-900 hover:bg-gray-200": variant === 'secondary',
          "hover:bg-gray-100": variant === 'ghost',
          "underline-offset-4 hover:underline": variant === 'link',
        },
        {
          "h-10 py-2 px-4": size === 'default',
          "h-9 px-3 rounded-md": size === 'sm',
          "h-11 px-8 rounded-md": size === 'lg',
          "h-10 w-10": size === 'icon',
        },
        className
      )}
      {...props}
    />
  )
}
