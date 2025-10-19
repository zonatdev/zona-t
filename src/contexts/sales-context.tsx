'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Sale } from '@/types'
import { SalesService } from '@/lib/sales-service'
import { useAuth } from './auth-context'
import { useProducts } from './products-context'

interface SalesContextType {
  sales: Sale[]
  loading: boolean
  createSale: (saleData: Omit<Sale, 'id' | 'createdAt'>) => Promise<void>
  updateSale: (id: string, saleData: Partial<Sale>) => Promise<void>
  deleteSale: (id: string) => Promise<void>
  cancelSale: (id: string, reason: string) => Promise<void>
  searchSales: (searchTerm: string) => Promise<Sale[]>
  refreshSales: () => Promise<void>
}

const SalesContext = createContext<SalesContextType | undefined>(undefined)

export function SalesProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([])
  const [loading, setLoading] = useState(true)
  const { user: currentUser } = useAuth()
  const { refreshProducts, returnStockFromSale } = useProducts()

  const fetchSales = useCallback(async () => {
    try {
      setLoading(true)
      const salesData = await SalesService.getAllSales()
      setSales(salesData)
    } catch (error) {
      console.error('Error fetching sales:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

  const createSale = async (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    if (!currentUser?.id) {
      throw new Error('Usuario no autenticado')
    }

    try {
      const newSale = await SalesService.createSale(saleData, currentUser.id)
      setSales(prev => [newSale, ...prev])
      
      // Refrescar productos para actualizar el stock
      await refreshProducts()
    } catch (error) {
      console.error('Error creating sale:', error)
      throw error
    }
  }

  const updateSale = async (id: string, saleData: Partial<Sale>) => {
    if (!currentUser?.id) {
      throw new Error('Usuario no autenticado')
    }

    try {
      const updatedSale = await SalesService.updateSale(id, saleData, currentUser.id)
      setSales(prev => prev.map(sale => sale.id === id ? updatedSale : sale))
    } catch (error) {
      console.error('Error updating sale:', error)
      throw error
    }
  }

  const deleteSale = async (id: string) => {
    if (!currentUser?.id) {
      throw new Error('Usuario no autenticado')
    }

    try {
      await SalesService.deleteSale(id, currentUser.id)
      setSales(prev => prev.filter(sale => sale.id !== id))
    } catch (error) {
      console.error('Error deleting sale:', error)
      throw error
    }
  }

  const cancelSale = async (id: string, reason: string) => {
    if (!currentUser?.id) {
      throw new Error('Usuario no autenticado')
    }

    try {
      // Obtener la venta para acceder a los items
      const sale = sales.find(s => s.id === id)
      if (!sale) {
        throw new Error('Venta no encontrada')
      }

      // Cancelar la venta
      await SalesService.cancelSale(id, reason, currentUser.id)
      
      // Devolver el stock de cada producto
      for (const item of sale.items) {
        await returnStockFromSale(item.productId, item.quantity)
      }

      // Actualizar el estado local
      setSales(prev => prev.map(sale => 
        sale.id === id 
          ? { ...sale, status: 'cancelled' as const }
          : sale
      ))
    } catch (error) {
      console.error('Error cancelling sale:', error)
      throw error
    }
  }

  const searchSales = async (searchTerm: string): Promise<Sale[]> => {
    try {
      return await SalesService.searchSales(searchTerm)
    } catch (error) {
      console.error('Error searching sales:', error)
      throw error
    }
  }

  const refreshSales = async () => {
    await fetchSales()
  }

  return (
    <SalesContext.Provider value={{
      sales,
      loading,
      createSale,
      updateSale,
      deleteSale,
      cancelSale,
      searchSales,
      refreshSales
    }}>
      {children}
    </SalesContext.Provider>
  )
}

export function useSales() {
  const context = useContext(SalesContext)
  if (context === undefined) {
    throw new Error('useSales must be used within a SalesProvider')
  }
  return context
}
