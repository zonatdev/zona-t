'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  Tag
} from 'lucide-react'
import { Product, Category } from '@/types'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ProductTableProps {
  products: Product[]
  categories: Category[]
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onCreate: () => void
  onManageCategories: () => void
  onStockAdjustment?: (product: Product) => void
  onStockTransfer?: (product: Product) => void
}

export function ProductTable({
  products,
  categories,
  onEdit,
  onDelete,
  onCreate,
  onManageCategories,
  onStockAdjustment,
  onStockTransfer
}: ProductTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Sin categoría'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      case 'discontinued':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'out_of_stock':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activo'
      case 'inactive':
        return 'Inactivo'
      case 'discontinued':
        return 'Descontinuado'
      case 'out_of_stock':
        return 'Sin Stock'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircle
      case 'inactive':
        return Pause
      case 'discontinued':
        return XCircle
      case 'out_of_stock':
        return AlertTriangle
      default:
        return CheckCircle
    }
  }

  // Nueva lógica para estados de stock más precisos
  const getStockStatusLabel = (product: Product) => {
    const { warehouse, store, total } = product.stock
    
    if (total === 0) {
      return 'Sin Stock'
    }
    
    if (store > 0) {
      if (store >= 10) {
        return 'Disponible Local'
      } else if (store >= 5) {
        return 'Stock Local Bajo'
      } else {
        return 'Stock Local Muy Bajo'
      }
    }
    
    if (warehouse > 0) {
      if (warehouse >= 20) {
        return 'Solo Bodega'
      } else if (warehouse >= 10) {
        return 'Solo Bodega (Bajo)'
      } else {
        return 'Solo Bodega (Muy Bajo)'
      }
    }
    
    return 'Sin Stock'
  }

  const getStockStatusColor = (product: Product) => {
    const { warehouse, store, total } = product.stock
    
    if (total === 0) {
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    }
    
    if (store > 0) {
      if (store >= 10) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      } else if (store >= 5) {
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      } else {
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      }
    }
    
    if (warehouse > 0) {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    }
    
    return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.categoryId === filterCategory
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categoryOptions = ['all', ...categories.map(c => c.id)]
  const statuses = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'discontinued', label: 'Descontinuado' },
    { value: 'out_of_stock', label: 'Sin Stock' }
  ]

  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-end">
                  <div className="flex items-center space-x-2">
                    <Button onClick={onCreate} className="bg-gray-700 hover:bg-gray-800">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Producto
                    </Button>
                    <Button 
                      onClick={onManageCategories} 
                      className="bg-gray-700 hover:bg-gray-800 text-white border-gray-600"
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      Categorías
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
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          >
            <option value="all">Todas las categorías</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">#</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Referencia</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Producto</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Bodega</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Local</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Total</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Estado Stock</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Estado Producto</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product, index) => {
                const StatusIcon = getStatusIcon(product.status)
                return (
                  <tr key={product.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-mono text-gray-900 dark:text-white font-semibold">
                        {product.reference}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">{getCategoryName(product.categoryId)}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {product.stock.warehouse}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {product.stock.store}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {product.stock.total}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStockStatusColor(product)}>
                        {getStockStatusLabel(product)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(product.status)}>
                        <div className="flex items-center space-x-1">
                          <StatusIcon className="h-3 w-3" />
                          <span>{getStatusLabel(product.status)}</span>
                        </div>
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onEdit(product)}
                                className="h-8 w-8 p-0 text-gray-400 dark:text-gray-400"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-center">
                                <p className="font-medium">Editar Producto</p>
                                <p className="text-xs text-gray-400">Modificar datos del producto</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {onStockAdjustment && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => onStockAdjustment(product)}
                                  className="h-8 w-8 p-0 text-orange-400 dark:text-orange-400"
                                >
                                  <Package className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-center">
                                  <p className="font-medium">Ajustar Stock</p>
                                  <p className="text-xs text-gray-400">Modificar cantidad de inventario</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        {onStockTransfer && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => onStockTransfer(product)}
                                  className="h-8 w-8 p-0 text-purple-400 dark:text-purple-400"
                                >
                                  <ArrowRightLeft className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <div className="text-center">
                                  <p className="font-medium">Transferir Stock</p>
                                  <p className="text-xs text-gray-400">Mover entre Bodega y Local</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => onDelete(product)}
                                className="h-8 w-8 p-0 text-red-400 dark:text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-center">
                                <p className="font-medium">Eliminar Producto</p>
                                <p className="text-xs text-gray-400">Borrar producto permanentemente</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p>No se encontraron productos</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}