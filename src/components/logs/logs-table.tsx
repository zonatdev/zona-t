'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Activity,
  Search,
  Filter,
  Download,
  Eye,
  ArrowRightLeft,
  ShoppingCart,
  Package,
  Users,
  Tag,
  Trash2,
  Edit,
  Plus
} from 'lucide-react'
import { LogEntry } from '@/types/logs'

interface LogsTableProps {
  logs: LogEntry[]
  onViewDetails: (log: LogEntry) => void
}

export function LogsTable({ logs, onViewDetails }: LogsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterAction, setFilterAction] = useState('all')

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return ArrowRightLeft
      case 'sale':
        return ShoppingCart
      case 'product_create':
      case 'product_edit':
      case 'product_delete':
        return Package
      case 'client_create':
      case 'client_edit':
      case 'client_delete':
        return Users
      case 'category_create':
      case 'category_edit':
      case 'category_delete':
        return Tag
      default:
        return Activity
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
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'transfer':
        return 'Transferencia'
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
      default:
        return type
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
    const matchesSearch = searchTerm === '' ||
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' || log.type === filterType
    const matchesAction = filterAction === 'all' || log.action === filterAction

    return matchesSearch && matchesType && matchesAction
  })

  const types = ['all', 'transfer', 'sale', 'product_create', 'product_edit', 'product_delete', 'client_create', 'client_edit', 'client_delete', 'category_create', 'category_edit', 'category_delete']
  const actions = ['all', 'Transferencia de Stock', 'Nueva Venta', 'Venta Cancelada', 'Producto Creado', 'Producto Editado', 'Producto Eliminado', 'Cliente Creado', 'Cliente Editado', 'Cliente Eliminado', 'Categoría Creada', 'Categoría Editada', 'Categoría Eliminada']

  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <Activity className="h-5 w-5 mr-2 text-emerald-600" />
            Registro de Actividades
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
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
            {types.slice(1).map(type => (
              <option key={type} value={type}>
                {getTypeLabel(type)}
              </option>
            ))}
          </select>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          >
            <option value="all">Todas las acciones</option>
            {actions.slice(1).map(action => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
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
                const TypeIcon = getTypeIcon(log.type)
                return (
                  <tr key={log.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getTypeColor(log.type)}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {getTypeLabel(log.type)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.action}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300 max-w-md truncate" title={log.description}>
                        {log.description}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {log.userName}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {formatDateTime(log.timestamp)}
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
            <Activity className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p>No se encontraron registros</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
