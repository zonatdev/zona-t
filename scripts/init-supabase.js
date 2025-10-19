const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no encontradas')
  console.error('Asegúrate de tener un archivo .env.local con:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=...')
  console.error('SUPABASE_SERVICE_ROLE_KEY=...')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function initializeDatabase() {
  try {
    console.log('🚀 Inicializando base de datos de ZONA T...')

    // 1. Crear tabla de usuarios
    const { error: usersError } = await supabase.rpc('exec_sql', {
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

    if (usersError) {
      console.log('Tabla de usuarios ya existe o error:', usersError.message)
    } else {
      console.log('✅ Tabla de usuarios creada')
    }

    // 2. Crear tabla de roles
    const { error: rolesError } = await supabase.rpc('exec_sql', {
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

    if (rolesError) {
      console.log('Tabla de roles ya existe o error:', rolesError.message)
    } else {
      console.log('✅ Tabla de roles creada')
    }

    // 3. Crear tabla de logs
    const { error: logsError } = await supabase.rpc('exec_sql', {
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

    if (logsError) {
      console.log('Tabla de logs ya existe o error:', logsError.message)
    } else {
      console.log('✅ Tabla de logs creada')
    }

    // 4. Insertar roles por defecto
    const { error: rolesInsertError } = await supabase
      .from('roles')
      .upsert([
        {
          id: '00000000-0000-0000-0000-000000000001',
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
          id: '00000000-0000-0000-0000-000000000002',
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
          id: '00000000-0000-0000-0000-000000000003',
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
        }
      ], { onConflict: 'id' })

    if (rolesInsertError) {
      console.log('Error insertando roles:', rolesInsertError.message)
    } else {
      console.log('✅ Roles por defecto insertados')
    }

    // 5. Insertar usuario Diego
    const { error: diegoError } = await supabase
      .from('users')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
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
    console.log('📧 Usuario: diego@zonat.com')
    console.log('🔑 Contraseña: admin123')
    return true

  } catch (error) {
    console.error('❌ Error inicializando base de datos:', error)
    return false
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initializeDatabase()
    .then(success => {
      if (success) {
        console.log('✅ Inicialización completada')
        process.exit(0)
      } else {
        console.log('❌ Error en la inicialización')
        process.exit(1)
      }
    })
    .catch(error => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}

module.exports = { initializeDatabase }
