'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  User, 
  Building2,
  Mail,
  Phone,
  MapPin,
  Users
} from 'lucide-react'
import { Client } from '@/types'

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (client: Omit<Client, 'id'>) => void
  client?: Client | null
}

export function ClientModal({ isOpen, onClose, onSave, client }: ClientModalProps) {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    document: client?.document || '',
    address: client?.address || '',
    city: client?.city || '',
    state: client?.state || '',
    type: client?.type || 'consumidor_final',
    status: client?.status || 'active'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mayorista':
        return 'bg-blue-100 text-blue-800'
      case 'minorista':
        return 'bg-purple-100 text-purple-800'
      case 'consumidor_final':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'mayorista':
        return 'Mayorista'
      case 'minorista':
        return 'Minorista'
      case 'consumidor_final':
        return 'C. Final'
      default:
        return type
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'mayorista':
        return Building2
      case 'minorista':
        return Building2
      case 'consumidor_final':
        return User
      default:
        return User
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido'
    }

    if (!formData.document.trim()) {
      newErrors.document = 'La cédula/NIT es requerida'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'El estado es requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      const clientData: Omit<Client, 'id'> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        document: formData.document.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        type: formData.type,
        status: formData.status,
        creditLimit: 0, // Se maneja en el módulo de pagos
        currentDebt: 0, // Se maneja en el módulo de pagos
        createdAt: new Date().toISOString()
      }

      onSave(clientData)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      document: '',
      address: '',
      city: '',
      state: '',
      type: 'consumidor_final',
      status: 'active'
    })
    setErrors({})
    onClose()
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  const TypeIcon = getTypeIcon(formData.type)
  const isEdit = !!client

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-emerald-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <p className="text-sm text-gray-600">
                {isEdit ? 'Modifica la información del cliente' : 'Agrega un nuevo cliente al sistema'}
              </p>
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
          <div className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2 text-emerald-600" />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Cliente *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Ingresa el nombre del cliente"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Cliente *
                  </label>
                  <div className="flex space-x-3">
                            {[
                              { value: 'mayorista', label: 'Mayorista' },
                              { value: 'minorista', label: 'Minorista' },
                              { value: 'consumidor_final', label: 'Consumidor Final' }
                            ].map((type) => {
                              const Icon = getTypeIcon(type.value)
                              return (
                                <button
                                  key={type.value}
                                  onClick={() => handleInputChange('type', type.value)}
                                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                                    formData.type === type.value
                                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                                      : 'border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900'
                                  }`}
                                >
                                  <Icon className={`h-4 w-4 ${
                                    formData.type === type.value ? 'text-emerald-600' : 'text-gray-600'
                                  }`} />
                                  <span className="text-sm font-medium">{type.label}</span>
                                </button>
                              )
                            })}
                  </div>
                  <div className="mt-2">
                    <Badge className={getTypeColor(formData.type)}>
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {getTypeLabel(formData.type)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-emerald-600" />
                  Información de Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cédula/NIT *
                  </label>
                  <input
                    type="text"
                    value={formData.document}
                    onChange={(e) => handleInputChange('document', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                      errors.document ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="12345678-9 o 900123456-7"
                  />
                  {errors.document && (
                    <p className="mt-1 text-sm text-red-600">{errors.document}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+52 55 1234 5678"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="cliente@ejemplo.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Información de Ubicación */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                  Información de Ubicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Calle 30 #25-15, Barrio La Palma"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Sincelejo"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado *
                    </label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 ${
                        errors.state ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Sucre"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estado */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-900">Estado del Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="active"
                      checked={formData.status === 'active'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Activo</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="status"
                      value="inactive"
                      checked={formData.status === 'inactive'}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Inactivo</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={handleClose}
            variant="outline"
            className="border-gray-400 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {isEdit ? 'Actualizar Cliente' : 'Crear Cliente'}
          </Button>
        </div>
      </div>
    </div>
  )
}
