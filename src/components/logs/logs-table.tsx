'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  Eye,
  ArrowRightLeft,
  ShoppingCart,
  Package,
  Users,
  Tag,
  Trash2,
  Edit,
  Plus,
  RefreshCw
} from 'lucide-react'
import { LogEntry } from '@/types/logs'

interface LogsTableProps {
  logs: LogEntry[]
  onViewDetails: (log: LogEntry) => void
  searchTerm?: string
  onSearchChange?: (term: string) => void
  moduleFilter?: string
  onModuleFilterChange?: (module: string) => void
  actionFilter?: string
  onActionFilterChange?: (action: string) => void
  onRefresh?: () => void
}

export function LogsTable({ 
  logs, 
  onViewDetails, 
  searchTerm = '', 
  onSearchChange,
  moduleFilter = 'all',
  onModuleFilterChange,
  actionFilter = 'all',
  onActionFilterChange,
  onRefresh
}: LogsTableProps) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [localFilterType, setLocalFilterType] = useState(moduleFilter)
  const [localFilterAction, setLocalFilterAction] = useState(actionFilter)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return ArrowRightLeft
      case 'sale':
        return ShoppingCart
      case 'product_create':
        return Plus
      case 'product_edit':
        return Edit
      case 'product_delete':
        return Trash2
      case 'client_create':
        return Users
      case 'client_edit':
        return Edit
      case 'client_delete':
        return Trash2
      case 'category_create':
        return Tag
      case 'category_edit':
        return Edit
      case 'category_delete':
        return Trash2
      case 'roles':
        return Users
      case 'login':
        return Users
       default:
         return Users
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'transfer':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'sale':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'product_create':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400'
      case 'product_edit':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'product_delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'client_create':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'client_edit':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'client_delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'category_create':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
      case 'category_edit':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
      case 'category_delete':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'roles':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
      case 'login':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'transfer':
        return 'Transferencia de Stock'
      case 'sale':
        return 'Venta'
      case 'product_create':
        return 'Producto Creado'
      case 'product_edit':
        return 'Producto Editado'
      case 'product_delete':
        return 'Producto Eliminado'
      case 'client_create':
        return 'Cliente Creado'
      case 'client_edit':
        return 'Cliente Editado'
      case 'client_delete':
        return 'Cliente Eliminado'
      case 'category_create':
        return 'Categoría Creada'
      case 'category_edit':
        return 'Categoría Editada'
      case 'category_delete':
        return 'Categoría Eliminada'
      case 'roles':
        return 'Gestión de Usuarios'
      case 'login':
        return 'Inicio de Sesión'
      default:
        return type || 'Actividad'
    }
  }

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = (onSearchChange ? searchTerm : localSearchTerm) === '' ||
      log.description?.toLowerCase().includes((onSearchChange ? searchTerm : localSearchTerm).toLowerCase()) ||
      log.action.toLowerCase().includes((onSearchChange ? searchTerm : localSearchTerm).toLowerCase()) ||
      log.user_name?.toLowerCase().includes((onSearchChange ? searchTerm : localSearchTerm).toLowerCase())

    const matchesType = (onModuleFilterChange ? moduleFilter : localFilterType) === 'all' || log.module === (onModuleFilterChange ? moduleFilter : localFilterType)
    const matchesAction = (onActionFilterChange ? actionFilter : localFilterAction) === 'all' || log.action === (onActionFilterChange ? actionFilter : localFilterAction)

    return matchesSearch && matchesType && matchesAction
  })

  const types = ['all', 'transfer', 'sale', 'product_create', 'product_edit', 'product_delete', 'client_create', 'client_edit', 'client_delete', 'category_create', 'category_edit', 'category_delete', 'roles', 'login']
  const actions = [
    'all', 
    'Transferencia de Stock', 'Nueva Venta', 'Venta Cancelada', 
    'Producto Creado', 'Producto Editado', 'Producto Eliminado', 
    'Cliente Creado', 'Cliente Editado', 'Cliente Eliminado', 
    'Categoría Creada', 'Categoría Editada', 'Categoría Eliminada', 
    'Usuario Creado', 'Usuario Editado', 'Usuario Eliminado', 
    'Permisos Asignados', 'Permisos Revocados', 'Rol Cambiado', 
    'Usuario Desactivado', 'Usuario Reactivado', 'Acceso al Sistema'
  ]

  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar en registros..."
              value={onSearchChange ? searchTerm : localSearchTerm}
              onChange={(e) => {
                const value = e.target.value
                if (onSearchChange) {
                  onSearchChange(value)
                } else {
                  setLocalSearchTerm(value)
                }
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
            />
          </div>
          <select
            value={onModuleFilterChange ? moduleFilter : localFilterType}
            onChange={(e) => {
              const value = e.target.value
              if (onModuleFilterChange) {
                onModuleFilterChange(value)
              } else {
                setLocalFilterType(value)
              }
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          >
            <option value="all">Todos los tipos</option>
            {types.slice(1).map(type => (
              <option key={type} value={type}>
                {getTypeLabel(type)}
              </option>
            ))}
          </select>
          <select
            value={onActionFilterChange ? actionFilter : localFilterAction}
            onChange={(e) => {
              const value = e.target.value
              if (onActionFilterChange) {
                onActionFilterChange(value)
              } else {
                setLocalFilterAction(value)
              }
            }}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          >
            <option value="all">Todas las acciones</option>
            {actions.slice(1).map(action => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              variant="outline"
              className="px-4 py-2"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">#</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Acción</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Usuario</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => {
                // Mapear el tipo basado en el módulo y acción
                const getLogType = (log: any) => {
                  if (log.module === 'roles') {
                    if (log.action === 'Usuario Creado') return 'client_create'
                    if (log.action === 'Usuario Editado') return 'client_edit'
                    if (log.action === 'Usuario Eliminado') return 'client_delete'
                    if (log.action === 'Permisos Asignados') return 'client_edit'
                    if (log.action === 'Permisos Revocados') return 'client_edit'
                    if (log.action === 'Rol Cambiado') return 'client_edit'
                    if (log.action === 'Usuario Desactivado') return 'client_edit'
                    if (log.action === 'Usuario Reactivado') return 'client_edit'
                    return 'roles'
                  }
                  if (log.module === 'products') {
                    if (log.action.includes('Creado')) return 'product_create'
                    if (log.action.includes('Editado')) return 'product_edit'
                    if (log.action.includes('Eliminado')) return 'product_delete'
                    return 'product_create'
                  }
                  if (log.module === 'clients') {
                    if (log.action.includes('Creado')) return 'client_create'
                    if (log.action.includes('Editado')) return 'client_edit'
                    if (log.action.includes('Eliminado')) return 'client_delete'
                    return 'client_create'
                  }
                  if (log.module === 'sales') {
                    if (log.action.includes('Venta')) return 'sale'
                    return 'sale'
                  }
                  if (log.module === 'payments') {
                    if (log.action.includes('Transferencia')) return 'transfer'
                    return 'transfer'
                  }
                  if (log.module === 'auth') {
                    return 'login' // Tipo específico para login
                  }
                  return 'roles' // Default
                }
                
                const logType = getLogType(log)
                const TypeIcon = getTypeIcon(logType)
                return (
                  <tr key={log.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {filteredLogs.length - index}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(logType)} flex-shrink-0`}>
                          <TypeIcon className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col justify-center min-h-[40px]">
                          <span className="text-sm font-medium text-gray-900 dark:text-white leading-tight">
                            {getTypeLabel(logType)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                            {log.module === 'roles' ? 'Gestión de Usuarios' : 
                             log.module === 'products' ? 'Productos' :
                             log.module === 'clients' ? 'Clientes' :
                             log.module === 'sales' ? 'Ventas' :
                             log.module === 'payments' ? 'Abonos' :
                             log.module === 'logs' ? 'Logs' :
                             log.module === 'auth' ? 'Inicio de Sesión' :
                             log.module || 'Sistema'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 w-40">
                      <div className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                        {log.module === 'auth' ? 'Acceso al Sistema' : log.action}
                      </div>
                    </td>
                    <td className="py-3 px-4 w-80">
                      <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs truncate" title={log.details ? JSON.stringify(log.details) : log.action}>
                        {log.details ? 
                          (log.module === 'roles' ? 
                            (log.action === 'Usuario Creado' ? `Nuevo usuario: ${log.details.newUser?.name || 'Usuario'} - Rol: ${log.details.newUser?.role || 'Desconocido'}` :
                             log.action === 'Usuario Editado' ? `Actualización: ${log.details.userName || 'Usuario'} - Cambios: ${Object.keys(log.details.changes || {}).join(', ')}` :
                             log.action === 'Usuario Eliminado' ? `Usuario eliminado: ${log.details.deletedUser?.name || 'Usuario'} - Email: ${log.details.deletedUser?.email || 'Desconocido'}` :
                             log.action === 'Permisos Asignados' ? `${log.details.description || 'Permisos asignados'}` :
                             log.action) :
                            log.module === 'auth' ? 
                              `Ingresó al sistema` :
                            log.action) :
                          log.module === 'auth' ? 
                            `Ingresó al sistema` :
                          log.action}
                      </div>
                    </td>
                    <td className="py-3 px-4 w-32">
                      <div className="text-sm text-gray-900 dark:text-white whitespace-nowrap">
                        {log.user_name || 'Usuario Desconocido'}
                      </div>
                    </td>
                    <td className="py-3 px-4 w-32">
                      <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        {formatDateTime(log.created_at)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewDetails(log)}
                          className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                          title="Ver detalles"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p>No se encontraron registros</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
