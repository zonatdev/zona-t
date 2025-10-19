const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://xxpmgwnkrcltymnlbwog.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cG1nd25rcmNsdHltbmxid29nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDgxMTc4NywiZXhwIjoyMDc2Mzg3Nzg3fQ.3lqJOOXYSWdATcSTHXo5IjNqXxSqju8xAlTzZHwwJ9o'

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function addUpdatedAtColumn() {
  try {
    console.log('🔧 Adding updated_at column to categories table...')
    
    // Intentar agregar la columna updated_at
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE categories 
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      `
    })
    
    if (error) {
      console.error('Error adding updated_at column:', error)
      
      console.log('\n📝 Manual SQL to execute in Supabase:')
      console.log(`
        ALTER TABLE categories 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
      `)
      
    } else {
      console.log('✅ updated_at column added successfully!')
      console.log('Data:', data)
    }
    
    // Verificar que la columna se agregó
    console.log('\n🔍 Verifying column was added...')
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .select('id, name, updated_at')
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

addUpdatedAtColumn()

