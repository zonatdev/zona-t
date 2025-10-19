'use client'

import { useState } from 'react'
import { PaymentTable } from '@/components/payments/payment-table'
import { mockPayments } from '@/data/mockData'
import { Payment } from '@/types'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments)

  const handleView = (payment: Payment) => {
    console.log('View payment details:', payment)
    // TODO: Implement payment detail modal
  }

  const handlePayment = (payment: Payment) => {
    console.log('Register payment for:', payment)
    // TODO: Implement payment registration modal
  }

  const handleCreate = () => {
    console.log('Create new payment')
    // TODO: Implement new payment modal
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Abonos</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Administra los abonos y pagos pendientes de tus clientes
        </p>
      </div>

      <PaymentTable
        payments={payments}
        onView={handleView}
        onPayment={handlePayment}
        onCreate={handleCreate}
      />
    </div>
  )
}
