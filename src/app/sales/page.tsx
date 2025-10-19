'use client'

import { useState } from 'react'
import { SalesTable } from '@/components/sales/sales-table'
import { SaleModal } from '@/components/sales/sale-modal'
import { SaleDetailModal } from '@/components/sales/sale-detail-modal'
import { mockSales } from '@/data/mockData'
import { Sale } from '@/types'

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(mockSales)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  const handleEdit = (sale: Sale) => {
    console.log('Edit sale:', sale)
    // TODO: Implement edit modal
  }

  const handleDelete = (sale: Sale) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la venta #${sale.id}?`)) {
      setSales(sales.filter(s => s.id !== sale.id))
    }
  }

  const handleView = (sale: Sale) => {
    setSelectedSale(sale)
    setIsDetailModalOpen(true)
  }

  const handleCreate = () => {
    setIsModalOpen(true)
  }

  const handleSaveSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    const newSale: Sale = {
      ...saleData,
      id: (sales.length + 1).toString(),
      createdAt: new Date().toISOString()
    }
    setSales(prev => [newSale, ...prev])
  }

  const handlePrint = (sale: Sale) => {
    console.log('Print sale:', sale)
    // TODO: Implement print functionality
  }

  const handleCancelSale = (saleId: string, reason: string) => {
    setSales(prev => 
      prev.map(sale => 
        sale.id === saleId 
          ? { ...sale, status: 'cancelled' as const }
          : sale
      )
    )
    console.log(`Venta ${saleId} cancelada. Motivo: ${reason}`)
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Ventas</h1>
        <p className="text-gray-600 mt-2">
          Administra tus ventas y genera facturas
        </p>
      </div>

      <SalesTable
        sales={sales}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onCreate={handleCreate}
        onPrint={handlePrint}
      />

      <SaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSale}
      />

      <SaleDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedSale(null)
        }}
        sale={selectedSale}
        onCancel={handleCancelSale}
        onPrint={handlePrint}
      />
    </div>
  )
}
