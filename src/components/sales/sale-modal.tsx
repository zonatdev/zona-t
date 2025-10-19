'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Plus, 
  Minus, 
  Search,
  Calculator,
  User,
  Package
} from 'lucide-react'
import { Sale, SaleItem, Product, Client } from '@/types'
import { mockProducts, mockClients } from '@/data/mockData'

interface SaleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (sale: Omit<Sale, 'id' | 'createdAt'>) => void
}

export function SaleModal({ isOpen, onClose, onSave }: SaleModalProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<SaleItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit' | 'transfer' | 'warranty' | 'mixed'>('cash')
  const [clientSearch, setClientSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [showProductDropdown, setShowProductDropdown] = useState(false)
  const [includeTax, setIncludeTax] = useState(true)
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<'percentage' | 'amount'>('percentage')
  const [saleNumber] = useState(() => Math.floor(Math.random() * 9000) + 1000) // Generar número aleatorio de 4 dígitos

  const filteredClients = mockClients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase())
  )

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) &&
    product.status === 'active'
  )

  const getClientTypeColor = (type: string) => {
    switch (type) {
      case 'mayorista':
        return 'bg-emerald-100 text-emerald-800'
      case 'minorista':
        return 'bg-blue-100 text-blue-800'
      case 'consumidor_final':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-green-100 text-green-800'
      case 'credit':
        return 'bg-blue-100 text-blue-800'
      case 'transfer':
        return 'bg-purple-100 text-purple-800'
      case 'warranty':
        return 'bg-orange-100 text-orange-800'
      case 'mixed':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Efectivo/Contado'
      case 'credit':
        return 'Crédito'
      case 'transfer':
        return 'Transferencia'
      case 'warranty':
        return 'Garantía'
      case 'mixed':
        return 'Mixto'
      default:
        return method
    }
  }

  // Solo considerar productos con cantidad > 0 para cálculos
  const validProducts = selectedProducts.filter(item => item.quantity > 0)
  const subtotal = validProducts.reduce((sum, item) => sum + item.total, 0)
  
  // Calcular descuento
  const discountAmount = discountType === 'percentage' 
    ? (subtotal * discount) / 100 
    : discount
  
  const subtotalAfterDiscount = Math.max(0, subtotal - discountAmount)
  
  // IVA opcional
  const tax = includeTax ? subtotalAfterDiscount * 0.16 : 0
  const total = subtotalAfterDiscount + tax

  const handleAddProduct = (product: Product) => {
    const existingItem = selectedProducts.find(item => item.productId === product.id)
    
    if (existingItem) {
      setSelectedProducts(prev => 
        prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.unitPrice }
            : item
        )
      )
    } else {
      const newItem: SaleItem = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        total: product.price
      }
      setSelectedProducts(prev => [...prev, newItem])
    }
    setShowProductDropdown(false)
    setProductSearch('')
  }

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedProducts(prev => prev.filter(item => item.id !== itemId))
      return
    }

    setSelectedProducts(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
          : item
      )
    )
  }

  const handleQuantityInputChange = (itemId: string, value: string) => {
    // Solo permitir números (incluyendo 0)
    const numericValue = value.replace(/[^0-9]/g, '')
    const quantity = numericValue === '' ? 0 : parseInt(numericValue, 10)
    
    // Permitir 0, no eliminar el producto
    setSelectedProducts(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: quantity, total: quantity * item.unitPrice }
          : item
      )
    )
  }

  const handleSave = () => {
    // Validar que hay cliente, productos y que todos tengan cantidad > 0
    const validProducts = selectedProducts.filter(item => item.quantity > 0)
    
    if (!selectedClient || selectedProducts.length === 0 || validProducts.length === 0) return

    const newSale: Omit<Sale, 'id' | 'createdAt'> = {
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      total,
      subtotal: subtotalAfterDiscount,
      tax,
      discount,
      status: 'completed',
      paymentMethod,
      items: validProducts // Solo incluir productos con cantidad > 0
    }

    onSave(newSale)
    handleClose()
  }

  const handleClose = () => {
    setSelectedClient(null)
    setSelectedProducts([])
    setPaymentMethod('cash')
    setClientSearch('')
    setProductSearch('')
    setShowClientDropdown(false)
    setShowProductDropdown(false)
    setIncludeTax(true)
    setDiscount(0)
    setDiscountType('percentage')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Calculator className="h-6 w-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Nueva Venta</h2>
              <p className="text-sm text-gray-600">Venta #{saleNumber}</p>
            </div>
          </div>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600 hover:text-gray-900" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Client and Products */}
            <div className="space-y-6">
              {/* Client Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg text-gray-900">
                    <User className="h-5 w-5 mr-2 text-emerald-600" />
                    Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar cliente..."
                      value={clientSearch}
                      onChange={(e) => {
                        setClientSearch(e.target.value)
                        setShowClientDropdown(true)
                      }}
                      onFocus={() => setShowClientDropdown(true)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                    />
                    
                    {showClientDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredClients.map(client => (
                          <button
                            key={client.id}
                            onClick={() => {
                              setSelectedClient(client)
                              setClientSearch(client.name)
                              setShowClientDropdown(false)
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-semibold text-gray-900">{client.name}</div>
                              <div className="text-sm text-gray-600">{client.type}</div>
                            </div>
                            <Badge className={`${getClientTypeColor(client.type)} font-medium`}>
                              {client.type === 'mayorista' ? 'Mayorista' : 
                               client.type === 'minorista' ? 'Minorista' : 'Consumidor Final'}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedClient && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-md">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-emerald-900">{selectedClient.name}</div>
                          <div className="text-sm text-emerald-800 font-semibold">{selectedClient.email}</div>
                        </div>
                        <Badge className={`${getClientTypeColor(selectedClient.type)} font-semibold`}>
                          {selectedClient.type === 'mayorista' ? 'Mayorista' : 
                           selectedClient.type === 'minorista' ? 'Minorista' : 'Consumidor Final'}
                        </Badge>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Product Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg text-gray-900">
                    <Package className="h-5 w-5 mr-2 text-emerald-600" />
                    Productos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value)
                        setShowProductDropdown(true)
                      }}
                      onFocus={() => setShowProductDropdown(true)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                    />
                    
                    {showProductDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                        {filteredProducts.map(product => (
                          <button
                            key={product.id}
                            onClick={() => handleAddProduct(product)}
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-semibold text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-600 font-medium">{product.brand} - {product.categoryId}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-gray-900">${product.price.toLocaleString()}</div>
                              <div className="text-sm text-gray-600 font-medium">Stock: {product.stock.total}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Products */}
                  {selectedProducts.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {selectedProducts.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{item.productName}</div>
                            <div className="text-sm text-gray-600 font-medium">${item.unitPrice.toLocaleString()} c/u</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-100"
                            >
                              <Minus className="h-4 w-4 text-gray-700" />
                            </Button>
                            <input
                              type="text"
                              value={item.quantity}
                              onChange={(e) => handleQuantityInputChange(item.id, e.target.value)}
                              className="w-12 h-8 text-center font-semibold text-gray-900 border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                              min="1"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0 border-gray-300 hover:bg-gray-100"
                            >
                              <Plus className="h-4 w-4 text-gray-700" />
                            </Button>
                            <div className="ml-4 text-right">
                              <div className="font-semibold text-gray-900">${item.total.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Payment and Summary */}
            <div className="space-y-6">
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Método de Pago</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white appearance-none cursor-pointer text-gray-900 font-medium"
                    >
                      <option value="cash">Efectivo/Contado</option>
                      <option value="credit">Crédito</option>
                      <option value="transfer">Transferencia</option>
                      <option value="warranty">Garantía</option>
                      <option value="mixed">Mixto</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Selected method indicator */}
                  <div className="mt-3">
                    <Badge className={getPaymentMethodColor(paymentMethod)}>
                      {getPaymentMethodLabel(paymentMethod)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Resumen de Venta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between">
                      <span className="text-gray-700 font-medium">Subtotal:</span>
                      <span className="font-semibold text-gray-900">${subtotal.toLocaleString()}</span>
                    </div>

                    {/* Descuento */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">Descuento:</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            value={discount}
                            onChange={(e) => setDiscount(Number(e.target.value))}
                            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-500 text-gray-900 font-medium"
                            min="0"
                            step={discountType === 'percentage' ? '0.1' : '1'}
                            placeholder="0"
                          />
                          <select
                            value={discountType}
                            onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'amount')}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 font-medium"
                          >
                            <option value="percentage">%</option>
                            <option value="amount">$</option>
                          </select>
                        </div>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Descuento aplicado:</span>
                          <span className="font-medium text-red-600">-${discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Subtotal después del descuento */}
                    {discountAmount > 0 && (
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-700 font-medium">Subtotal con descuento:</span>
                        <span className="font-semibold text-gray-900">${subtotalAfterDiscount.toLocaleString()}</span>
                      </div>
                    )}

                    {/* IVA */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">IVA (16%):</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={includeTax}
                            onChange={(e) => setIncludeTax(e.target.checked)}
                            className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-600">Incluir IVA</span>
                        </div>
                      </div>
                      {includeTax && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">IVA calculado:</span>
                          <span className="font-medium text-gray-900">${tax.toLocaleString()}</span>
                        </div>
                      )}
                    </div>

                    {/* Total */}
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-emerald-600 font-bold">${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-8 border-t border-gray-200 bg-gray-50 shadow-lg">
          <Button
            onClick={handleClose}
            variant="outline"
            className="border-gray-400 text-gray-700 hover:bg-gray-100 hover:text-gray-900 font-medium px-6 py-2"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!selectedClient || selectedProducts.length === 0 || validProducts.length === 0}
            className="bg-emerald-600 hover:bg-emerald-700 font-medium px-6 py-2 shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Crear Venta
          </Button>
        </div>
      </div>
    </div>
  )
}
