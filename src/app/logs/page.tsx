'use client'

import { useState } from 'react'
import { LogsTable } from '@/components/logs/logs-table'
import { LogDetailModal } from '@/components/logs/log-detail-modal'
import { mockLogs } from '@/data/mockLogs'
import { LogEntry } from '@/types/logs'

export default function LogsPage() {
  const [logs] = useState<LogEntry[]>(mockLogs)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const handleViewDetails = (log: LogEntry) => {
    setSelectedLog(log)
    setIsDetailModalOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailModalOpen(false)
    setSelectedLog(null)
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Registro de Actividades</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Historial completo de todas las operaciones del sistema
        </p>
      </div>

      <LogsTable
        logs={logs}
        onViewDetails={handleViewDetails}
      />

      <LogDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetail}
        log={selectedLog}
      />
    </div>
  )
}
