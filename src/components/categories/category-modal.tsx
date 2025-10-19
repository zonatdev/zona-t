'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Tag, Plus, Edit, Trash2 } from 'lucide-react'
import { Category } from '@/types'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdate: (category: Category) => void
  onDelete: (categoryId: string) => void
  category?: Category | null
  categories: Category[]
}

export function CategoryModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onUpdate, 
  onDelete, 
  category, 
  categories 
}: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    status: category?.status || 'active'
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isEditing, setIsEditing] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa'
      case 'inactive':
        return 'Inactiva'
      default:
        return status
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSave = () => {
    if (validateForm()) {
      if (category) {
        onUpdate({
          ...category,
          name: formData.name.trim(),
          description: formData.description.trim(),
          status: formData.status,
          updatedAt: new Date().toISOString()
        })
      } else {
        onSave({
          name: formData.name.trim(),
          description: formData.description.trim(),
          status: formData.status
        })
      }
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      status: 'active'
    })
    setErrors({})
    setIsEditing(false)
    onClose()
  }

  const handleDelete = () => {
    if (category) {
      onDelete(category.id)
      handleClose()
    }
  }

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        status: category.status
      })
    }
  }, [category])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <Tag className="h-6 w-6 text-emerald-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">
                {category ? 'Editar Categoría' : 'Nueva Categoría'}
              </h2>
              <p className="text-sm text-gray-300">
                {category ? `Editando ${category.name}` : 'Crea una nueva categoría'}
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
                  <Tag className="h-5 w-5 mr-2 text-emerald-400" />
                  Información de la Categoría
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre de la Categoría *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 placeholder-gray-400 ${
                      errors.name ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Nombre de la categoría"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white bg-gray-800 placeholder-gray-400 resize-y ${
                      errors.description ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Descripción de la categoría"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-400">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estado
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange('status', 'active')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                        formData.status === 'active'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">Activa</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange('status', 'inactive')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                        formData.status === 'inactive'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                          : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <span className="text-sm font-medium">Inactiva</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de categorías existentes */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center">
                  <Tag className="h-5 w-5 mr-2 text-emerald-400" />
                  Categorías Existentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-3 border border-gray-700 rounded-lg bg-gray-900 hover:bg-gray-700 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h4 className="font-medium text-white">{cat.name}</h4>
                          <Badge className={getStatusColor(cat.status)}>
                            {getStatusLabel(cat.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{cat.description}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setFormData({
                              name: cat.name,
                              description: cat.description,
                              status: cat.status
                            })
                            setIsEditing(true)
                          }}
                          className="h-8 w-8 p-0 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                          title="Editar categoría"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(cat.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                          title="Eliminar categoría"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <Tag className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                      <p>No hay categorías creadas</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700 bg-gray-800">
          <div className="flex items-center space-x-2">
            {category && (
              <Button
                onClick={handleDelete}
                variant="outline"
                className="border-red-700 text-red-400 hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleClose}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {category ? 'Guardar Cambios' : 'Crear Categoría'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
