import { supabase } from './supabase'
import { Category } from '@/types'
import { AuthService } from './auth-service'
import { v4 as uuidv4 } from 'uuid'

export class CategoriesService {
  // Obtener todas las categorías
  static async getAllCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) {
        console.error('Error fetching categories:', error)
        return []
      }

      return data.map((category: any) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        status: category.status || 'active',
        createdAt: category.created_at,
        updatedAt: category.updated_at
      }))
    } catch (error) {
      console.error('Error in getAllCategories:', error)
      return []
    }
  }

  // Obtener categoría por ID
  static async getCategoryById(id: string): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching category:', error)
        return null
      }

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      }
    } catch (error) {
      console.error('Error in getCategoryById:', error)
      return null
    }
  }

  // Crear nueva categoría
  static async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>, currentUserId?: string): Promise<Category | null> {
    try {
      const insertData = {
        id: uuidv4(),
        name: categoryData.name,
        description: categoryData.description,
        status: categoryData.status || 'active'
      }
      
      const { data, error } = await supabase
        .from('categories')
        .insert(insertData)
        .select()

      if (error) {
        console.error('❌ Error creating category:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error,
          errorString: JSON.stringify(error)
        })
        return null
      }

      if (!data || data.length === 0) {
        console.error('No data returned from insert')
        return null
      }

      const newCategory = {
        id: data[0].id,
        name: data[0].name,
        description: data[0].description,
        status: data[0].status || 'active',
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at
      }

      // Registrar la actividad
      if (currentUserId) {
        await AuthService.logActivity(
          currentUserId,
          'category_create',
          'categories',
          {
            description: `Se creó la categoría "${categoryData.name}"`,
            categoryId: data.id,
            categoryName: categoryData.name,
            categoryDescription: categoryData.description
          }
        )
      }

      return newCategory
    } catch (error) {
      console.error('Error in createCategory:', error)
      return null
    }
  }

  // Actualizar categoría
  static async updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>, currentUserId?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('categories')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        console.error('Error updating category:', error)
        return false
      }

      // Registrar la actividad
      if (currentUserId) {
        const category = await this.getCategoryById(id)
        const categoryName = category?.name || `ID: ${id}`
        
        await AuthService.logActivity(
          currentUserId,
          'category_update',
          'categories',
          {
            description: `Se actualizó la categoría "${categoryName}". Campos modificados: ${Object.keys(updates).join(', ')}`,
            categoryId: id,
            categoryName: categoryName,
            changes: Object.keys(updates),
            updatedFields: updates
          }
        )
      }

      return true
    } catch (error) {
      console.error('Error in updateCategory:', error)
      return false
    }
  }

  // Eliminar categoría
  static async deleteCategory(id: string, currentUserId?: string): Promise<boolean> {
    try {
      // Obtener la categoría antes de eliminarla para el log
      const category = await this.getCategoryById(id)
      const categoryName = category?.name || `ID: ${id}`

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting category:', error)
        return false
      }

      // Registrar la actividad
      if (currentUserId) {
        await AuthService.logActivity(
          currentUserId,
          'category_delete',
          'categories',
          {
            description: `Se eliminó la categoría "${categoryName}"`,
            categoryId: id,
            categoryName: categoryName
          }
        )
      }

      return true
    } catch (error) {
      console.error('Error in deleteCategory:', error)
      return false
    }
  }

  // Buscar categorías
  static async searchCategories(query: string): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('name', { ascending: true })

      if (error) {
        console.error('Error searching categories:', error)
        return []
      }

      return data.map((category: any) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        status: category.status || 'active',
        createdAt: category.created_at,
        updatedAt: category.updated_at
      }))
    } catch (error) {
      console.error('Error in searchCategories:', error)
      return []
    }
  }
}
