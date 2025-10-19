'use client'

import { User, Permission } from '@/types'
import { useAuth } from '@/contexts/auth-context'

export function usePermissions() {
  const { user: currentUser } = useAuth()

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
