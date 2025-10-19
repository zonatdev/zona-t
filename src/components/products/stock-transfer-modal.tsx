'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, ArrowRightLeft, Package, Store, AlertTriangle } from 'lucide-react'
import { Product, StockTransfer } from '@/types'

interface StockTransferModalProps {
  isOpen: boolean
  onClose: () => void
  onTransfer: (transfer: Omit<StockTransfer, 'id' | 'createdAt' | 'userId' | 'userName'>) => void
  product: Product | null
}

export function StockTransferModal({ isOpen, onClose, onTransfer, product }: StockTransferModalProps) {
  const [formData, setFormData] = useState({
    fromLocation: 'warehouse' as 'warehouse' | 'store',
    toLocation: 'store' as 'warehouse' | 'store',
    quantity: 0,
    reason: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (formData.quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0'
    }

    if (formData.fromLocation === formData.toLocation) {
      newErrors.toLocation = 'La ubicación destino debe ser diferente a la origen'
    }

    if (product) {
      const availableStock = formData.fromLocation === 'warehouse' 
        ? product.stock.warehouse 
        : product.stock.store

      if (formData.quantity > availableStock) {
        newErrors.quantity = `No hay suficiente stock. Disponible: ${availableStock}`
      }
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'El motivo es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | number) => {
    // Para el campo quantity, si es string vacío, lo convertimos a 0
    const processedValue = field === 'quantity' && value === '' ? 0 : value
    setFormData(prev => ({ ...prev, [field]: processedValue }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleTransfer = () => {
    if (validateForm() && product) {
      onTransfer({
        productId: product.id,
        productName: product.name,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        quantity: formData.quantity,
        reason: formData.reason.trim()
      })
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      fromLocation: 'warehouse',
      toLocation: 'store',
      quantity: 0,
      reason: ''
    })
    setErrors({})
    onClose()
  }

  const getLocationLabel = (location: 'warehouse' | 'store') => {
    return location === 'warehouse' ? 'Bodega' : 'Local'
  }

  const getLocationIcon = (location: 'warehouse' | 'store') => {
    return location === 'warehouse' ? Package : Store
  }

  const getAvailableStock = () => {
    if (!product) return 0
    return formData.fromLocation === 'warehouse' 
      ? product.stock.warehouse 
      : product.stock.store
  }

  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <ArrowRightLeft className="h-6 w-6 text-emerald-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                Transferir Stock
              </h2>
              <p className="text-sm text-gray-300">
                {product.name} - {product.reference}
              </p>
            </div>
          </div>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-700"
          >
            <X className="h-5 w-5 text-gray-300 hover:text-white" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form onSubmit={(e) => { e.preventDefault(); handleTransfer() }} className="space-y-6">
            {/* Stock Actual */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Package className="h-5 w-5 mr-2 text-emerald-400" />
                  Stock Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <Package className="h-5 w-5 text-blue-400" />
                    <div>
                      <div className="text-sm text-gray-300">Bodega</div>
                      <div className="text-xl font-bold text-white">{product.stock.warehouse}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                    <Store className="h-5 w-5 text-green-400" />
                    <div>
                      <div className="text-sm text-gray-300">Local</div>
                      <div className="text-xl font-bold text-white">{product.stock.store}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transferencia */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <ArrowRightLeft className="h-5 w-5 mr-2 text-emerald-400" />
                  Detalles de la Transferencia
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Desde */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Desde *
                  </label>
                  <div className="flex space-x-4">
                    {(['warehouse', 'store'] as const).map((location) => {
                      const Icon = getLocationIcon(location)
                      const isSelected = formData.fromLocation === location
                      return (
                        <button
                          key={location}
                          type="button"
                          onClick={() => handleInputChange('fromLocation', location)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{getLocationLabel(location)}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Hacia */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Hacia *
                  </label>
                  <div className="flex space-x-4">
                    {(['warehouse', 'store'] as const).map((location) => {
                      const Icon = getLocationIcon(location)
                      const isSelected = formData.toLocation === location
                      const isDisabled = location === formData.fromLocation
                      return (
                        <button
                          key={location}
                          type="button"
                          onClick={() => !isDisabled && handleInputChange('toLocation', location)}
                          disabled={isDisabled}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                            isDisabled
                              ? 'border-gray-700 text-gray-500 cursor-not-allowed'
                              : isSelected
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{getLocationLabel(location)}</span>
                        </button>
                      )
                    })}
                  </div>
                  {errors.toLocation && (
                    <p className="mt-1 text-sm text-red-400">{errors.toLocation}</p>
                  )}
                </div>

                {/* Cantidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cantidad a Transferir *
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={getAvailableStock()}
                      value={formData.quantity || ''}
                      onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                      className={`flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 placeholder-gray-400 ${
                        errors.quantity ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Ingrese cantidad"
                    />
                    <div className="text-sm text-gray-400">
                      Máx: {getAvailableStock()}
                    </div>
                  </div>
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-400">{errors.quantity}</p>
                  )}
                </div>

                {/* Motivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Motivo de la Transferencia *
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 placeholder-gray-400 resize-y ${
                      errors.reason ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Ej: Reposición de tienda, devolución a bodega, etc."
                    rows={3}
                  />
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-400">{errors.reason}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resumen */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-yellow-400" />
                  Resumen de la Transferencia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Producto:</span>
                    <span className="text-white font-medium">{product.name}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Transferir:</span>
                    <span className="text-white font-medium">
                      {formData.quantity} unidades de {getLocationLabel(formData.fromLocation)} a {getLocationLabel(formData.toLocation)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                    <span className="text-gray-300">Stock después:</span>
                    <div className="text-white font-medium">
                      <div>Bodega: {formData.fromLocation === 'warehouse' 
                        ? product.stock.warehouse - formData.quantity 
                        : product.stock.warehouse + (formData.toLocation === 'warehouse' ? formData.quantity : 0)
                      }</div>
                      <div>Local: {formData.fromLocation === 'store' 
                        ? product.stock.store - formData.quantity 
                        : product.stock.store + (formData.toLocation === 'store' ? formData.quantity : 0)
                      }</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700 bg-gray-800">
          <Button
            onClick={handleClose}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleTransfer}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            Transferir Stock
          </Button>
        </div>
      </div>
    </div>
  )
}
