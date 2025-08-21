import sgMail from '@sendgrid/mail'

export interface PaymentReminderData {
  clientName: string
  clientEmail: string
  invoiceNumber: string
  invoiceAmount: string
  projectName: string
  dueDate: string
  daysOverdue?: number
  paymentLink: string
  companyName: string
  companyEmail: string
}

class SendGridService {
  private static instance: SendGridService
  private isInitialized = false

  private constructor() {}

  public static getInstance(): SendGridService {
    if (!SendGridService.instance) {
      SendGridService.instance = new SendGridService()
    }
    return SendGridService.instance
  }

  public initialize(): void {
    if (!this.isInitialized) {
      const apiKey = process.env.SENDGRID_API_KEY
      if (!apiKey) {
        throw new Error('SENDGRID_API_KEY environment variable is not set')
      }
      
      sgMail.setApiKey(apiKey)
      this.isInitialized = true
    }
  }

  public async sendPaymentReminder(
    data: PaymentReminderData,
    phase: 'friendly' | 'reminder' | 'overdue' | 'final'
  ): Promise<boolean> {
    try {
      this.initialize()

      const { subject, content } = this.getEmailTemplate(data, phase)
      
      const msg = {
        to: data.clientEmail,
        from: data.companyEmail,
        subject: subject,
        html: content,
        trackingSettings: {
          clickTracking: {
            enable: true,
            enableText: false
          },
          openTracking: {
            enable: true
          }
        }
      }

      await sgMail.send(msg)
      console.log(`✅ Payment reminder email sent to ${data.clientEmail}`)
      return true

    } catch (error) {
      console.error('❌ Failed to send payment reminder email:', error)
      return false
    }
  }

  private getEmailTemplate(
    data: PaymentReminderData,
    phase: 'friendly' | 'reminder' | 'overdue' | 'final'
  ): { subject: string; content: string } {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://reconcilebook.com'
    
    switch (phase) {
      case 'friendly':
        return {
          subject: `Friendly Reminder - Invoice #${data.invoiceNumber}`,
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Payment Reminder</h2>
              <p>Hi ${data.clientName},</p>
              <p>This is a friendly reminder that invoice <strong>#${data.invoiceNumber}</strong> for <strong>${data.invoiceAmount}</strong> is due on <strong>${data.dueDate}</strong>.</p>
              <p><strong>Project:</strong> ${data.projectName}</p>
              <p>Please let us know if you have any questions or need additional information.</p>
              <div style="margin: 30px 0;">
                <a href="${data.paymentLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Pay Invoice Now</a>
              </div>
              <p>Thank you for your business!</p>
              <p>Best regards,<br>${data.companyName}</p>
            </div>
          `
        }

      case 'reminder':
        return {
          subject: `Payment Reminder - Invoice #${data.invoiceNumber}`,
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">Payment Due</h2>
              <p>Hi ${data.clientName},</p>
              <p>Invoice <strong>#${data.invoiceNumber}</strong> for <strong>${data.invoiceAmount}</strong> was due on <strong>${data.dueDate}</strong>.</p>
              <p><strong>Project:</strong> ${data.projectName}</p>
              <p>Please process payment at your earliest convenience to avoid any late fees.</p>
              <div style="margin: 30px 0;">
                <a href="${data.paymentLink}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Pay Invoice Now</a>
              </div>
              <p>If you have any questions, please don't hesitate to contact us.</p>
              <p>Best regards,<br>${data.companyName}</p>
            </div>
          `
        }

      case 'overdue':
        return {
          subject: `URGENT: Invoice #${data.invoiceNumber} is ${data.daysOverdue} days overdue`,
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">Payment Overdue</h2>
              <p>Hi ${data.clientName},</p>
              <p>Invoice <strong>#${data.invoiceNumber}</strong> for <strong>${data.invoiceAmount}</strong> is now <strong>${data.daysOverdue} days overdue</strong>.</p>
              <p><strong>Project:</strong> ${data.projectName}</p>
              <p>Please process payment immediately to avoid any late fees or collection actions.</p>
              <div style="margin: 30px 0;">
                <a href="${data.paymentLink}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Pay Invoice Now</a>
              </div>
              <p>If you need to discuss payment arrangements, please contact us immediately.</p>
              <p>Best regards,<br>${data.companyName}</p>
            </div>
          `
        }

      case 'final':
        return {
          subject: `FINAL NOTICE: Invoice #${data.invoiceNumber} is ${data.daysOverdue} days overdue`,
          content: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">Final Notice</h2>
              <p>Hi ${data.clientName},</p>
              <p>This is our <strong>FINAL NOTICE</strong> regarding invoice <strong>#${data.invoiceNumber}</strong> for <strong>${data.invoiceAmount}</strong>, which is now <strong>${data.daysOverdue} days overdue</strong>.</p>
              <p><strong>Project:</strong> ${data.projectName}</p>
              <p>If payment is not received immediately, we will be forced to take further collection actions, which may include:</p>
              <ul>
                <li>Late fees and interest charges</li>
                <li>Collection agency involvement</li>
                <li>Legal action if necessary</li>
              </ul>
              <div style="margin: 30px 0;">
                <a href="${data.paymentLink}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Pay Invoice Now</a>
              </div>
              <p>Please contact us immediately if you need to discuss payment arrangements.</p>
              <p>Best regards,<br>${data.companyName}</p>
            </div>
          `
        }

      default:
        throw new Error(`Unknown email phase: ${phase}`)
    }
  }
}

export default SendGridService
