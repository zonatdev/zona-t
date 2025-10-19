'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TimeFilters } from '@/components/dashboard/time-filters'
import { StatisticsCards } from '@/components/dashboard/statistics-cards'
import { SalesChart } from '@/components/dashboard/sales-chart'
import { ProductsChart } from '@/components/dashboard/products-chart'
import { PaymentMethodsChart } from '@/components/dashboard/payment-methods-chart'
import { StockChart } from '@/components/dashboard/stock-chart'
import { ProfitChart } from '@/components/dashboard/profit-chart'
import { 
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Activity,
  BarChart3,
  TrendingUp,
  CreditCard
} from 'lucide-react'
import { useProducts } from '@/contexts/products-context'
import { useClients } from '@/contexts/clients-context'
import { useSales } from '@/contexts/sales-context'

export default function Home() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>('month')
  
  // Usar datos reales de los contextos
  const { products } = useProducts()
  const { clients } = useClients()
  const { sales } = useSales()

  // Calcular métricas reales basadas en los datos
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
  const totalInvestment = products.reduce((sum, product) => sum + (product.cost * product.stock.total), 0)
  const totalProfit = totalSales - totalInvestment
  const profitMargin = totalSales > 0 ? ((totalProfit / totalSales) * 100) : 0
  const activeProducts = products.filter(p => p.status === 'active').length
  const activeClients = clients.filter(c => c.status === 'active').length
  const pendingPayments = 0 // TODO: Implementar cuando tengamos el contexto de pagos
  const lowStockProducts = products.filter(p => p.stock.total <= 5).length
  const salesThisMonth = sales.filter(sale => {
    const saleDate = new Date(sale.createdAt)
    const now = new Date()
    return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear()
  }).length

  const currentStats = {
    totalSales,
    totalInvestment,
    totalProfit,
    activeProducts,
    activeClients,
    pendingPayments,
    profitMargin: Math.round(profitMargin),
    lowStockProducts,
    salesThisMonth
  }

  // Datos para gráficos
  const salesChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    datasets: [
      {
        label: 'Ventas',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Ganancias',
        data: [4000, 6000, 5000, 8000, 7000, 9500, 9000, 11000, 10000, 12500, 12000, 14000],
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const productsChartData = {
    labels: ['Tecnología', 'Accesorios', 'Audio y Video'],
    datasets: [
      {
        label: 'Productos',
        data: [4, 2, 1], // Datos temporales hasta implementar categorías reales
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  }

  const paymentMethodsData = {
    labels: ['Efectivo', 'Crédito', 'Transferencia', 'Garantía', 'Mixto'],
    datasets: [
      {
        data: [
          sales.filter(s => s.paymentMethod === 'cash').length,
          sales.filter(s => s.paymentMethod === 'credit').length,
          sales.filter(s => s.paymentMethod === 'transfer').length,
          sales.filter(s => s.paymentMethod === 'warranty').length,
          sales.filter(s => s.paymentMethod === 'mixed').length
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(59, 130, 246)',
          'rgb(168, 85, 247)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }
    ]
  }

  const stockChartData = {
    labels: products.slice(0, 6).map(p => p.name),
    datasets: [
      {
        label: 'Stock Total',
        data: products.slice(0, 6).map(p => p.stock.total),
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2
      }
    ]
  }

  const profitChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ganancias',
        data: [4000, 6000, 5000, 8000, 7000, 9500],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'credit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'transfer':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Bienvenido al sistema de inventario de ZONA T
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <TimeFilters selectedPeriod={selectedPeriod} onPeriodChange={setSelectedPeriod} />
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <StatisticsCards stats={currentStats} />

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ventas */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
              Tendencia de Ventas y Ganancias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SalesChart data={salesChartData} />
          </CardContent>
        </Card>

        {/* Gráfico de Productos por Categoría */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Package className="h-5 w-5 mr-2 text-blue-600" />
              Productos por Categoría
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProductsChart data={productsChartData} />
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Secundarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Métodos de Pago */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
              Métodos de Pago
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentMethodsChart data={paymentMethodsData} />
          </CardContent>
        </Card>

        {/* Stock por Producto */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <Package className="h-5 w-5 mr-2 text-green-600" />
              Stock por Producto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StockChart data={stockChartData} />
          </CardContent>
        </Card>

        {/* Evolución de Ganancias */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-900 dark:text-white">
              <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
              Evolución de Ganancias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProfitChart data={profitChartData} />
          </CardContent>
        </Card>
      </div>

      {/* Resumen Ejecutivo */}
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <Activity className="h-5 w-5 mr-2 text-emerald-600" />
            Resumen Ejecutivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Rendimiento</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Margen de ganancia del <span className="font-semibold text-emerald-600">{currentStats.profitMargin}%</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {salesThisMonth} ventas este mes
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Inventario</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-semibold text-blue-600">{currentStats.activeProducts}</span> productos activos
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-yellow-600">{currentStats.lowStockProducts}</span> requieren atención
              </p>
            </div>
            <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">Clientes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                <span className="font-semibold text-purple-600">{currentStats.activeClients}</span> clientes activos
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {formatCurrency(currentStats.pendingPayments)} en pagos pendientes
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}