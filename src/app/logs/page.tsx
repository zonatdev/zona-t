'use client'

import { useState, useEffect } from 'react'
import { LogsTable } from '@/components/logs/logs-table'
import { LogDetailModal } from '@/components/logs/log-detail-modal'
import { LogsService, LogEntry } from '@/lib/logs-service'

export default function LogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [moduleFilter, setModuleFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')

  // Cargar logs al montar el componente
  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    setLoading(true)
    try {
      console.log('🔄 Cargando logs...')
      const logsData = await LogsService.getAllLogs()
      console.log('✅ Logs cargados:', logsData)
      setLogs(logsData)
    } catch (error) {
      console.error('❌ Error cargando logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (log: LogEntry) => {
    setSelectedLog(log)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false)
    setSelectedLog(null)
  }

  // Filtrar logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesModule = moduleFilter === 'all' || log.module === moduleFilter
    const matchesAction = actionFilter === 'all' || log.action === actionFilter

    return matchesSearch && matchesModule && matchesAction
  })

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="xl:ml-0 ml-20">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Registro de Actividades</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Historial completo de todas las operaciones del sistema
        </p>
      </div>

      <LogsTable
        logs={filteredLogs as any}
        onViewDetails={handleViewDetails as any}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        moduleFilter={moduleFilter}
        onModuleFilterChange={setModuleFilter}
        actionFilter={actionFilter}
        onActionFilterChange={setActionFilter}
        onRefresh={loadLogs}
      />

      <LogDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        log={selectedLog as any}
      />
    </div>
  )
}
