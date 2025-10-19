'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Client } from '@/types'
import { ClientsService } from '@/lib/clients-service'

interface ClientsContextType {
  clients: Client[]
  loading: boolean
  getAllClients: () => Promise<void>
  getClientById: (id: string) => Promise<Client | null>
  createClient: (clientData: Omit<Client, 'id' | 'createdAt'>) => Promise<Client | null>
  updateClient: (id: string, updates: Partial<Client>) => Promise<boolean>
  deleteClient: (id: string) => Promise<boolean>
  searchClients: (query: string) => Promise<Client[]>
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined)

export function ClientsProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)

  const getAllClients = useCallback(async () => {
    setLoading(true)
    try {
      const clientsData = await ClientsService.getAllClients()
      setClients(clientsData)
    } catch (error) {
      console.error('Error loading clients:', error)
      setClients([])
    } finally {
      setLoading(false)
    }
  }, [])

  const getClientById = async (id: string): Promise<Client | null> => {
    try {
      return await ClientsService.getClientById(id)
    } catch (error) {
      console.error('Error getting client:', error)
      return null
    }
  }

  const createClient = async (clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client | null> => {
    try {
      const newClient = await ClientsService.createClient(clientData)
      if (newClient) {
        setClients(prev => [newClient, ...prev])
        return newClient
      }
      return null
    } catch (error) {
      console.error('Error creating client:', error)
      return null
    }
  }

  const updateClient = async (id: string, updates: Partial<Client>): Promise<boolean> => {
    try {
      const success = await ClientsService.updateClient(id, updates)
      if (success) {
        setClients(prev => 
          prev.map(client => 
            client.id === id ? { ...client, ...updates } : client
          )
        )
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating client:', error)
      return false
    }
  }

  const deleteClient = async (id: string): Promise<boolean> => {
    try {
      const success = await ClientsService.deleteClient(id)
      if (success) {
        setClients(prev => prev.filter(client => client.id !== id))
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting client:', error)
      return false
    }
  }

  const searchClients = async (query: string): Promise<Client[]> => {
    try {
      return await ClientsService.searchClients(query)
    } catch (error) {
      console.error('Error searching clients:', error)
      return []
    }
  }

  // Cargar clientes al inicializar
  useEffect(() => {
    getAllClients()
  }, [getAllClients])

  return (
    <ClientsContext.Provider value={{
      clients,
      loading,
      getAllClients,
      getClientById,
      createClient,
      updateClient,
      deleteClient,
      searchClients
    }}>
      {children}
    </ClientsContext.Provider>
  )
}

export function useClients() {
  const context = useContext(ClientsContext)
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientsProvider')
  }
  return context
}
