# 🚀 Configuración de Supabase para ZONA T

## 📋 Pasos para Configurar la Base de Datos

### 1. **Crear las Tablas en Supabase**

**Opción A: Usar el SQL Editor de Supabase (Recomendado)**
1. Ir a [Supabase Dashboard](https://supabase.com/dashboard)
2. Seleccionar tu proyecto
3. Ir a "SQL Editor"
4. Copiar y pegar el contenido de `scripts/create-tables.sql`
5. Ejecutar el script

**Opción B: Usar el script de Node.js**
```bash
npm run init-db
```

**Nota:** El script de Node.js puede fallar si no tienes permisos de `exec_sql` habilitados en Supabase.

### 2. **Tablas Creadas**

#### **users**
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR)
- `role` (VARCHAR)
- `permissions` (JSONB)
- `is_active` (BOOLEAN)
- `last_login` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### **roles**
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT)
- `permissions` (JSONB)
- `is_system` (BOOLEAN)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### **logs**
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `action` (VARCHAR)
- `module` (VARCHAR)
- `details` (JSONB)
- `ip_address` (INET)
- `user_agent` (TEXT)
- `created_at` (TIMESTAMP)

### 3. **Datos Iniciales**

#### **Roles por Defecto:**
- **Super Administrador**: Acceso completo a todos los módulos
- **Administrador**: Gestión de productos, clientes y ventas
- **Vendedor**: Creación de ventas y gestión de abonos
- **Vendedor Junior**: Solo creación de ventas

#### **Usuario Principal:**
- **Email**: `diego@zonat.com`
- **Contraseña**: `admin123`
- **Rol**: Super Administrador

### 4. **Funcionalidades Implementadas**

#### **Gestión de Usuarios:**
- ✅ Crear nuevos usuarios
- ✅ Editar usuarios existentes
- ✅ Eliminar usuarios
- ✅ Asignar roles y permisos granulares
- ✅ Activar/desactivar usuarios

#### **Sistema de Permisos:**
- ✅ Permisos por módulo (Dashboard, Productos, Clientes, Ventas, Abonos, Roles, Logs)
- ✅ Permisos por acción (Ver, Crear, Editar, Eliminar, Cancelar)
- ✅ Roles predefinidos y personalizados

#### **Logs de Actividad:**
- ✅ Registro automático de acciones
- ✅ Trazabilidad de cambios
- ✅ Información de usuario y timestamp

### 5. **Configuración de Seguridad**

#### **Recomendaciones para Producción:**
1. **Hashear contraseñas** usando bcrypt o similar
2. **Implementar JWT** para autenticación
3. **Configurar RLS** (Row Level Security) en Supabase
4. **Validar permisos** en el backend
5. **Implementar rate limiting**

### 6. **Variables de Entorno**

**IMPORTANTE:** Crear archivo `.env.local` en la raíz del proyecto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxpmgwnkrcltymnlbwog.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cG1nd25rcmNsdHltbmxid29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTE3ODcsImV4cCI6MjA3NjM4Nzc4N30.LqN9gLEluoe2Xs8InT-xTUI2E6iWFbrXUdZxbfsmnu4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cG1nd25rcmNsdHltbmxid29nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDgxMTc4NywiZXhwIjoyMDc2Mzg3Nzg3fQ.3lqJOOXYSWdATcSTHXo5IjNqXxSqju8xAlTzZHwwJ9o
```

**⚠️ SEGURIDAD:** 
- El archivo `.env.local` NO debe subirse a Git
- Las claves están ahora en variables de entorno
- El código ya no tiene claves hardcodeadas

### 7. **Uso del Sistema**

#### **Para Diego (Super Admin):**
1. Iniciar sesión con `diego@zonat.com` / `admin123`
2. Ir a "Roles" en el sidebar
3. Crear nuevos usuarios con permisos específicos
4. Asignar roles predefinidos o personalizados

#### **Para Nuevos Usuarios:**
1. Diego crea el usuario con email y contraseña
2. Asigna permisos específicos por módulo
3. El usuario puede iniciar sesión inmediatamente
4. Solo ve los módulos para los que tiene permisos

### 8. **Estructura de Permisos**

```json
{
  "module": "products",
  "actions": ["view", "create", "edit", "delete"]
}
```

**Módulos disponibles:**
- `dashboard` - Panel principal
- `products` - Gestión de productos
- `clients` - Gestión de clientes
- `sales` - Gestión de ventas
- `payments` - Gestión de abonos
- `roles` - Gestión de usuarios y roles
- `logs` - Registro de actividades

**Acciones disponibles:**
- `view` - Ver/consultar
- `create` - Crear nuevos registros
- `edit` - Modificar registros existentes
- `delete` - Eliminar registros
- `cancel` - Cancelar operaciones (específico para ventas)

### 9. **Troubleshooting**

#### **Error de conexión:**
- Verificar que las claves de Supabase sean correctas
- Comprobar que el proyecto esté activo en Supabase

#### **Error de permisos:**
- Verificar que el usuario tenga permisos para la acción
- Comprobar que el rol esté correctamente asignado

#### **Error de base de datos:**
- Ejecutar `npm run init-db` nuevamente
- Verificar que las tablas existan en Supabase

---

## 🎯 **¡Sistema Listo!**

Una vez ejecutado `npm run init-db`, el sistema estará completamente funcional con:
- ✅ Base de datos configurada
- ✅ Usuario principal creado
- ✅ Roles y permisos establecidos
- ✅ Sistema de logs implementado
- ✅ Gestión completa de usuarios

**¡Diego puede ahora crear usuarios y asignar permisos específicos para cada módulo del dashboard!** 🚀
