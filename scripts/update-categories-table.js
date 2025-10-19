const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Faltan variables de entorno de Supabase')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateCategoriesTable() {
  try {
    console.log('🔧 Actualizando tabla de categorías...')
    
    // Agregar columna status si no existe
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE categories 
        ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' 
        CHECK (status IN ('active', 'inactive'))
      `
    })

    if (alterError) {
      console.log('⚠️  Error agregando columna status:', alterError.message)
      // Intentar con SQL directo
      const { error: directError } = await supabase
        .from('categories')
        .select('status')
        .limit(1)
      
      if (directError && directError.message.includes('status')) {
        console.log('📝 La columna status no existe, creándola...')
        // Como no podemos usar ALTER TABLE directamente, vamos a recrear la tabla
        console.log('⚠️  No se puede modificar la tabla directamente. Por favor ejecuta este SQL en Supabase:')
        console.log(`
ALTER TABLE categories 
ADD COLUMN status VARCHAR(50) DEFAULT 'active' 
CHECK (status IN ('active', 'inactive'));
        `)
        return
      }
    }

    console.log('✅ Tabla de categorías actualizada exitosamente!')
    
  } catch (error) {
    console.error('❌ Error actualizando tabla:', error)
  }
}

updateCategoriesTable()

