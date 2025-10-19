'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Receipt,
  Download,
  Printer
} from 'lucide-react'
import { Sale } from '@/types'

interface SalesTableProps {
  sales: Sale[]
  onEdit: (sale: Sale) => void
  onDelete: (sale: Sale) => void
  onView: (sale: Sale) => void
  onCreate: () => void
  onPrint: (sale: Sale) => void
}

export function SalesTable({ 
  sales, 
  onEdit, 
  onDelete, 
  onView, 
  onCreate,
  onPrint
}: SalesTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
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
    return { date: dateStr, time: timeStr }
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

  const statuses = ['all', 'completed', 'pending', 'cancelled']

  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || sale.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <Card className="border-gray-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Receipt className="h-5 w-5 mr-2" />
            Gestión de Ventas
          </CardTitle>
          <Button onClick={onCreate} className="bg-emerald-700 hover:bg-emerald-800">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Venta
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar ventas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'Todos los estados' : getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600"># Factura</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Método de Pago</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Fecha</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => {
                const { date, time } = formatDateTime(sale.createdAt)
                return (
                  <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="font-semibold text-blue-600">
                        {generateInvoiceNumber(sale.id)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">{sale.clientName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getPaymentMethodColor(sale.paymentMethod)}>
                        {getPaymentMethodLabel(sale.paymentMethod)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(sale.total)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-600">
                        <div className="font-medium">{date}</div>
                        <div className="text-gray-500">{time}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(sale.status)}>
                        {getStatusLabel(sale.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onView(sale)}
                          className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="text-sm">Ver</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onPrint(sale)}
                          className="flex items-center space-x-1 text-orange-500 hover:text-orange-700 hover:bg-orange-100"
                        >
                          <Printer className="h-4 w-4" />
                          <span className="text-sm">Imprimir</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Receipt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p>No se encontraron ventas</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
