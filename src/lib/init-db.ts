import { supabaseAdmin } from './supabase'

export async function initializeDatabase() {
  try {
    console.log('🚀 Inicializando base de datos de ZONA T...')

    // 1. Crear tabla de usuarios
    const { error: usersError } = await supabaseAdmin.rpc('create_users_table')
    if (usersError) {
      console.log('Tabla de usuarios ya existe o error:', usersError.message)
    } else {
      console.log('✅ Tabla de usuarios creada')
    }

    // 2. Crear tabla de roles
    const { error: rolesError } = await supabaseAdmin.rpc('create_roles_table')
    if (rolesError) {
      console.log('Tabla de roles ya existe o error:', rolesError.message)
    } else {
      console.log('✅ Tabla de roles creada')
    }

    // 3. Crear tabla de logs
    const { error: logsError } = await supabaseAdmin.rpc('create_logs_table')
    if (logsError) {
      console.log('Tabla de logs ya existe o error:', logsError.message)
    } else {
      console.log('✅ Tabla de logs creada')
    }

    // 4. Insertar roles por defecto
    const { error: rolesInsertError } = await supabaseAdmin
      .from('roles')
      .upsert([
        {
          id: '1',
          name: 'Super Administrador',
          description: 'Acceso completo a todos los módulos del sistema',
          permissions: [
            { module: 'dashboard', actions: ['view'] },
            { module: 'products', actions: ['view', 'create', 'edit', 'delete'] },
            { module: 'clients', actions: ['view', 'create', 'edit', 'delete'] },
            { module: 'sales', actions: ['view', 'create', 'edit', 'delete', 'cancel'] },
            { module: 'payments', actions: ['view', 'create', 'edit', 'delete'] },
            { module: 'roles', actions: ['view', 'create', 'edit', 'delete'] },
            { module: 'logs', actions: ['view'] }
          ],
          is_system: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Administrador',
          description: 'Gestión de productos, clientes y ventas',
          permissions: [
            { module: 'dashboard', actions: ['view'] },
            { module: 'products', actions: ['view', 'create', 'edit', 'delete'] },
            { module: 'clients', actions: ['view', 'create', 'edit', 'delete'] },
            { module: 'sales', actions: ['view', 'create', 'edit', 'delete', 'cancel'] },
            { module: 'payments', actions: ['view', 'create', 'edit', 'delete'] },
            { module: 'logs', actions: ['view'] }
          ],
          is_system: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Vendedor',
          description: 'Creación de ventas y gestión de abonos',
          permissions: [
            { module: 'dashboard', actions: ['view'] },
            { module: 'products', actions: ['view'] },
            { module: 'clients', actions: ['view', 'create', 'edit'] },
            { module: 'sales', actions: ['view', 'create', 'edit'] },
            { module: 'payments', actions: ['view', 'create', 'edit'] }
          ],
          is_system: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Vendedor Junior',
          description: 'Solo creación de ventas',
          permissions: [
            { module: 'dashboard', actions: ['view'] },
            { module: 'products', actions: ['view'] },
            { module: 'clients', actions: ['view'] },
            { module: 'sales', actions: ['view', 'create'] }
          ],
          is_system: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ], { onConflict: 'id' })

    if (rolesInsertError) {
      console.log('Error insertando roles:', rolesInsertError.message)
    } else {
      console.log('✅ Roles por defecto insertados')
    }

    // 5. Insertar usuario Diego
    const { error: diegoError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: '1',
        name: 'Diego Admin',
        email: 'diego@zonat.com',
        password: 'admin123', // En producción, hashear la contraseña
        role: 'superadmin',
        permissions: [
          { module: 'dashboard', actions: ['view'] },
          { module: 'products', actions: ['view', 'create', 'edit', 'delete'] },
          { module: 'clients', actions: ['view', 'create', 'edit', 'delete'] },
          { module: 'sales', actions: ['view', 'create', 'edit', 'delete', 'cancel'] },
          { module: 'payments', actions: ['view', 'create', 'edit', 'delete'] },
          { module: 'roles', actions: ['view', 'create', 'edit', 'delete'] },
          { module: 'logs', actions: ['view'] }
        ],
        is_active: true,
        last_login: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })

    if (diegoError) {
      console.log('Error insertando Diego:', diegoError.message)
    } else {
      console.log('✅ Usuario Diego creado')
    }

    console.log('🎉 Base de datos inicializada exitosamente!')
    return true

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error)
    return false
  }
}

// Función para crear las tablas usando SQL directo
export async function createTables() {
  try {
    // Crear tabla de usuarios
    const { error: usersError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(100) NOT NULL,
          permissions JSONB DEFAULT '[]',
          is_active BOOLEAN DEFAULT true,
          last_login TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    // Crear tabla de roles
    const { error: rolesError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS roles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          description TEXT,
          permissions JSONB DEFAULT '[]',
          is_system BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    // Crear tabla de logs
    const { error: logsError } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS logs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          action VARCHAR(100) NOT NULL,
          module VARCHAR(100) NOT NULL,
          details JSONB DEFAULT '{}',
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    console.log('✅ Tablas creadas exitosamente')
    return true

  } catch (error) {
    console.error('❌ Error creando tablas:', error)
    return false
  }
}
