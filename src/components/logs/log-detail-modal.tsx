'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, ArrowRightLeft, ShoppingCart, Package, Users, Tag, Calendar, User, Clock } from 'lucide-react'
import { LogEntry } from '@/types/logs'

interface LogDetailModalProps {
  isOpen: boolean
  onClose: () => void
  log: LogEntry | null
}

export function LogDetailModal({ isOpen, onClose, log }: LogDetailModalProps) {
  if (!isOpen || !log) return null

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
        return Package
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
      default:
        return type
    }
  }

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const TypeIcon = getTypeIcon(log.type)

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <TypeIcon className="h-6 w-6 text-emerald-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Detalles del Registro
              </h2>
              <p className="text-sm text-gray-300">
                ID: {log.id}
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-300 hover:text-white" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {/* Información General */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Package className="h-5 w-5 mr-2 text-emerald-400" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tipo de Operación
                    </label>
                    <Badge className={getTypeColor(log.type)}>
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {getTypeLabel(log.type)}
                    </Badge>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Acción
                    </label>
                    <div className="text-white font-medium">{log.action}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción
                  </label>
                  <div className="text-white bg-gray-700 p-3 rounded-lg">
                    {log.description}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Usuario
                    </label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{log.userName}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Fecha y Hora
                    </label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{formatDateTime(log.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detalles Específicos */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-emerald-400" />
                  Detalles de la Operación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-700 rounded-lg p-4">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Información Adicional */}
            {(log.ipAddress || log.userAgent) && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg text-white flex items-center">
                    <User className="h-5 w-5 mr-2 text-emerald-400" />
                    Información Adicional
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {log.ipAddress && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Dirección IP
                      </label>
                      <div className="text-white font-mono bg-gray-700 px-3 py-2 rounded">
                        {log.ipAddress}
                      </div>
                    </div>
                  )}
                  {log.userAgent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        User Agent
                      </label>
                      <div className="text-white text-sm bg-gray-700 p-3 rounded">
                        {log.userAgent}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700 bg-gray-800">
          <Button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}
