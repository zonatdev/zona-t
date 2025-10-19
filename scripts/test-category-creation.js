const { createClient } = require('@supabase/supabase-js')
const { v4: uuidv4 } = require('uuid')

const supabaseUrl = 'https://xxpmgwnkrcltymnlbwog.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4cG1nd25rcmNsdHltbmxid29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTE3ODcsImV4cCI6MjA3NjM4Nzc4N30.LqN9gLEluoe2Xs8InT-xTUI2E6iWFbrXUdZxbfsmnu4'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testCategoryCreation() {
  try {
    console.log('🧪 Testing category creation...')
    
    const testCategory = {
      id: uuidv4(),
      name: 'Test Category from Script',
      description: 'Test Description from Script',
      status: 'active'
    }
    
    console.log('📝 Inserting category:', testCategory)
    
    const { data, error } = await supabase
      .from('categories')
      .insert(testCategory)
      .select()
    
    console.log('📊 Response data:', data)
    console.log('❌ Response error:', error)
    console.log('🔍 Error type:', typeof error)
    console.log('🔍 Error is null?', error === null)
    console.log('🔍 Error is undefined?', error === undefined)
    
    if (error) {
      console.error('❌ Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        fullError: error
      })
    } else {
      console.log('✅ Category created successfully!')
      console.log('📋 Created category:', data[0])
      
      // Limpiar la categoría de prueba
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', data[0].id)
      
      if (deleteError) {
        console.error('❌ Error cleaning up:', deleteError)
      } else {
        console.log('🧹 Test category cleaned up successfully')
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error)
  }
}

testCategoryCreation()

