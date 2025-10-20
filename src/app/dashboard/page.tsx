'use client'

import { useMemo } from 'react'
import { SalesPeriodCard } from '@/components/dashboard/sales-period-card'
import { TopProductsCard } from '@/components/dashboard/top-products-card'
import { StockOverviewCard } from '@/components/dashboard/stock-overview-card'
import { PaymentMethodsCard } from '@/components/dashboard/payment-methods-card'
import { ProfitInvestmentCard } from '@/components/dashboard/profit-investment-card'
import { DebtsConstructionCard } from '@/components/dashboard/debts-construction-card'
import { OnlineUsersCard } from '@/components/dashboard/online-users-card'
import { ActivitiesSummaryCard } from '@/components/dashboard/activities-summary-card'
import { RecentSalesCard } from '@/components/dashboard/recent-sales-card'
import { useProducts } from '@/contexts/products-context'
import { useClients } from '@/contexts/clients-context'
import { useSales } from '@/contexts/sales-context'

export default function DashboardPage() {
  const { products } = useProducts()
  const { clients } = useClients()
  const { sales } = useSales()

  // Calcular ventas por período
  const salesByPeriod = useMemo(() => {
    const now = new Date()
    
    // Ventas de esta semana
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    startOfWeek.setHours(0, 0, 0, 0)
    
    const thisWeekSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate >= startOfWeek
    }).reduce((sum, sale) => sum + sale.total, 0)
    
    // Ventas de la semana anterior
    const startOfLastWeek = new Date(startOfWeek)
    startOfLastWeek.setDate(startOfWeek.getDate() - 7)
    
    const lastWeekSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate >= startOfLastWeek && saleDate < startOfWeek
    }).reduce((sum, sale) => sum + sale.total, 0)
    
    // Ventas de este mes
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const thisMonthSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate >= startOfMonth
    }).reduce((sum, sale) => sum + sale.total, 0)
    
    // Ventas del mes anterior
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    
    const lastMonthSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate >= startOfLastMonth && saleDate <= endOfLastMonth
    }).reduce((sum, sale) => sum + sale.total, 0)
    
    // Ventas de los últimos 3 meses
    const startOfQuarter = new Date(now.getFullYear(), now.getMonth() - 2, 1)
    
    const last3MonthsSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate >= startOfQuarter
    }).reduce((sum, sale) => sum + sale.total, 0)
    
    // Ventas de los 3 meses anteriores
    const startOfPreviousQuarter = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    const endOfPreviousQuarter = new Date(now.getFullYear(), now.getMonth() - 2, 0)
    
    const previous3MonthsSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate >= startOfPreviousQuarter && saleDate <= endOfPreviousQuarter
    }).reduce((sum, sale) => sum + sale.total, 0)
    
    // Ventas de este año
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    
    const thisYearSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate >= startOfYear
    }).reduce((sum, sale) => sum + sale.total, 0)
    
    // Ventas del año anterior
    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1)
    const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31)
    
    const lastYearSales = sales.filter(sale => {
      const saleDate = new Date(sale.createdAt)
      return saleDate >= startOfLastYear && saleDate <= endOfLastYear
    }).reduce((sum, sale) => sum + sale.total, 0)
    
    return {
      week: { current: thisWeekSales, previous: lastWeekSales },
      month: { current: thisMonthSales, previous: lastMonthSales },
      quarter: { current: last3MonthsSales, previous: previous3MonthsSales },
      year: { current: thisYearSales, previous: lastYearSales }
    }
  }, [sales])

  // Calcular productos más vendidos
  const topProducts = useMemo(() => {
    const productSales: { [key: string]: { name: string; quantitySold: number; totalRevenue: number; category?: string } } = {}
    
    sales.forEach(sale => {
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId)
        if (product) {
          if (!productSales[product.id]) {
            productSales[product.id] = {
              name: product.name,
              quantitySold: 0,
              totalRevenue: 0,
              category: product.categoryId
            }
          }
          productSales[product.id].quantitySold += item.quantity
          productSales[product.id].totalRevenue += item.unitPrice * item.quantity
        }
      })
    })
    
    return Object.entries(productSales)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.quantitySold - a.quantitySold)
  }, [sales, products])

  // Calcular stock
  const stockData = useMemo(() => {
    const totalStock = products.reduce((sum, product) => sum + product.stock.warehouse + product.stock.store, 0)
    const warehouseStock = products.reduce((sum, product) => sum + product.stock.warehouse, 0)
    const localStock = products.reduce((sum, product) => sum + product.stock.store, 0)
    const lowStockProducts = products.filter(p => (p.stock.warehouse + p.stock.store) <= 5).length
    const outOfStockProducts = products.filter(p => (p.stock.warehouse + p.stock.store) === 0).length
    
    return {
      totalStock,
      warehouseStock,
      localStock,
      lowStockProducts,
      outOfStockProducts,
      totalProducts: products.length
    }
  }, [products])

  // Calcular métodos de pago
  const paymentMethods = useMemo(() => {
    const methodCounts: { [key: string]: { count: number; totalAmount: number } } = {}
    
    sales.forEach(sale => {
      if (!methodCounts[sale.paymentMethod]) {
        methodCounts[sale.paymentMethod] = { count: 0, totalAmount: 0 }
      }
      methodCounts[sale.paymentMethod].count++
      methodCounts[sale.paymentMethod].totalAmount += sale.total
    })
    
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
    
    return Object.entries(methodCounts).map(([method, data]) => ({
      method,
      count: data.count,
      percentage: totalSales > 0 ? (data.totalAmount / totalSales) * 100 : 0,
      totalAmount: data.totalAmount
    }))
  }, [sales])

  // Calcular inversión y ganancias
  const profitData = useMemo(() => {
    const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
    
    const totalInvestment = sales.reduce((sum, sale) => {
      const saleInvestment = sale.items.reduce((itemSum, item) => {
        const product = products.find(p => p.id === item.productId)
        return itemSum + (product ? product.cost * item.quantity : 0)
      }, 0)
      return sum + saleInvestment
    }, 0)
    
    const totalProfit = totalSales - totalInvestment
    const profitMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100) : 0
    
    return {
      totalSales,
      totalInvestment,
      totalProfit,
      profitMargin
    }
  }, [sales, products])

  // Calcular usuarios en línea (simulado - en una app real vendría de WebSocket o similar)
  const usersData = useMemo(() => {
    const totalUsers = clients.length
    
    // Simulamos usuarios en línea con datos reales
    // En una app real, esto vendría de un sistema de presencia en tiempo real
    const onlineUsersCount = Math.min(totalUsers, Math.floor(Math.random() * 3)) // 0-2 usuarios en línea
    
    // Crear lista de usuarios en línea con información específica
    const onlineUsers = clients
      .slice(0, onlineUsersCount)
      .map((client, index) => ({
        id: client.id,
        name: client.name || `Usuario ${index + 1}`,
        email: client.email || `usuario${index + 1}@ejemplo.com`,
        lastSeen: new Date(Date.now() - Math.random() * 300000).toISOString(), // Últimos 5 minutos
        role: ['admin', 'vendedor', 'inventario', 'contador'][Math.floor(Math.random() * 4)]
      }))
    
    return {
      totalUsers,
      onlineUsers
    }
  }, [clients])

  // Generar actividades de ejemplo (en un sistema real vendrían de logs)
  const activities = useMemo(() => {
    const activities: any[] = []
    
    // Actividades de ventas
    sales.slice(0, 5).forEach(sale => {
      activities.push({
        id: `sale-${sale.id}`,
        type: 'sale' as const,
        action: 'Nueva venta registrada',
        description: `Venta #${sale.invoiceNumber || sale.id.slice(-4)} por ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(sale.total)}`,
        timestamp: sale.createdAt,
        status: 'success' as const
      })
    })
    
    // Actividades de productos
    products.slice(0, 3).forEach(product => {
      activities.push({
        id: `product-${product.id}`,
        type: 'product' as const,
        action: 'Producto actualizado',
        description: `${product.name} - Stock: ${product.stock.warehouse + product.stock.store} unidades`,
        timestamp: product.updatedAt || product.createdAt,
        status: 'info' as const
      })
    })
    
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }, [sales, products])

  // Calcular datos para ventas recientes
  const recentSalesData = useMemo(() => {
    return sales
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
      .map(sale => {
        const client = clients.find(c => c.id === sale.clientId)
        return {
          id: sale.id,
          invoiceNumber: sale.invoiceNumber || 'N/A',
          clientName: client?.name || 'Cliente no especificado',
          total: sale.total,
          paymentMethod: sale.paymentMethod,
          createdAt: sale.createdAt,
          status: sale.status
        }
      })
  }, [sales, clients])


  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="xl:ml-0 ml-20">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Resumen completo del sistema de inventario ZONA T
          </p>
        </div>
      </div>

      {/* Ventas por Período */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SalesPeriodCard
          period="week"
          sales={salesByPeriod.week.current}
          previousSales={salesByPeriod.week.previous}
          label="Esta Semana"
        />
        <SalesPeriodCard
          period="month"
          sales={salesByPeriod.month.current}
          previousSales={salesByPeriod.month.previous}
          label="Este Mes"
        />
        <SalesPeriodCard
          period="quarter"
          sales={salesByPeriod.quarter.current}
          previousSales={salesByPeriod.quarter.previous}
          label="Últimos 3 Meses"
        />
        <SalesPeriodCard
          period="year"
          sales={salesByPeriod.year.current}
          previousSales={salesByPeriod.year.previous}
          label="Este Año"
        />
      </div>

      {/* Productos más vendidos y Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsCard products={topProducts} />
        <StockOverviewCard {...stockData} />
      </div>

      {/* Métodos de pago y Inversión/Ganancias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentMethodsCard paymentMethods={paymentMethods} />
        <ProfitInvestmentCard {...profitData} />
      </div>

      {/* Ventas Recientes y Usuarios */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSalesCard sales={recentSalesData} />
        <OnlineUsersCard onlineUsers={usersData.onlineUsers} totalUsers={usersData.totalUsers} />
      </div>

      {/* Deudas y Actividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DebtsConstructionCard />
        <ActivitiesSummaryCard activities={activities} />
      </div>
    </div>
  )
}
