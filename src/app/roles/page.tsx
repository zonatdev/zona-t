'use client'

import { useState } from 'react'
import { UsersTable } from '@/components/roles/users-table'
import { RolesTable } from '@/components/roles/roles-table'
import { mockUsers, mockRoles } from '@/data/mockData'
import { User, Role } from '@/types'

export default function RolesPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [roles, setRoles] = useState<Role[]>(mockRoles)
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users')

  // User handlers
  const handleViewUser = (user: User) => {
    console.log('View user:', user)
    // TODO: Implement user view modal
  }

  const handleEditUser = (user: User) => {
    console.log('Edit user:', user)
    // TODO: Implement user edit modal
  }

  const handleDeleteUser = (user: User) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el usuario ${user.name}?`)) {
      setUsers(users.filter(u => u.id !== user.id))
    }
  }

  const handleCreateUser = () => {
    console.log('Create new user')
    // TODO: Implement user create modal
  }

  // Role handlers
  const handleViewRole = (role: Role) => {
    console.log('View role:', role)
    // TODO: Implement role view modal
  }

  const handleEditRole = (role: Role) => {
    console.log('Edit role:', role)
    // TODO: Implement role edit modal
  }

  const handleDeleteRole = (role: Role) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el rol ${role.name}?`)) {
      setRoles(roles.filter(r => r.id !== role.id))
    }
  }

  const handleCreateRole = () => {
    console.log('Create new role')
    // TODO: Implement role create modal
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Roles y Usuarios</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Administra los usuarios, roles y permisos del sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Usuarios ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'roles'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Roles ({roles.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'users' && (
        <UsersTable
          users={users}
          roles={roles}
          onView={handleViewUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onCreate={handleCreateUser}
        />
      )}

      {activeTab === 'roles' && (
        <RolesTable
          roles={roles}
          onView={handleViewRole}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          onCreate={handleCreateRole}
        />
      )}
    </div>
  )
}