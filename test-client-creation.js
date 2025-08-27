// Quick test to see what's wrong with client creation
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testClientCreation() {
  console.log('Testing client creation...')
  
  // Try creating a minimal client
  const testClient = {
    id: `test-${Date.now()}`,
    name: 'Test Client',
    user_id: 'demo-user'
  }
  
  console.log('Attempting to create:', testClient)
  
  const { data, error } = await supabase
    .from('clients')
    .insert(testClient)
    .select()
    .single()
  
  if (error) {
    console.error('❌ Error:', error)
  } else {
    console.log('✅ Success:', data)
  }
}

testClientCreation()
