'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Receipt, 
  User, 
  Calendar, 
  CreditCard, 
  AlertTriangle,
  Printer,
  Download
} from 'lucide-react'
import { Sale } from '@/types'

interface SaleDetailModalProps {
  isOpen: boolean
  onClose: () => void
  sale: Sale | null
  onCancel?: (saleId: string, reason: string) => void
  onPrint?: (sale: Sale) => void
}

export function SaleDetailModal({ 
  isOpen, 
  onClose, 
  sale, 
  onCancel,
  onPrint 
}: SaleDetailModalProps) {
  const [showCancelForm, setShowCancelForm] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const cancelFormRef = useRef<HTMLDivElement>(null)

  if (!isOpen || !sale) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    const timeStr = date.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    return `${dateStr} ${timeStr}`
  }

  const generateInvoiceNumber = (saleId: string) => {
    return `#FV${saleId.padStart(4, '0')}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completada'
      case 'pending':
        return 'Pendiente'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-green-100 text-green-800'
      case 'credit':
        return 'bg-blue-100 text-blue-800'
      case 'transfer':
        return 'bg-purple-100 text-purple-800'
      case 'warranty':
        return 'bg-orange-100 text-orange-800'
      case 'mixed':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Efectivo/Contado'
      case 'credit':
        return 'Crédito'
      case 'transfer':
        return 'Transferencia'
      case 'warranty':
        return 'Garantía'
      case 'mixed':
        return 'Mixto'
      default:
        return method
    }
  }

  const handleCancel = () => {
    if (cancelReason.trim() && onCancel) {
      onCancel(sale.id, cancelReason)
      setCancelReason('')
      setShowCancelForm(false)
      onClose()
    }
  }

  const handleShowCancelForm = () => {
    setShowCancelForm(true)
    // Scroll to cancel form after a brief delay to ensure it's rendered
    setTimeout(() => {
      cancelFormRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      })
    }, 100)
  }

  // Mock seller email - in a real app this would come from the sale data
  const getSellerEmail = () => {
    return 'admin@zonat.com' // Default admin email
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <Receipt className="h-6 w-6 text-emerald-500" />
            <div>
              <h2 className="text-xl font-semibold text-white">Detalle de Venta</h2>
              <p className="text-sm text-gray-400">{generateInvoiceNumber(sale.id)}</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-gray-800">
          {/* Sale Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-lg text-white">Información de la Venta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Receipt className="h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="text-sm text-gray-600">Factura</div>
                    <div className="font-bold text-blue-600 text-lg">{generateInvoiceNumber(sale.id)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="text-sm text-gray-600">Cliente</div>
                    <div className="font-semibold text-gray-900">{sale.clientName}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="text-sm text-gray-600">Fecha</div>
                    <div className="font-semibold text-gray-900">{formatDateTime(sale.createdAt)}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  <div>
                    <div className="text-sm text-gray-600">Tipo de Pago</div>
                    <Badge className={getPaymentMethodColor(sale.paymentMethod)}>
                      {getPaymentMethodLabel(sale.paymentMethod)}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Estado</div>
                    <Badge className={getStatusColor(sale.status)}>
                      {getStatusLabel(sale.status)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Resumen Financiero</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(sale.subtotal)}</span>
                </div>
                
                {sale.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (16%):</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(sale.tax)}</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-emerald-600">{formatCurrency(sale.total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Productos Vendidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Producto</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Cant</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Precio</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Subtotal</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Vendedor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sale.items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{item.productName}</div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{item.quantity}</td>
                        <td className="py-4 px-4 text-gray-600">{formatCurrency(item.unitPrice)}</td>
                        <td className="py-4 px-4 font-semibold text-gray-900">{formatCurrency(item.total)}</td>
                        <td className="py-4 px-4 text-sm text-gray-600">{getSellerEmail()}</td>
                        <td className="py-4 px-4 text-gray-400">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Cancel Form */}
          {showCancelForm && (
            <div ref={cancelFormRef}>
              <Card className="mt-6 border-red-200">
              <CardHeader>
                <CardTitle className="text-lg text-red-600 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Anular Factura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo de anulación:
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Ingrese el motivo de la anulación..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 bg-white"
                    rows={4}
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    onClick={() => setShowCancelForm(false)}
                    variant="outline"
                    className="border-gray-400 text-gray-700 hover:bg-gray-100"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCancel}
                    disabled={!cancelReason.trim()}
                    className="bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Anular Factura
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-3">
            {sale.status !== 'cancelled' && (
              <Button
                onClick={handleShowCancelForm}
                variant="outline"
                className="border-red-400 text-red-600 hover:bg-red-50"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Anular Factura
              </Button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <Button
              onClick={() => onPrint?.(sale)}
              variant="outline"
              className="border-orange-400 text-orange-600 hover:bg-orange-50"
            >
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <Button
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
