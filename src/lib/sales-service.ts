import { supabase } from './supabase'
import { Sale, SaleItem } from '@/types'
import { AuthService } from './auth-service'
import { ProductsService } from './products-service'

export class SalesService {
  // Generar el siguiente número de factura
  static async getNextInvoiceNumber(): Promise<string> {
    try {
      const { count, error } = await supabase
        .from('sales')
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.error('Error getting sales count:', error)
        return '#001' // Fallback
      }

      const nextNumber = (count || 0) + 1
      return `#${nextNumber.toString().padStart(3, '0')}`
    } catch (error) {
      console.error('Error generating invoice number:', error)
      return '#001' // Fallback
    }
  }

  static async getAllSales(): Promise<Sale[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            id,
            product_id,
            product_name,
            quantity,
            unit_price,
            total
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching sales:', error)
        throw error
      }

      return data?.map(sale => ({
        id: sale.id,
        clientId: sale.client_id,
        clientName: sale.client_name,
        total: sale.total,
        subtotal: sale.subtotal,
        tax: sale.tax,
        discount: sale.discount,
        status: sale.status,
        paymentMethod: sale.payment_method,
        invoiceNumber: sale.invoice_number,
        createdAt: sale.created_at,
        items: sale.sale_items?.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          total: item.total
        })) || []
      })) || []
    } catch (error) {
      console.error('Error in getAllSales:', error)
      throw error
    }
  }

  static async getSaleById(id: string): Promise<Sale | null> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            id,
            product_id,
            product_name,
            quantity,
            unit_price,
            total
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching sale:', error)
        throw error
      }

      if (!data) return null

      return {
        id: data.id,
        clientId: data.client_id,
        clientName: data.client_name,
        total: data.total,
        subtotal: data.subtotal,
        tax: data.tax,
        discount: data.discount,
        status: data.status,
        paymentMethod: data.payment_method,
        createdAt: data.created_at,
        items: data.sale_items?.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          total: item.total
        })) || []
      }
    } catch (error) {
      console.error('Error in getSaleById:', error)
      throw error
    }
  }

  static async createSale(saleData: Omit<Sale, 'id' | 'createdAt'>, currentUserId: string): Promise<Sale> {
    try {
      // Generar número de factura secuencial
      const invoiceNumber = await this.getNextInvoiceNumber()
      
      // Crear la venta
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          client_id: saleData.clientId,
          client_name: saleData.clientName,
          total: saleData.total,
          subtotal: saleData.subtotal,
          tax: saleData.tax,
          discount: saleData.discount,
          status: saleData.status,
          payment_method: saleData.paymentMethod,
          invoice_number: invoiceNumber
        })
        .select()
        .single()

      if (saleError) {
        console.error('Error creating sale:', saleError)
        throw saleError
      }

      // Crear los items de la venta y descontar stock
      if (saleData.items && saleData.items.length > 0) {
        // Primero descontar stock de todos los productos
        for (const item of saleData.items) {
          const stockDeducted = await ProductsService.deductStockForSale(
            item.productId, 
            item.quantity, 
            currentUserId
          )
          
          if (!stockDeducted) {
            // Si no se pudo descontar stock, revertir la venta
            await supabase.from('sales').delete().eq('id', sale.id)
            throw new Error(`No hay suficiente stock para el producto: ${item.productName}`)
          }
        }

        // Si todo el stock se descontó correctamente, crear los items de la venta
        const saleItems = saleData.items.map(item => ({
          sale_id: sale.id,
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          total: item.total
        }))

        const { error: itemsError } = await supabase
          .from('sale_items')
          .insert(saleItems)

        if (itemsError) {
          console.error('Error creating sale items:', itemsError)
          throw itemsError
        }
      }

      // Crear el registro de pago si es necesario
      if (saleData.paymentMethod !== 'credit') {
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            sale_id: sale.id,
            client_id: saleData.clientId,
            client_name: saleData.clientName,
            invoice_number: invoiceNumber,
            total_amount: saleData.total,
            paid_amount: saleData.paymentMethod === 'cash' ? saleData.total : 0,
            pending_amount: saleData.paymentMethod === 'cash' ? 0 : saleData.total,
            status: saleData.paymentMethod === 'cash' ? 'completed' : 'pending'
          })

        if (paymentError) {
          console.error('Error creating payment:', paymentError)
          throw paymentError
        }
      }

      // Log de actividad
      await AuthService.logActivity(
        currentUserId,
        'sale_create',
        'sales',
        {
          description: `Nueva venta creada: ${saleData.clientName} - Total: $${saleData.total.toLocaleString()}`,
          saleId: sale.id,
          clientName: saleData.clientName,
          total: saleData.total,
          paymentMethod: saleData.paymentMethod,
          itemsCount: saleData.items?.length || 0
        }
      )

      // Retornar la venta creada
      const newSale: Sale = {
        id: sale.id,
        clientId: sale.client_id,
        clientName: sale.client_name,
        total: sale.total,
        subtotal: sale.subtotal,
        tax: sale.tax,
        discount: sale.discount,
        status: sale.status,
        paymentMethod: sale.payment_method,
        invoiceNumber: invoiceNumber,
        createdAt: sale.created_at,
        items: saleData.items || []
      }

      return newSale
    } catch (error) {
      console.error('Error in createSale:', error)
      throw error
    }
  }

  static async updateSale(id: string, saleData: Partial<Sale>, currentUserId: string): Promise<Sale> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .update({
          client_id: saleData.clientId,
          client_name: saleData.clientName,
          total: saleData.total,
          subtotal: saleData.subtotal,
          tax: saleData.tax,
          discount: saleData.discount,
          status: saleData.status,
          payment_method: saleData.paymentMethod,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Error updating sale:', error)
        throw error
      }

      // Log de actividad
      await AuthService.logActivity(
        currentUserId,
        'sale_update',
        'sales',
        {
          description: `Venta actualizada: ${saleData.clientName || 'Venta'} - Total: $${saleData.total?.toLocaleString() || 'N/A'}`,
          saleId: id,
          changes: Object.keys(saleData).join(', ')
        }
      )

      return {
        id: data.id,
        clientId: data.client_id,
        clientName: data.client_name,
        total: data.total,
        subtotal: data.subtotal,
        tax: data.tax,
        discount: data.discount,
        status: data.status,
        paymentMethod: data.payment_method,
        createdAt: data.created_at,
        items: saleData.items || []
      }
    } catch (error) {
      console.error('Error in updateSale:', error)
      throw error
    }
  }

  static async deleteSale(id: string, currentUserId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting sale:', error)
        throw error
      }

      // Log de actividad
      await AuthService.logActivity(
        currentUserId,
        'sale_delete',
        'sales',
        {
          description: `Venta eliminada: ID ${id}`,
          saleId: id
        }
      )
    } catch (error) {
      console.error('Error in deleteSale:', error)
      throw error
    }
  }

  static async cancelSale(id: string, reason: string, currentUserId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('sales')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Error cancelling sale:', error)
        throw error
      }

      // Log de actividad
      await AuthService.logActivity(
        currentUserId,
        'sale_cancel',
        'sales',
        {
          description: `Venta cancelada: ID ${id} - Motivo: ${reason}`,
          saleId: id,
          reason: reason
        }
      )
    } catch (error) {
      console.error('Error in cancelSale:', error)
      throw error
    }
  }

  static async searchSales(searchTerm: string): Promise<Sale[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          sale_items (
            id,
            product_id,
            product_name,
            quantity,
            unit_price,
            total
          )
        `)
        .or(`client_name.ilike.%${searchTerm}%,id.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching sales:', error)
        throw error
      }

      return data?.map(sale => ({
        id: sale.id,
        clientId: sale.client_id,
        clientName: sale.client_name,
        total: sale.total,
        subtotal: sale.subtotal,
        tax: sale.tax,
        discount: sale.discount,
        status: sale.status,
        paymentMethod: sale.payment_method,
        invoiceNumber: sale.invoice_number,
        createdAt: sale.created_at,
        items: sale.sale_items?.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          total: item.total
        })) || []
      })) || []
    } catch (error) {
      console.error('Error in searchSales:', error)
      throw error
    }
  }
}
