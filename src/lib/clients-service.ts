import { supabase } from './supabase'
import { Client } from '@/types'

export class ClientsService {
  // Obtener todos los clientes
  static async getAllClients(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching clients:', error)
        return []
      }

      return data.map((client: any) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        document: client.document,
        address: client.address,
        city: client.city,
        state: client.state,
        type: client.type,
        creditLimit: client.credit_limit || 0,
        currentDebt: client.current_debt || 0,
        status: client.status,
        createdAt: client.created_at
      }))
    } catch (error) {
      console.error('Error in getAllClients:', error)
      return []
    }
  }

  // Obtener cliente por ID
  static async getClientById(id: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching client:', error)
        return null
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        document: data.document,
        address: data.address,
        city: data.city,
        state: data.state,
        type: data.type,
        creditLimit: data.credit_limit || 0,
        currentDebt: data.current_debt || 0,
        status: data.status,
        createdAt: data.created_at
      }
    } catch (error) {
      console.error('Error in getClientById:', error)
      return null
    }
  }

  // Crear nuevo cliente
  static async createClient(clientData: Omit<Client, 'id' | 'createdAt'>): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert({
          name: clientData.name,
          email: clientData.email,
          phone: clientData.phone,
          document: clientData.document,
          address: clientData.address,
          city: clientData.city,
          state: clientData.state,
          type: clientData.type,
          credit_limit: clientData.creditLimit,
          current_debt: clientData.currentDebt,
          status: clientData.status
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating client:', error)
        return null
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        document: data.document,
        address: data.address,
        city: data.city,
        state: data.state,
        type: data.type,
        creditLimit: data.credit_limit || 0,
        currentDebt: data.current_debt || 0,
        status: data.status,
        createdAt: data.created_at
      }
    } catch (error) {
      console.error('Error in createClient:', error)
      return null
    }
  }

  // Actualizar cliente
  static async updateClient(id: string, updates: Partial<Client>): Promise<boolean> {
    try {
      const updateData: any = {}
      
      if (updates.name) updateData.name = updates.name
      if (updates.email) updateData.email = updates.email
      if (updates.phone) updateData.phone = updates.phone
      if (updates.document) updateData.document = updates.document
      if (updates.address) updateData.address = updates.address
      if (updates.city) updateData.city = updates.city
      if (updates.state) updateData.state = updates.state
      if (updates.type) updateData.type = updates.type
      if (updates.creditLimit !== undefined) updateData.credit_limit = updates.creditLimit
      if (updates.currentDebt !== undefined) updateData.current_debt = updates.currentDebt
      if (updates.status) updateData.status = updates.status

      const { error } = await supabase
        .from('clients')
        .update(updateData)
        .eq('id', id)

      if (error) {
        console.error('Error updating client:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in updateClient:', error)
      return false
    }
  }

  // Eliminar cliente
  static async deleteClient(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting client:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error in deleteClient:', error)
      return false
    }
  }

  // Buscar clientes
  static async searchClients(query: string): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,document.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching clients:', error)
        return []
      }

      return data.map((client: any) => ({
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        document: client.document,
        address: client.address,
        city: client.city,
        state: client.state,
        type: client.type,
        creditLimit: client.credit_limit || 0,
        currentDebt: client.current_debt || 0,
        status: client.status,
        createdAt: client.created_at
      }))
    } catch (error) {
      console.error('Error in searchClients:', error)
      return []
    }
  }
}

