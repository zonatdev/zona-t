'use client'

import { useState } from 'react'
import { ClientTable } from '@/components/clients/client-table'
import { ClientModal } from '@/components/clients/client-modal'
import { ConfirmModal } from '@/components/ui/confirm-modal'
import { useClients } from '@/contexts/clients-context'
import { Client } from '@/types'
import { toast } from 'sonner'

export default function ClientsPage() {
  const { clients, loading, createClient, updateClient, deleteClient } = useClients()
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

  const confirmDelete = async () => {
    if (clientToDelete) {
      const success = await deleteClient(clientToDelete.id)
      if (success) {
        toast.success('Cliente eliminado exitosamente')
        setIsDeleteModalOpen(false)
        setClientToDelete(null)
      } else {
        toast.error('Error eliminando cliente')
      }
    }
  }


  const handleCreate = () => {
    setSelectedClient(null)
    setIsModalOpen(true)
  }

  const handleSaveClient = async (clientData: Omit<Client, 'id'>) => {
    if (selectedClient) {
      // Edit existing client
      const success = await updateClient(selectedClient.id, clientData)
      if (success) {
        toast.success('Cliente actualizado exitosamente')
        setIsModalOpen(false)
        setSelectedClient(null)
      } else {
        toast.error('Error actualizando cliente')
      }
    } else {
      // Create new client
      const success = await createClient(clientData)
      if (success) {
        toast.success('Cliente creado exitosamente')
        setIsModalOpen(false)
      } else {
        toast.error('Error creando cliente')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="xl:ml-0 ml-20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Clientes</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Administra tus clientes minoristas, mayoristas y consumidores finales
        </p>
      </div>

      <ClientTable
        clients={clients}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
