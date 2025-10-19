'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Users,
  Building2,
  User
} from 'lucide-react'
import { Client } from '@/types'

interface ClientTableProps {
  clients: Client[]
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
  onCreate: () => void
}

export function ClientTable({ 
  clients, 
  onEdit, 
  onDelete, 
  onCreate 
}: ClientTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')


  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-900/20 text-green-400 border-green-700' 
      : 'bg-red-900/20 text-red-400 border-red-700'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'mayorista':
        return 'bg-blue-900/20 text-blue-400 border-blue-700'
      case 'minorista':
        return 'bg-purple-900/20 text-purple-400 border-purple-700'
      case 'consumidor_final':
        return 'bg-green-900/20 text-green-400 border-green-700'
      default:
        return 'bg-gray-700 text-gray-300 border-gray-600'
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

  const types = ['all', 'mayorista', 'minorista', 'consumidor_final']

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone.includes(searchTerm) ||
                         client.document.includes(searchTerm) ||
                         client.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.state.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || client.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-gray-900 dark:text-white">
            <Users className="h-5 w-5 mr-2 text-emerald-600" />
            Gestión de Clientes
          </CardTitle>
          <Button onClick={onCreate} className="bg-emerald-700 hover:bg-emerald-800">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar clientes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 bg-white dark:bg-gray-700"
                    />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 dark:text-white bg-white dark:bg-gray-700"
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'Todos los tipos' : getTypeLabel(type)}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300 min-w-[120px]">Cédula/NIT</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Contacto</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Ubicación</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-300">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => {
                const TypeIcon = getTypeIcon(client.type)
                return (
                  <tr key={client.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center">
                            <TypeIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                          </div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{client.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 min-w-[120px]">
                      <div className="text-sm">
                        <div 
                          className="font-mono text-gray-900 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis cursor-help hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors" 
                          title={`Cédula/NIT: ${client.document}`}
                        >
                          {client.document}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getTypeColor(client.type)}>
                        {getTypeLabel(client.type)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="text-gray-900 dark:text-white">{client.email}</div>
                        <div className="text-gray-500 dark:text-gray-400">{client.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <div className="text-gray-900 dark:text-white">{client.address}</div>
                        <div className="text-gray-500 dark:text-gray-400">{client.city}, {client.state}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(client.status)}>
                        {client.status === 'active' ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onEdit(client)}
                          className="h-8 w-8 p-0 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-900/20"
                          title="Editar cliente"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDelete(client)}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                          title="Eliminar cliente"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

                {filteredClients.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p>No se encontraron clientes</p>
                  </div>
                )}
      </CardContent>
    </Card>
  )
}
