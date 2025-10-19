const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xxpmgwnkrcltymnlbwog.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cG1nd25rcmNsdHltbmxid29nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDgxMTc4NywiZXhwIjoyMDc2Mzg3Nzg3fQ.3lqJOOXYSWdATcSTHXo5IjNqXxSqju8xAlTzZHwwJ9o'

console.log('Using Supabase URL:', supabaseUrl)
console.log('Using Service Role Key:', supabaseKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function addStatusColumn() {
  try {
    console.log('🔧 Adding status column to categories table...')
    
    // Intentar agregar la columna status
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE categories 
        ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active' 
        CHECK (status IN ('active', 'inactive'));
      `
    })
    
    if (error) {
      console.error('Error adding status column:', error)
      
      // Si falla, intentar con una consulta más simple
      console.log('\n🔄 Trying alternative approach...')
      
      const { data: data2, error: error2 } = await supabase
        .from('categories')
        .select('*')
        .limit(1)
      
      if (error2) {
        console.error('Error reading categories:', error2)
      } else {
        console.log('Categories table structure:', data2)
      }
      
      console.log('\n📝 Manual SQL to execute in Supabase:')
      console.log(`
        ALTER TABLE categories 
        ADD COLUMN status VARCHAR(50) DEFAULT 'active' 
        CHECK (status IN ('active', 'inactive'));
      `)
      
    } else {
      console.log('✅ Status column added successfully!')
      console.log('Data:', data)
    }
    
    // Verificar que la columna se agregó
    console.log('\n🔍 Verifying column was added...')
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .select('id, name, status')
      .limit(1)
    
    if (testError) {
      console.error('Error verifying column:', testError)
    } else {
      console.log('✅ Column verification successful:', testData)
    }
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

addStatusColumn()

