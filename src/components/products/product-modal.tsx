'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Package, Tag, DollarSign, BarChart3, AlertTriangle, Store } from 'lucide-react'
import { Product, Category } from '@/types'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Omit<Product, 'id'>) => void
  product?: Product | null
  categories: Category[]
}

export function ProductModal({ isOpen, onClose, onSave, product, categories }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    reference: product?.reference || '',
    description: product?.description || '',
    price: product?.price || 0,
    cost: product?.cost || 0,
    stock: {
      warehouse: product?.stock?.warehouse || 0,
      store: product?.stock?.store || 0,
      total: product?.stock?.total || 0
    },
    categoryId: product?.categoryId || '',
    brand: product?.brand || '',
    status: product?.status || 'active',
    initialLocation: 'warehouse' as 'warehouse' | 'store'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive':
        return 'bg-gray-100 text-gray-800  '
      case 'discontinued':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 '
      case 'out_of_stock':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-800  '
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    if (!formData.reference.trim()) {
      newErrors.reference = 'La referencia es requerida'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }
    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0'
    }
    if (formData.cost < 0) {
      newErrors.cost = 'El costo no puede ser negativo'
    }
    if (formData.stock.warehouse < 0) {
      newErrors.stockWarehouse = 'El stock de bodega no puede ser negativo'
    }
    if (formData.stock.store < 0) {
      newErrors.stockStore = 'El stock de local no puede ser negativo'
    }
    if (!formData.categoryId) {
      newErrors.categoryId = 'La categoría es requerida'
    }
    if (!formData.brand.trim()) {
      newErrors.brand = 'La marca es requerida'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string | number) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSave = () => {
    if (validateForm()) {
      const totalStock = formData.stock.warehouse + formData.stock.store
      const productData: Omit<Product, 'id'> = {
        name: formData.name.trim(),
        reference: formData.reference.trim(),
        description: formData.description.trim(),
        price: formData.price,
        cost: formData.cost,
        stock: {
          warehouse: formData.stock.warehouse,
          store: formData.stock.store,
          total: totalStock
        },
        categoryId: formData.categoryId,
        brand: formData.brand.trim(),
        status: formData.status,
        createdAt: product?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      onSave(productData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      reference: '',
      description: '',
      price: 0,
      cost: 0,
      stock: {
        warehouse: 0,
        store: 0,
        total: 0
      },
      categoryId: '',
      brand: '',
      status: 'active',
      initialLocation: 'warehouse'
    })
    setErrors({})
    onClose()
  }

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        reference: product.reference,
        description: product.description,
        price: product.price,
        cost: product.cost,
        stock: {
          warehouse: product.stock.warehouse,
          store: product.stock.store,
          total: product.stock.total
        },
        categoryId: product.categoryId,
        brand: product.brand,
        status: product.status,
        initialLocation: 'warehouse'
      })
    }
  }, [product])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-emerald-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                {product ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <p className="text-sm text-gray-300">
                {product ? `Editando ${product.name}` : 'Crea un nuevo producto en tu inventario'}
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
          <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-6">
            {/* Información Básica */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Package className="h-5 w-5 mr-2 text-emerald-400" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 placeholder-gray-400 ${
                        errors.name ? 'border-red-500' : 'border-gray-600'
                      }`}
                      placeholder="Nombre del producto"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Referencia *
                    </label>
                    <input
                      type="text"
                      value={formData.reference}
                      onChange={(e) => handleInputChange('reference', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 ${
                        errors.reference ? 'border-red-500 ' : 'border-gray-600 '
                      }`}
                      placeholder="REF-001"
                    />
                    {errors.reference && (
                      <p className="mt-1 text-sm text-red-400 ">{errors.reference}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 resize-none ${
                      errors.description ? 'border-red-500 ' : 'border-gray-600 '
                    }`}
                    placeholder="Descripción detallada del producto"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400 ">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Marca *
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 ${
                        errors.brand ? 'border-red-500 ' : 'border-gray-600 '
                      }`}
                      placeholder="Marca del producto"
                    />
                    {errors.brand && (
                      <p className="mt-1 text-sm text-red-400 ">{errors.brand}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => handleInputChange('categoryId', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 ${
                        errors.categoryId ? 'border-red-500 ' : 'border-gray-600 '
                      }`}
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-400 ">{errors.categoryId}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información Financiera */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-emerald-400" />
                  Información Financiera
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Precio de Venta *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      value={formatNumber(formData.price)}
                      onChange={(e) => {
                        const numericValue = parseFormattedNumber(e.target.value)
                        handleInputChange('price', numericValue)
                      }}
                      className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 ${
                        errors.price ? 'border-red-500 ' : 'border-gray-600 '
                      }`}
                      placeholder="0"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-400 ">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Costo de Adquisición
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-400 text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      value={formatNumber(formData.cost)}
                      onChange={(e) => {
                        const numericValue = parseFormattedNumber(e.target.value)
                        handleInputChange('cost', numericValue)
                      }}
                      className={`w-full pl-8 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 ${
                        errors.cost ? 'border-red-500 ' : 'border-gray-600 '
                      }`}
                      placeholder="0"
                    />
                  </div>
                  {errors.cost && (
                    <p className="mt-1 text-sm text-red-400 ">{errors.cost}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Control de Stock */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-emerald-400" />
                  Control de Stock
                </CardTitle>
                {product && (
            <p className="text-sm text-gray-400 mt-2">
              ℹ️ El stock se muestra solo como información. Para modificar el inventario, usa las opciones de &quot;Ajustar Stock&quot; o &quot;Transferir Stock&quot; desde la tabla de productos.
            </p>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ubicación inicial para nuevos productos */}
                {!product && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ubicación Inicial
                    </label>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => handleInputChange('initialLocation', 'warehouse')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                          formData.initialLocation === 'warehouse'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                            : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                        }`}
                      >
                        <Package className="h-4 w-4" />
                        <span className="text-sm font-medium">Bodega</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange('initialLocation', 'store')}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                          formData.initialLocation === 'store'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                            : 'border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white'
                        }`}
                      >
                        <Store className="h-4 w-4" />
                        <span className="text-sm font-medium">Local</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Stock por ubicación */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bodega */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-blue-400" />
                      <h4 className="text-lg font-semibold text-white">Bodega</h4>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Stock Actual
                      </label>
                      {product ? (
                        // Solo lectura para productos existentes
                        <div className="w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-600/50 text-gray-300 cursor-not-allowed opacity-75">
                          {formatNumber(formData.stock.warehouse)} unidades
                        </div>
                      ) : (
                        // Editable solo para nuevos productos
                        <input
                          type="text"
                          value={formatNumber(formData.stock.warehouse)}
                          onChange={(e) => {
                            const numericValue = parseFormattedNumber(e.target.value)
                            handleInputChange('stock.warehouse', numericValue)
                          }}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 ${
                            errors.stockWarehouse ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="0"
                        />
                      )}
                      {errors.stockWarehouse && (
                        <p className="mt-1 text-sm text-red-400">{errors.stockWarehouse}</p>
                      )}
                    </div>

                  </div>

                  {/* Local */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Store className="h-5 w-5 text-green-400" />
                      <h4 className="text-lg font-semibold text-white">Local</h4>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Stock Actual
                      </label>
                      {product ? (
                        // Solo lectura para productos existentes
                        <div className="w-full px-3 py-2 border border-gray-500 rounded-md bg-gray-600/50 text-gray-300 cursor-not-allowed opacity-75">
                          {formatNumber(formData.stock.store)} unidades
                        </div>
                      ) : (
                        // Editable solo para nuevos productos
                        <input
                          type="text"
                          value={formatNumber(formData.stock.store)}
                          onChange={(e) => {
                            const numericValue = parseFormattedNumber(e.target.value)
                            handleInputChange('stock.store', numericValue)
                          }}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 ${
                            errors.stockStore ? 'border-red-500' : 'border-gray-600'
                          }`}
                          placeholder="0"
                        />
                      )}
                      {errors.stockStore && (
                        <p className="mt-1 text-sm text-red-400">{errors.stockStore}</p>
                      )}
                    </div>

                  </div>
                </div>

                {/* Total del stock */}
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Stock Total:</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {formatNumber(formData.stock.warehouse + formData.stock.store)} unidades
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estado del Producto */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-emerald-400" />
                  Estado del Producto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {['active', 'inactive', 'discontinued', 'out_of_stock'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleInputChange('status', status)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                        formData.status === status
                          ? 'border-emerald-500 bg-emerald-50  text-emerald-800 '
                          : 'border-gray-600  hover:border-gray-400 dark:hover:border-gray-500 text-gray-300 hover:text-white'
                      }`}
                    >
                      <span className="text-sm font-medium">{getStatusLabel(status)}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  <Badge className={getStatusColor(formData.status)}>
                    {getStatusLabel(formData.status)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-700 bg-gray-900">
          <Button
            onClick={handleClose}
            variant="outline"
            className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white font-medium px-6 py-2"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 font-medium px-6 py-2 shadow-md"
          >
            {product ? 'Guardar Cambios' : 'Crear Producto'}
          </Button>
        </div>
      </div>
    </div>
  )
}
