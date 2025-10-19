const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xxpmgwnkrcltymnlbwog.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cG1nd25rcmNsdHltbmxid29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTE3ODcsImV4cCI6MjA3NjM4Nzc4N30.LqN9gLEluoe2Xs8InT-xTUI2E6iWFbrXUdZxbfsmnu4'

console.log('Using Supabase URL:', supabaseUrl)
console.log('Using Supabase Key:', supabaseKey.substring(0, 20) + '...')

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCategories() {
  try {
    console.log('🔍 Testing categories table...')
    
    // 1. Verificar que la tabla existe
    console.log('\n1. Checking if categories table exists...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'categories')
    
    if (tablesError) {
      console.error('Error checking tables:', tablesError)
    } else {
      console.log('Tables found:', tables)
    }
    
    // 2. Verificar la estructura de la tabla
    console.log('\n2. Checking categories table structure...')
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_schema', 'public')
      .eq('table_name', 'categories')
      .order('ordinal_position')
    
    if (columnsError) {
      console.error('Error checking columns:', columnsError)
    } else {
      console.log('Categories table columns:', columns)
    }
    
    // 3. Intentar leer datos existentes
    console.log('\n3. Reading existing categories...')
    const { data: existingCategories, error: readError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)
    
    if (readError) {
      console.error('Error reading categories:', readError)
    } else {
      console.log('Existing categories:', existingCategories)
    }
    
    // 4. Intentar insertar una categoría de prueba
    console.log('\n4. Testing category insertion...')
    const { v4: uuidv4 } = require('uuid')
    
    const testCategory = {
      id: uuidv4(),
      name: 'Test Category',
      description: 'Test Description',
      status: 'active'
    }
    
    console.log('Inserting test category:', testCategory)
    
    const { data: insertData, error: insertError } = await supabase
      .from('categories')
      .insert(testCategory)
      .select()
    
    if (insertError) {
      console.error('Error inserting test category:', insertError)
    } else {
      console.log('Successfully inserted test category:', insertData)
      
      // Limpiar la categoría de prueba
      if (insertData && insertData.length > 0) {
        const { error: deleteError } = await supabase
          .from('categories')
          .delete()
          .eq('id', insertData[0].id)
        
        if (deleteError) {
          console.error('Error cleaning up test category:', deleteError)
        } else {
          console.log('Test category cleaned up successfully')
        }
      }
    }
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

testCategories()
