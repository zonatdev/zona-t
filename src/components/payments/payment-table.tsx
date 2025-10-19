'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  CreditCard,
  Plus,
  Search,
  Eye,
  DollarSign,
  Calendar,
  User,
  FileText
} from 'lucide-react'
import { Payment } from '@/types'

interface PaymentTableProps {
  payments: Payment[]
  onView: (payment: Payment) => void
  onPayment: (payment: Payment) => void
  onCreate: () => void
}

export function PaymentTable({ payments, onView, onPayment, onCreate }: PaymentTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'partial':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'partial':
        return 'Parcial'
      case 'completed':
        return 'Completado'
      case 'overdue':
        return 'Vencido'
      default:
        return status
    }
  }

  const totalDebt = payments.reduce((sum, payment) => sum + payment.pendingAmount, 0)

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
            Gestión de Abonos
          </CardTitle>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Deuda:</div>
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(totalDebt)}
              </div>
            </div>
            <Button onClick={onCreate} className="bg-emerald-700 hover:bg-emerald-800">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Abono
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
              placeholder="Buscar factura o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente</option>
            <option value="partial">Parcial</option>
            <option value="completed">Completado</option>
            <option value="overdue">Vencido</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Factura</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Total Compra</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Saldo Pendiente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Último Abono</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Registrado Por</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Fecha/Hora Abono</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-4 px-4">
                    <div className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                      #{payment.invoiceNumber}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {payment.clientName}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(payment.totalAmount)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm font-semibold text-red-600 dark:text-red-400">
                      {formatCurrency(payment.pendingAmount)}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {payment.lastPaymentAmount ? formatCurrency(payment.lastPaymentAmount) : '-'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {payment.lastPaymentUser || '-'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {payment.lastPaymentDate ? formatDateTime(payment.lastPaymentDate) : '-'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(payment)}
                        className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onPayment(payment)}
                        className="h-8 w-8 p-0 text-yellow-500 hover:text-yellow-700 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                        title="Registrar abono"
                      >
                        <DollarSign className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <CreditCard className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p>No se encontraron facturas pendientes</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}