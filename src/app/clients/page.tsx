'use client'

import { useState } from 'react'
import { ClientTable } from '@/components/clients/client-table'
import { ClientModal } from '@/components/clients/client-modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { mockClients } from '@/data/mockData'
import { Client } from '@/types'

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>(mockClients)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null)

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  const handleDelete = (client: Client) => {
    setClientToDelete(client)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (clientToDelete) {
      setClients(clients.filter(c => c.id !== clientToDelete.id))
      setIsDeleteModalOpen(false)
      setClientToDelete(null)
    }
  }

  const handleView = (client: Client) => {
    console.log('View client:', client)
    // TODO: Implement view modal
  }

  const handleCreate = () => {
    setSelectedClient(null)
    setIsModalOpen(true)
  }

  const handleSaveClient = (clientData: Omit<Client, 'id'>) => {
    if (selectedClient) {
      // Edit existing client
      setClients(prev => 
        prev.map(client => 
          client.id === selectedClient.id 
            ? { ...clientData, id: selectedClient.id }
            : client
        )
      )
    } else {
      // Create new client
      const newClient: Client = {
        ...clientData,
        id: (clients.length + 1).toString()
      }
      setClients(prev => [newClient, ...prev])
    }
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Clientes</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Administra tus clientes minoristas, mayoristas y consumidores finales
        </p>
      </div>

      <ClientTable
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onCreate={handleCreate}
      />

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedClient(null)
        }}
        onSave={handleSaveClient}
        client={selectedClient}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setClientToDelete(null)
        }}
        onConfirm={confirmDelete}
        title="Eliminar Cliente"
        message={`¿Estás seguro de que quieres eliminar el cliente "${clientToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  )
}
