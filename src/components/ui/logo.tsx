'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function Logo({ className, showText = false, size = 'md' }: LogoProps) {
  const logoSize = {
    sm: 32,
    md: 48,
    lg: 64
  }[size]

  return (
    <div className={cn("flex items-center", className)}>
      {/* Logo Image */}
      <Image
        src="/zonat-logo.webp"
        alt="ZONA T Logo"
        width={logoSize}
        height={logoSize}
        className="rounded-lg"
      />
      {showText && (
        <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
          ZONA T
        </span>
      )}
    </div>
  )
}
