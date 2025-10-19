'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/ui/sidebar'
import { ProtectedRoute } from '@/components/auth/protected-route'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Si es la página de login, no mostrar sidebar ni protección
  if (pathname === '/login') {
    return <>{children}</>
  }
  
  // Para todas las demás páginas, mostrar el layout completo con sidebar
  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-white dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 lg:ml-56">
          <div className="h-full overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
