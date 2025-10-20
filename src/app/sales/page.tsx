'use client'

import { useState } from 'react'
import { SalesTable } from '@/components/sales/sales-table'
import { SaleModal } from '@/components/sales/sale-modal'
import { SaleDetailModal } from '@/components/sales/sale-detail-modal'
import { useSales } from '@/contexts/sales-context'
import { Sale } from '@/types'

export default function SalesPage() {
  const { sales, loading, createSale, deleteSale, cancelSale } = useSales()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)

  const handleEdit = (sale: Sale) => {
    console.log('Edit sale:', sale)
    // TODO: Implement edit modal
  }

  const handleDelete = async (sale: Sale) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la venta #${sale.id}?`)) {
      try {
        await deleteSale(sale.id)
      } catch (error) {
        console.error('Error deleting sale:', error)
        alert('Error al eliminar la venta')
      }
    }
  }

  const handleView = (sale: Sale) => {
    setSelectedSale(sale)
    setIsDetailModalOpen(true)
  }

  const handleCreate = () => {
    setIsModalOpen(true)
  }

  const handleSaveSale = async (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    try {
      await createSale(saleData)
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error creating sale:', error)
      alert('Error al crear la venta')
    }
  }

  const handlePrint = (sale: Sale) => {
    console.log('Print sale:', sale)
    // TODO: Implement print functionality
  }

  const handleCancelSale = async (saleId: string, reason: string) => {
    try {
      await cancelSale(saleId, reason)
      setIsDetailModalOpen(false)
      setSelectedSale(null)
    } catch (error) {
      console.error('Error cancelling sale:', error)
      alert('Error al cancelar la venta')
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 dark:border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando ventas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-gray-900 min-h-screen">
      <div className="xl:ml-0 ml-20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Ventas</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
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
