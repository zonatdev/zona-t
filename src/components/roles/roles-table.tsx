'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Shield,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  Lock,
  Unlock,
  Users,
  Calendar
} from 'lucide-react'
import { Role } from '@/types'

interface RolesTableProps {
  roles: Role[]
  onView: (role: Role) => void
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  onCreate: () => void
}

export function RolesTable({ roles, onView, onEdit, onDelete, onCreate }: RolesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const getTypeColor = (isSystem: boolean) => {
    return isSystem
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  }

  const getTypeLabel = (isSystem: boolean) => {
    return isSystem ? 'Sistema' : 'Personalizado'
  }

  const getTypeIcon = (isSystem: boolean) => {
    return isSystem ? Lock : Unlock
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getModuleLabel = (module: string) => {
    switch (module) {
      case 'dashboard':
        return 'Dashboard'
      case 'products':
        return 'Productos'
      case 'clients':
        return 'Clientes'
      case 'sales':
        return 'Ventas'
      case 'payments':
        return 'Abonos'
      case 'roles':
        return 'Roles'
      case 'logs':
        return 'Logs'
      default:
        return module
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'view':
        return 'Ver'
      case 'create':
        return 'Crear'
      case 'edit':
        return 'Editar'
      case 'delete':
        return 'Eliminar'
      case 'cancel':
        return 'Cancelar'
      default:
        return action
    }
  }

  const filteredRoles = roles.filter(role => {
    const matchesSearch = searchTerm === '' ||
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' ||
      (filterType === 'system' && role.isSystem) ||
      (filterType === 'custom' && !role.isSystem)

    return matchesSearch && matchesType
  })

  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <Shield className="h-5 w-5 mr-2 text-emerald-600" />
            Gestión de Roles
          </CardTitle>
          <Button onClick={onCreate} className="bg-emerald-700 hover:bg-emerald-800">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Rol
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          >
            <option value="all">Todos los tipos</option>
            <option value="system">Sistema</option>
            <option value="custom">Personalizado</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">#</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Rol</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Permisos</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Creado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.map((role, index) => {
                const TypeIcon = getTypeIcon(role.isSystem)
                return (
                  <tr key={role.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center">
                          <Shield className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {role.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {role.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
                        {role.description}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getTypeColor(role.isSystem)}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {getTypeLabel(role.isSystem)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        {role.permissions.slice(0, 3).map((permission, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              {getModuleLabel(permission.module)}:
                            </span>
                            <div className="flex space-x-1">
                              {permission.actions.map((action, actionIdx) => (
                                <Badge
                                  key={actionIdx}
                                  className="text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                                >
                                  {getActionLabel(action)}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                        {role.permissions.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            +{role.permissions.length - 3} más...
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {formatDateTime(role.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onView(role)}
                          className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(role)}
                          disabled={role.isSystem}
                          className="h-8 w-8 p-0 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={role.isSystem ? "No se puede editar rol del sistema" : "Editar rol"}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(role)}
                          disabled={role.isSystem}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={role.isSystem ? "No se puede eliminar rol del sistema" : "Eliminar rol"}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Shield className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p>No se encontraron roles</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
