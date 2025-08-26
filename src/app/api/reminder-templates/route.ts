import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data: templates, error } = await supabase
      .from('reminder_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      templates: templates || []
    })

  } catch (error) {
    console.error('Error fetching reminder templates:', error)
    
    // NO MORE DEFAULT TEMPLATES - DATABASE SHOULD HAVE THEM
    // If database fails, return empty array instead of fallback
    return NextResponse.json({
      success: true,
      templates: []
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const template = await request.json()

    const { data, error } = await supabase
      .from('reminder_templates')
      .upsert([{
        id: template.id,
        name: template.name,
        subject: template.subject,
        message: template.message,
        trigger_type: template.triggerType,
        trigger_value: template.triggerValue,
        is_active: template.isActive,
        category: template.category,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      template: data
    })

  } catch (error) {
    console.error('Error saving reminder template:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save template' },
      { status: 500 }
    )
  }
}
