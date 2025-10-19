'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, ArrowRightLeft, ShoppingCart, Package, Users, Tag, UserCheck, FileText } from 'lucide-react'
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
    try {
      const date = new Date(timestamp)
      return date.toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Fecha inválida'
    }
  }

  const TypeIcon = getTypeIcon(log.type)

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">
              Detalles del Registro
            </h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-700"
          >
            <X className="h-4 w-4 text-gray-300 hover:text-white" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            {/* Información Principal */}
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Acción:</span>
                <Badge className={getTypeColor(log.type)}>
                  <TypeIcon className="h-3 w-3 mr-1" />
                  {log.action}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Realizado por:</span>
                <span className="text-white font-medium">{log.user_name || 'Desconocido'}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Fecha:</span>
                <span className="text-white">{formatDateTime(log.created_at)}</span>
              </div>
              
              {/* Información específica según el tipo de acción */}
              {log.details && (
                <div className="pt-2 border-t border-gray-700">
                  {log.action === 'Permisos Asignados' && log.details.description && (
                    <div>
                      <span className="text-sm text-gray-400 block mb-2">Resumen de permisos:</span>
                      <div className="text-white text-sm bg-gray-700 p-4 rounded-lg">
                        <div className="space-y-2">
                          {(() => {
                            const desc = log.details.description
                            // Extraer el nombre del usuario
                            const userMatch = desc.match(/^([^-]+) -/)
                            const userName = userMatch ? userMatch[1].trim() : 'Usuario'
                            
                            // Extraer cambios específicos
                            const changesMatch = desc.match(/Módulos: (.+?)\. Resumen:/)
                            const changes = changesMatch ? changesMatch[1].trim() : ''
                            
                            // Extraer resumen de permisos
                            const summaryMatch = desc.match(/Resumen: (.+)$/)
                            const summary = summaryMatch ? summaryMatch[1].trim() : ''
                            
                            return (
                              <>
                                <div className="flex items-center space-x-2 font-medium text-emerald-400 mb-3">
                                  <UserCheck className="h-4 w-4" />
                                  <span>{userName}</span>
                                </div>
                                
                                {changes && (
                                  <div className="mb-3">
                                    <div className="text-gray-300 text-xs mb-1">Cambios realizados:</div>
                                    <div className="text-yellow-300 text-xs bg-gray-600 p-2 rounded">
                                      {changes
                                        .replace(/Agregados:/g, 'Agregados:')
                                        .replace(/Removidos:/g, 'Removidos:')
                                        .replace(/products:/g, 'Productos:')
                                        .replace(/clients:/g, 'Clientes:')
                                        .replace(/sales:/g, 'Ventas:')
                                        .replace(/payments:/g, 'Abonos:')
                                        .replace(/roles:/g, 'Roles:')
                                        .replace(/dashboard:/g, 'Dashboard:')
                                        .replace(/logs:/g, 'Logs:')
                                        .replace(/view/g, 'Ver')
                                        .replace(/create/g, 'Crear')
                                        .replace(/edit/g, 'Editar')
                                        .replace(/delete/g, 'Eliminar')
                                        .replace(/cancel/g, 'Cancelar')
                                      }
                                    </div>
                                  </div>
                                )}
                                
                                {summary && (
                                  <div>
                                    <div className="text-gray-300 text-xs mb-2">Permisos actuales:</div>
                                    <div className="space-y-1">
                                      {summary.split(' | ').map((module, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                          <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0"></div>
                                          <span className="text-xs">
                                            {module
                                              .replace(/Productos:/g, 'Productos:')
                                              .replace(/Clientes:/g, 'Clientes:')
                                              .replace(/Ventas:/g, 'Ventas:')
                                              .replace(/Abonos:/g, 'Abonos:')
                                              .replace(/Roles:/g, 'Roles:')
                                              .replace(/Dashboard:/g, 'Dashboard:')
                                              .replace(/Logs:/g, 'Logs:')
                                              .replace(/Ver/g, 'Ver')
                                              .replace(/Crear/g, 'Crear')
                                              .replace(/Editar/g, 'Editar')
                                              .replace(/Eliminar/g, 'Eliminar')
                                              .replace(/Cancelar/g, 'Cancelar')
                                            }
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {log.action === 'Usuario Creado' && log.details.newUser && (
                    <div>
                      <span className="text-sm text-gray-400 block mb-2">Nuevo usuario:</span>
                      <div className="text-white text-sm">
                        <strong>{log.details.newUser.name}</strong> - {log.details.newUser.email} ({log.details.newUser.role})
                      </div>
                    </div>
                  )}
                  
                  {log.action === 'Usuario Editado' && log.details.userName && (
                    <div>
                      <span className="text-sm text-gray-400 block mb-2">Usuario editado:</span>
                      <div className="text-white text-sm">
                        <strong>{log.details.userName}</strong>
                        {log.details.changes && Object.keys(log.details.changes).length > 0 && (
                          <span className="text-gray-400 ml-2">
                            - Campos modificados: {Object.keys(log.details.changes).join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {log.action === 'Usuario Eliminado' && log.details.deletedUser && (
                    <div>
                      <span className="text-sm text-gray-400 block mb-2">Usuario eliminado:</span>
                      <div className="text-white text-sm">
                        <strong>{log.details.deletedUser.name}</strong> - {log.details.deletedUser.email}
                      </div>
                    </div>
                  )}
                  
                  {log.action === 'Rol Cambiado' && log.details.userName && (
                    <div>
                      <span className="text-sm text-gray-400 block mb-2">Cambio de rol:</span>
                      <div className="text-white text-sm">
                        <strong>{log.details.userName}</strong>
                        {log.details.changes?.role && (
                          <span className="text-gray-400 ml-2">
                            - Nuevo rol: {log.details.changes.role}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-700">
          <Button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
          >
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  )
}