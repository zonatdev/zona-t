'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Package, AlertTriangle, Warehouse, Store, TrendingUp, TrendingDown } from 'lucide-react'
import { Product } from '@/types'

interface StockAdjustmentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdjust: (productId: string, location: 'warehouse' | 'store', newQuantity: number, reason: string) => void
  product?: Product | null
}

export function StockAdjustmentModal({ isOpen, onClose, onAdjust, product }: StockAdjustmentModalProps) {
  const [formData, setFormData] = useState({
    location: 'warehouse' as 'warehouse' | 'store',
    newQuantity: 0,
    reason: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Función para formatear números con separadores de miles
  const formatNumber = (value: number | string): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(numValue) || numValue === 0) return ''

    // Para números enteros, no mostrar decimales
    if (Number.isInteger(numValue)) {
      return numValue.toLocaleString('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    }
    // Para números con decimales, mostrar hasta 2 decimales
    return numValue.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    })
  }

  // Función para parsear números con formato
  const parseFormattedNumber = (value: string): number => {
    // Remover separadores de miles y convertir a número
    const cleanValue = value.replace(/\./g, '').replace(/,/g, '')
    return parseFloat(cleanValue) || 0
  }

  useEffect(() => {
    if (product) {
      setFormData({
        location: 'warehouse',
        newQuantity: product.stock.warehouse,
        reason: ''
      })
    }
  }, [product])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!product) return

    // Validaciones
    const newErrors: Record<string, string> = {}
    
    if (formData.newQuantity < 0) {
      newErrors.newQuantity = 'La cantidad no puede ser negativa'
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = 'La razón del ajuste es obligatoria'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onAdjust(product.id, formData.location, formData.newQuantity, formData.reason)
    onClose()
  }

  const getCurrentStock = () => {
    if (!product) return 0
    return formData.location === 'warehouse' ? product.stock.warehouse : product.stock.store
  }

  const getStockDifference = () => {
    const current = getCurrentStock()
    const newQty = formData.newQuantity
    return newQty - current
  }

  const getLocationLabel = (location: 'warehouse' | 'store') => {
    return location === 'warehouse' ? 'Bodega' : 'Local'
  }

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl h-[90vh] overflow-hidden border border-gray-700 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-900/20 rounded-lg">
              <Package className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Ajustar Stock</h2>
              <p className="text-sm text-gray-400">Modificar inventario del producto</p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-700"
          >
            <X className="h-4 w-4 text-gray-300 hover:text-white" />
          </Button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Product Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center space-x-2">
                  <Package className="h-5 w-5 text-emerald-400" />
                  <span>Información del Producto</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-400">Producto:</span>
                    <div className="text-white font-medium">{product.name}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Referencia:</span>
                    <div className="text-white font-mono text-sm">{product.reference}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-400">Stock Actual - Bodega:</span>
                    <div className="text-white font-medium">{formatNumber(product.stock.warehouse)} unidades</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-400">Stock Actual - Local:</span>
                    <div className="text-white font-medium">{formatNumber(product.stock.store)} unidades</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Adjustment Form */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-orange-400" />
                  <span>Configuración del Ajuste</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Location Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Ubicación a Ajustar *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('location', 'warehouse')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.location === 'warehouse'
                          ? 'border-orange-500 bg-orange-900/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Warehouse className={`h-5 w-5 ${formData.location === 'warehouse' ? 'text-orange-400' : 'text-gray-400'}`} />
                        <div className="text-left">
                          <div className={`font-medium ${formData.location === 'warehouse' ? 'text-orange-400' : 'text-gray-300'}`}>
                            Bodega
                          </div>
                          <div className="text-sm text-gray-400">
                            Stock actual: {formatNumber(product.stock.warehouse)}
                          </div>
                        </div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleInputChange('location', 'store')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        formData.location === 'store'
                          ? 'border-orange-500 bg-orange-900/20'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Store className={`h-5 w-5 ${formData.location === 'store' ? 'text-orange-400' : 'text-gray-400'}`} />
                        <div className="text-left">
                          <div className={`font-medium ${formData.location === 'store' ? 'text-orange-400' : 'text-gray-300'}`}>
                            Local
                          </div>
                          <div className="text-sm text-gray-400">
                            Stock actual: {formatNumber(product.stock.store)}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* New Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nueva Cantidad *
                  </label>
                  <input
                    type="text"
                    value={formatNumber(formData.newQuantity)}
                    onChange={(e) => {
                      const numericValue = parseFormattedNumber(e.target.value)
                      handleInputChange('newQuantity', numericValue)
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white bg-gray-700 ${
                      errors.newQuantity ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Ingrese la nueva cantidad"
                  />
                  {errors.newQuantity && (
                    <p className="mt-1 text-sm text-red-400">{errors.newQuantity}</p>
                  )}
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Razón del Ajuste *
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white bg-gray-700 ${
                      errors.reason ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Ej: Inventario físico, producto dañado, corrección de error..."
                    rows={3}
                  />
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-400">{errors.reason}</p>
                  )}
                </div>

                {/* Stock Difference Preview */}
                {formData.newQuantity !== getCurrentStock() && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">Diferencia:</span>
                      <div className="flex items-center space-x-2">
                        {getStockDifference() > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                        <span className={`text-lg font-bold ${
                          getStockDifference() > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {getStockDifference() > 0 ? '+' : ''}{formatNumber(getStockDifference())} unidades
                        </span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {getStockDifference() > 0 ? 'Incremento' : 'Reducción'} en {getLocationLabel(formData.location)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700 bg-gray-800 flex-shrink-0">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Ajustar Stock
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
