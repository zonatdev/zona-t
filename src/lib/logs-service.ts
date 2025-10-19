import { supabase } from './supabase'

export interface LogEntry {
  id: string
  user_id: string
  action: string
  module: string
  details: any
  ip_address?: string
  user_agent?: string
  created_at: string
  user_name?: string
}

export class LogsService {
  // Obtener todos los logs
  static async getAllLogs(): Promise<LogEntry[]> {
    try {
      console.log('🔄 Obteniendo logs de Supabase...')
      
      const { data: logs, error } = await supabase
        .from('logs')
        .select(`
          *,
          users!logs_user_id_fkey (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error obteniendo logs:', error)
        return []
      }

      console.log('✅ Logs obtenidos de Supabase:', logs)
      
      const mappedLogs = logs.map(log => ({
        id: log.id,
        user_id: log.user_id,
        action: log.action,
        module: log.module,
        details: log.details,
        ip_address: log.ip_address,
        user_agent: log.user_agent,
        created_at: log.created_at,
        user_name: log.users?.name || 'Usuario Desconocido'
      }))

      console.log('✅ Logs mapeados:', mappedLogs)
      return mappedLogs
    } catch (error) {
      console.error('❌ Error obteniendo logs:', error)
      return []
    }
  }

  // Obtener logs por módulo
  static async getLogsByModule(module: string): Promise<LogEntry[]> {
    try {
      const { data: logs, error } = await supabase
        .from('logs')
        .select(`
          *,
          users!logs_user_id_fkey (
            name
          )
        `)
        .eq('module', module)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error obteniendo logs por módulo:', error)
        return []
      }

      return logs.map(log => ({
        id: log.id,
        user_id: log.user_id,
        action: log.action,
        module: log.module,
        details: log.details,
        ip_address: log.ip_address,
        user_agent: log.user_agent,
        created_at: log.created_at,
        user_name: log.users?.name || 'Usuario Desconocido'
      }))
    } catch (error) {
      console.error('❌ Error obteniendo logs por módulo:', error)
      return []
    }
  }

  // Obtener logs por usuario
  static async getLogsByUser(userId: string): Promise<LogEntry[]> {
    try {
      const { data: logs, error } = await supabase
        .from('logs')
        .select(`
          *,
          users!logs_user_id_fkey (
            name
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error obteniendo logs por usuario:', error)
        return []
      }

      return logs.map(log => ({
        id: log.id,
        user_id: log.user_id,
        action: log.action,
        module: log.module,
        details: log.details,
        ip_address: log.ip_address,
        user_agent: log.user_agent,
        created_at: log.created_at,
        user_name: log.users?.name || 'Usuario Desconocido'
      }))
    } catch (error) {
      console.error('❌ Error obteniendo logs por usuario:', error)
      return []
    }
  }

  // Buscar logs por término
  static async searchLogs(searchTerm: string): Promise<LogEntry[]> {
    try {
      const { data: logs, error } = await supabase
        .from('logs')
        .select(`
          *,
          users!logs_user_id_fkey (
            name
          )
        `)
        .or(`action.ilike.%${searchTerm}%,module.ilike.%${searchTerm}%,details::text.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error buscando logs:', error)
        return []
      }

      return logs.map(log => ({
        id: log.id,
        user_id: log.user_id,
        action: log.action,
        module: log.module,
        details: log.details,
        ip_address: log.ip_address,
        user_agent: log.user_agent,
        created_at: log.created_at,
        user_name: log.users?.name || 'Usuario Desconocido'
      }))
    } catch (error) {
      console.error('❌ Error buscando logs:', error)
      return []
    }
  }
}
