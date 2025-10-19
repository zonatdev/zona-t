'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { User } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Plus, Search, Edit, Trash2, Eye, UserCheck, UserX } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmationModal } from '@/components/ui/confirmation-modal'

const roleOptions = [
  { value: 'superadmin', label: 'Super Administrador' },
  { value: 'admin', label: 'Administrador' },
  { value: 'vendedor', label: 'Vendedor' }
]

const moduleOptions = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'products', label: 'Productos' },
  { value: 'clients', label: 'Clientes' },
  { value: 'sales', label: 'Ventas' },
  { value: 'payments', label: 'Abonos' },
  { value: 'roles', label: 'Roles' },
  { value: 'logs', label: 'Logs' }
]

const actionOptions = [
  { value: 'view', label: 'Ver' },
  { value: 'create', label: 'Crear' },
  { value: 'edit', label: 'Editar' },
  { value: 'delete', label: 'Eliminar' },
  { value: 'cancel', label: 'Cancelar' }
]

// Permisos predefinidos por rol
const rolePermissions = {
  'superadmin': [
    { module: 'dashboard', actions: ['view'] },
    { module: 'products', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'clients', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'sales', actions: ['view', 'create', 'edit', 'delete', 'cancel'] },
    { module: 'payments', actions: ['view', 'create', 'edit', 'delete', 'cancel'] },
    { module: 'roles', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'logs', actions: ['view'] }
  ],
  'admin': [
    { module: 'dashboard', actions: ['view'] },
    { module: 'products', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'clients', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'sales', actions: ['view', 'create', 'edit', 'delete', 'cancel'] },
    { module: 'payments', actions: ['view', 'create', 'edit', 'delete'] },
    { module: 'logs', actions: ['view'] }
  ],
  'vendedor': [
    { module: 'products', actions: ['view'] },
    { module: 'clients', actions: ['view', 'create', 'edit'] },
    { module: 'sales', actions: ['view', 'create', 'edit'] },
    { module: 'payments', actions: ['view', 'create', 'edit'] }
  ],
  'inventario': [
    { module: 'dashboard', actions: ['view'] },
    { module: 'products', actions: ['view', 'create', 'edit'] },
    { module: 'logs', actions: ['view'] }
  ]
}

// Descripciones de cada rol
const roleDescriptions = {
  'superadmin': 'Acceso completo a todos los módulos del sistema',
  'admin': 'Gestión completa de productos, clientes, ventas y abonos',
  'vendedor': 'Puede crear facturas, gestionar clientes y recibir abonos',
  'inventario': 'Gestiona productos y revisa logs del sistema'
}

export function UserManagement() {
  const { user: currentUser, getAllUsers, createUser, updateUser, deleteUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Formulario para crear/editar usuario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'vendedor',
    permissions: [] as any[],
    isActive: true
  })

  // Debug: Log formData changes
  useEffect(() => {
    console.log('🔄 formData actualizado:', formData)
  }, [formData])

  // Aplicar permisos cuando se cambia el rol
  useEffect(() => {
    if (formData.role) {
      console.log('🔄 Aplicando permisos automáticamente para rol:', formData.role)
      const permissions = rolePermissions[formData.role as keyof typeof rolePermissions] || []
      console.log('📋 Permisos para', formData.role, ':', permissions)
      setFormData(prev => ({ ...prev, permissions }))
    }
  }, [formData.role])

  // Cargar usuarios
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      console.log('🔄 Cargando usuarios...')
      const usersData = await getAllUsers()
      console.log('✅ Usuarios cargados:', usersData)
      setUsers(usersData)
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error)
      toast.error('Error cargando usuarios')
    } finally {
      setLoading(false)
    }
  }

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive)
    
    return matchesSearch && matchesRole && matchesStatus
  })

  // Crear usuario
  const handleCreateUser = async () => {
    try {
      console.log('🔄 Creando usuario:', formData)
      const success = await createUser(formData)
      console.log('✅ Resultado creación:', success)
      if (success) {
        toast.success('Usuario creado exitosamente')
        setIsCreateModalOpen(false)
        resetForm()
        // Recargar usuarios después de crear
        await loadUsers()
      } else {
        toast.error('Error creando usuario')
      }
    } catch (error) {
      console.error('❌ Error creando usuario:', error)
      toast.error('Error creando usuario')
    }
  }

  // Actualizar usuario
  const handleUpdateUser = async () => {
    if (!selectedUser) return

    try {
      console.log('🔄 Actualizando usuario:', selectedUser.id, formData)
      
      const success = await updateUser(selectedUser.id, formData)
      if (success) {
        toast.success('Usuario actualizado exitosamente')
        setIsEditModalOpen(false)
        setSelectedUser(null)
        loadUsers()
      } else {
        toast.error('Error actualizando usuario')
      }
    } catch (error) {
      console.error('Error actualizando usuario:', error)
      toast.error('Error actualizando usuario')
    }
  }

  // Abrir modal de confirmación de eliminación
  const openDeleteModal = (user: User) => {
    if (user.id === currentUser?.id) {
      toast.error('No puedes eliminar tu propio usuario')
      return
    }
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      const success = await deleteUser(userToDelete.id)
      if (success) {
        toast.success('Usuario eliminado exitosamente')
        loadUsers()
        setIsDeleteModalOpen(false)
        setUserToDelete(null)
      } else {
        toast.error('Error eliminando usuario')
      }
    } catch (error) {
      toast.error('Error eliminando usuario')
    } finally {
      setIsDeleting(false)
    }
  }

  // Cancelar eliminación
  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setUserToDelete(null)
  }

  // Abrir modal de edición
  const openEditModal = (user: User) => {
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // No mostrar contraseña
      role: user.role,
      permissions: user.permissions || [],
      isActive: user.isActive
    })
    setIsEditModalOpen(true)
  }

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'vendedor',
      permissions: [],
      isActive: true
    })
  }

  // Toggle permiso
  const togglePermission = (module: string, action: string) => {
    const newPermissions = [...formData.permissions]
    const existingPermission = newPermissions.find(p => p.module === module)
    
    if (existingPermission) {
      if (existingPermission.actions.includes(action)) {
        existingPermission.actions = existingPermission.actions.filter(a => a !== action)
        if (existingPermission.actions.length === 0) {
          newPermissions.splice(newPermissions.indexOf(existingPermission), 1)
        }
      } else {
        existingPermission.actions.push(action)
      }
    } else {
      newPermissions.push({ module, actions: [action] })
    }
    
    setFormData({ ...formData, permissions: newPermissions })
  }

  // Verificar si tiene permiso
  const hasPermission = (module: string, action: string) => {
    console.log('🔍 Verificando permiso:', { module, action, permissions: formData.permissions })
    const permission = formData.permissions.find(p => p.module === module)
    const hasAccess = permission?.actions.includes(action) || false
    console.log('✅ Resultado:', hasAccess)
    return hasAccess
  }

  // Aplicar permisos predefinidos del rol
  const applyRolePermissions = (role: string) => {
    console.log('🔄 Aplicando permisos para rol:', role)
    console.log('📋 rolePermissions disponibles:', rolePermissions)
    const permissions = rolePermissions[role as keyof typeof rolePermissions] || []
    console.log('📋 Permisos obtenidos para', role, ':', permissions)
    
    setFormData(prev => {
      const newData = { ...prev, role, permissions }
      console.log('✅ Nuevos datos del formulario:', newData)
      return newData
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h2>
          <p className="text-gray-600 dark:text-gray-400">Administra los usuarios y sus permisos del sistema</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>
                Completa la información del nuevo usuario y asigna los permisos correspondientes.
              </DialogDescription>
            </DialogHeader>
            
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Ej: Juan Pérez"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="juan@zonat.com"
                            />
                          </div>
                        </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select value={formData.role} onValueChange={applyRolePermissions}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map(role => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                    <span className="font-semibold text-blue-700 dark:text-blue-300">
                      {roleDescriptions[formData.role as keyof typeof roleDescriptions]}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive" className="text-base font-medium">Usuario Activo</Label>
              </div>

              {/* Permisos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-lg font-bold text-gray-900 dark:text-white">Permisos del Sistema</Label>
                  <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                    Rol: <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      {roleOptions.find(r => r.value === formData.role)?.label}
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  {moduleOptions.map(module => (
                    <div key={module.value} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700">
                      <div className="font-semibold text-base mb-3 text-gray-900 dark:text-white">{module.label}</div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {(module.value === 'dashboard' || module.value === 'logs' 
                          ? actionOptions.filter(action => action.value === 'view')
                          : actionOptions
                        ).map(action => (
                          <label key={action.value} className="flex items-center space-x-3 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-lg transition-colors">
                            <input
                              type="checkbox"
                              checked={hasPermission(module.value, action.value)}
                              onChange={() => togglePermission(module.value, action.value)}
                              className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                              disabled={module.value === 'dashboard' || module.value === 'logs' ? action.value !== 'view' : false}
                            />
                            <span className={`text-gray-700 dark:text-gray-300 ${(module.value === 'dashboard' || module.value === 'logs') && action.value !== 'view' ? 'opacity-50' : ''}`}>
                              {action.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateUser}
                >
                  Crear Usuario
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Buscar usuarios</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="roleFilter">Filtrar por rol</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  {roleOptions.map(role => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="statusFilter">Filtrar por estado</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="inactive">Inactivos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <div className="grid gap-4">
        {filteredUsers.map(user => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                    </div>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? <UserCheck className="h-3 w-3 mr-1" /> : <UserX className="h-3 w-3 mr-1" />}
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                    <Badge variant="outline">
                      {roleOptions.find(r => r.value === user.role)?.label || user.role}
                    </Badge>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    Último acceso: {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Nunca'}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(user)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  {user.id !== currentUser?.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDeleteModal(user)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No se encontraron usuarios</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de edición */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
            <DialogDescription>
              Modifica la información del usuario y sus permisos.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editName">Nombre Completo</Label>
                <Input
                  id="editName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input
                  id="editEmail"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editPassword">Nueva Contraseña (opcional)</Label>
                <Input
                  id="editPassword"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Dejar vacío para mantener la actual"
                />
              </div>
              <div>
                <Label htmlFor="editRole">Rol</Label>
                <Select value={formData.role} onValueChange={applyRolePermissions}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(role => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 mt-2">
                  <span className="font-semibold text-blue-700 dark:text-blue-300">
                    {roleDescriptions[formData.role as keyof typeof roleDescriptions]}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="editIsActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="editIsActive">Usuario Activo</Label>
            </div>

            {/* Permisos */}
            <div>
              <Label className="text-base font-semibold">Permisos del Sistema</Label>
              <div className="mt-2 space-y-3">
                {moduleOptions.map(module => (
                  <div key={module.value} className="border rounded-lg p-3">
                    <div className="font-medium text-sm mb-2">{module.label}</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {(module.value === 'dashboard' || module.value === 'logs' 
                        ? actionOptions.filter(action => action.value === 'view')
                        : actionOptions
                      ).map(action => (
                        <label key={action.value} className="flex items-center space-x-2 text-sm">
                          <input
                            type="checkbox"
                            checked={hasPermission(module.value, action.value)}
                            onChange={() => togglePermission(module.value, action.value)}
                            className="rounded border-gray-300"
                            disabled={module.value === 'dashboard' || module.value === 'logs' ? action.value !== 'view' : false}
                          />
                          <span className={module.value === 'dashboard' || module.value === 'logs' ? action.value !== 'view' ? 'opacity-50' : '' : ''}>
                            {action.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateUser} className="bg-emerald-600 hover:bg-emerald-700">
                Actualizar Usuario
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Eliminar Usuario"
        description={`¿Estás seguro de que quieres eliminar a ${userToDelete?.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar Usuario"
        cancelText="Cancelar"
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  )
}
