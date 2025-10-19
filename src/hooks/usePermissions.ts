'use client'

import { useState, useEffect } from 'react'
import { User, Permission } from '@/types'

// Mock current user - en una app real esto vendría de un contexto de autenticación
const mockCurrentUser: User = {
  id: '1',
  name: 'Diego Admin',
  email: 'admin@zonat.com',
  password: 'admin123',
  role: 'superadmin',
  permissions: [
    { module: 'dashboard', actions: ['view'] },
    { module: 'products', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'clients', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'sales', actions: ['view', 'create', 'edit', 'delete', 'cancel'] },
    { module: 'payments', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'roles', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'logs', actions: ['view'] }
  ],
  isActive: true,
  lastLogin: '2024-01-20T10:30:00Z',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-20T10:30:00Z'
}

export function usePermissions() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    // En una app real, esto vendría de un contexto de autenticación
    setCurrentUser(mockCurrentUser)
  }, [])

  const hasPermission = (module: string, action: string): boolean => {
    if (!currentUser) return false
    
    // Super admin tiene todos los permisos
    if (currentUser.role === 'superadmin') return true
    
    // Buscar el módulo en los permisos del usuario
    const modulePermission = currentUser.permissions.find(p => p.module === module)
    if (!modulePermission) return false
    
    // Verificar si tiene la acción específica
    return modulePermission.actions.includes(action)
  }

  const canView = (module: string): boolean => {
    return hasPermission(module, 'view')
  }

  const canCreate = (module: string): boolean => {
    return hasPermission(module, 'create')
  }

  const canEdit = (module: string): boolean => {
    return hasPermission(module, 'edit')
  }

  const canDelete = (module: string): boolean => {
    return hasPermission(module, 'delete')
  }

  const canCancel = (module: string): boolean => {
    return hasPermission(module, 'cancel')
  }

  const getAccessibleModules = (): string[] => {
    if (!currentUser) return []
    
    return currentUser.permissions
      .filter(p => p.actions.includes('view'))
      .map(p => p.module)
  }

  const getModuleActions = (module: string): string[] => {
    if (!currentUser) return []
    
    const modulePermission = currentUser.permissions.find(p => p.module === module)
    return modulePermission ? modulePermission.actions : []
  }

  return {
    currentUser,
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canCancel,
    getAccessibleModules,
    getModuleActions
  }
}
