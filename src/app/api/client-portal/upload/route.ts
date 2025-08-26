import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import SendGridService from '@/lib/sendgrid'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const clientEmail = formData.get('clientEmail') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Store file metadata in database
    const { data: upload, error: dbError } = await supabase
      .from('client_uploads')
      .insert([{
        client_email: clientEmail,
        filename: file.name,
        file_size: file.size,
        file_type: file.type,
        category: category,
        upload_date: new Date().toISOString(),
        status: 'completed'
      }])
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue even if database fails
    }

    // Notify Jimmie about new upload
    await notifyBookkeeperOfUpload(clientEmail, file.name, category)

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      uploadId: upload?.id
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    )
  }
}

async function notifyBookkeeperOfUpload(clientEmail: string, filename: string, category: string) {
  try {
    const sendGrid = SendGridService.getInstance()
    
    await sendGrid.sendEmail({
      to: 'jimmie@j2bookkeeping.com',
      subject: `📄 New Document Upload from ${clientEmail}`,
      html: `
        <h2>New Document Upload</h2>
        <p><strong>Client:</strong> ${clientEmail}</p>
        <p><strong>File:</strong> ${filename}</p>
        <p><strong>Category:</strong> ${category}</p>
        <p><strong>Upload Time:</strong> ${new Date().toLocaleString()}</p>
        
        <p>The client has uploaded a new document to their secure portal. Please review and process as needed.</p>
        
        <p>Best regards,<br/>ReconcileBook System</p>
      `,
      text: `
New Document Upload

Client: ${clientEmail}
File: ${filename}
Category: ${category}
Upload Time: ${new Date().toLocaleString()}

The client has uploaded a new document to their secure portal. Please review and process as needed.

Best regards,
ReconcileBook System
      `
    })
  } catch (error) {
    console.error('Failed to notify bookkeeper:', error)
  }
}
