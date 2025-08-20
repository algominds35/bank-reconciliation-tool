import sgMail from '@sendgrid/mail'

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export interface EmailTemplate {
  to: string
  from: string
  subject: string
  html: string
  text?: string
}

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

export class SendGridService {
  private static instance: SendGridService
  private isInitialized: boolean = false

  private constructor() {}

  public static getInstance(): SendGridService {
    if (!SendGridService.instance) {
      SendGridService.instance = new SendGridService()
    }
    return SendGridService.instance
  }

  public initialize(): void {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY environment variable is required')
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    this.isInitialized = true
  }

  public async sendEmail(template: EmailTemplate): Promise<boolean> {
    if (!this.isInitialized) {
      this.initialize()
    }

    try {
      await sgMail.send(template)
      console.log(`✅ Email sent successfully to ${template.to}`)
      return true
    } catch (error) {
      console.error(`❌ Failed to send email to ${template.to}:`, error)
      return false
    }
  }

  public async sendPaymentReminder(data: PaymentReminderData, phase: 'friendly' | 'reminder' | 'overdue' | 'final'): Promise<boolean> {
    const template = this.generatePaymentReminderTemplate(data, phase)
    return this.sendEmail(template)
  }

  private generatePaymentReminderTemplate(data: PaymentReminderData, phase: 'friendly' | 'reminder' | 'overdue' | 'final'): EmailTemplate {
    const { subject, html, text } = this.getPhaseContent(data, phase)
    
    return {
      to: data.clientEmail,
      from: data.companyEmail,
      subject,
      html,
      text
    }
  }

  private getPhaseContent(data: PaymentReminderData, phase: 'friendly' | 'reminder' | 'overdue' | 'final') {
    const { clientName, invoiceNumber, invoiceAmount, projectName, dueDate, daysOverdue, paymentLink, companyName } = data

    switch (phase) {
      case 'friendly':
        return {
          subject: `Invoice #${invoiceNumber} for ${projectName} - Payment Due Soon`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Hi ${clientName},</h2>
              <p>I hope the ${projectName} is working well for your team!</p>
              <p>I noticed the invoice for <strong>$${invoiceAmount}</strong> is coming due on <strong>${dueDate}</strong>.</p>
              <p>Since you've been such a great client to work with, I wanted to make sure you had everything you need.</p>
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Invoice Details:</h3>
                <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
                <p><strong>Project:</strong> ${projectName}</p>
                <p><strong>Amount:</strong> $${invoiceAmount}</p>
                <p><strong>Due Date:</strong> ${dueDate}</p>
              </div>
              <p>Here's a quick payment link if you'd like to take care of it now:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${paymentLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Pay Invoice Now</a>
              </div>
              <p>Let me know if you have any questions about the project or invoice!</p>
              <p>Best regards,<br>${companyName}</p>
            </div>
          `,
          text: `Hi ${clientName}, I hope the ${projectName} is working well for your team! I noticed the invoice for $${invoiceAmount} is coming due on ${dueDate}. Here's a quick payment link if you'd like to take care of it now: ${paymentLink} Let me know if you have any questions! Best regards, ${companyName}`
        }

      case 'reminder':
        return {
          subject: `Payment Reminder: Invoice #${invoiceNumber} Due in ${daysOverdue} Days`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">Payment Reminder</h2>
              <p>Hi ${clientName},</p>
              <p>This is a friendly reminder that invoice <strong>#${invoiceNumber}</strong> for <strong>$${invoiceAmount}</strong> is due in <strong>${daysOverdue} days</strong>.</p>
              <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; color: #dc2626;"><strong>Payment Due:</strong> ${dueDate}</p>
              </div>
              <p>To avoid any late fees, please arrange payment by the due date.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${paymentLink}" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Pay Invoice Now</a>
              </div>
              <p>If you have any questions or need to discuss payment arrangements, please don't hesitate to reach out.</p>
              <p>Thank you for your prompt attention to this matter.</p>
              <p>Best regards,<br>${companyName}</p>
            </div>
          `,
          text: `Payment Reminder: Hi ${clientName}, This is a friendly reminder that invoice #${invoiceNumber} for $${invoiceAmount} is due in ${daysOverdue} days. Payment due: ${dueDate}. To avoid late fees, please arrange payment by the due date: ${paymentLink} Thank you for your prompt attention. Best regards, ${companyName}`
        }

      case 'overdue':
        return {
          subject: `URGENT: Invoice #${invoiceNumber} is Overdue - Action Required`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626;">Invoice Overdue</h2>
              <p>Hi ${clientName},</p>
              <p>This is an important notice that invoice <strong>#${invoiceNumber}</strong> for <strong>$${invoiceAmount}</strong> is now <strong>${daysOverdue} days overdue</strong>.</p>
              <div style="background-color: #fef2f2; border: 2px solid #dc2626; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #dc2626; margin-top: 0;">Overdue Invoice Details:</h3>
                <p><strong>Invoice #:</strong> ${invoiceNumber}</p>
                <p><strong>Project:</strong> ${projectName}</p>
                <p><strong>Amount:</strong> $${invoiceAmount}</p>
                <p><strong>Due Date:</strong> ${dueDate}</p>
                <p><strong>Days Overdue:</strong> ${daysOverdue}</p>
              </div>
              <p><strong>Immediate action is required to avoid:</strong></p>
              <ul>
                <li>Late payment fees (1.5% per month)</li>
                <li>Service suspension</li>
                <li>Collection proceedings</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${paymentLink}" style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: bold;">PAY OVERDUE INVOICE NOW</a>
              </div>
              <p>If you're experiencing financial difficulties, please contact us immediately to discuss payment arrangements.</p>
              <p>This matter requires your immediate attention.</p>
              <p>Best regards,<br>${companyName}</p>
            </div>
          `,
          text: `URGENT: Invoice #${invoiceNumber} is Overdue - Hi ${clientName}, Invoice #${invoiceNumber} for $${invoiceAmount} is now ${daysOverdue} days overdue. Due date was ${dueDate}. Immediate action required to avoid late fees and service suspension. Pay now: ${paymentLink} Contact us immediately if you need payment arrangements. Best regards, ${companyName}`
        }

      case 'final':
        return {
          subject: `FINAL NOTICE: Invoice #${invoiceNumber} - Legal Action Imminent`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #dc2626; text-align: center;">FINAL NOTICE</h2>
              <p>Hi ${clientName},</p>
              <p>This is your <strong>FINAL NOTICE</strong> regarding invoice <strong>#${invoiceNumber}</strong> for <strong>$${invoiceAmount}</strong>.</p>
              <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                <h3 style="margin-top: 0;">CRITICAL: IMMEDIATE PAYMENT REQUIRED</h3>
                <p style="margin: 5px 0;"><strong>Invoice #:</strong> ${invoiceNumber}</p>
                <p style="margin: 5px 0;"><strong>Amount Due:</strong> $${invoiceAmount}</p>
                <p style="margin: 5px 0;"><strong>Days Overdue:</strong> ${daysOverdue}</p>
              </div>
              <p><strong>If payment is not received within 48 hours, we will:</strong></p>
              <ul>
                <li>Suspend all services immediately</li>
                <li>Apply maximum late fees</li>
                <li>Turn the account over to collections</li>
                <li>Pursue legal action if necessary</li>
              </ul>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${paymentLink}" style="background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px; font-weight: bold;">PAY IMMEDIATELY</a>
              </div>
              <p><strong>This is your final opportunity to resolve this matter before legal action.</strong></p>
              <p>If you have any questions, you must contact us within 24 hours.</p>
              <p>Best regards,<br>${companyName}</p>
            </div>
          `,
          text: `FINAL NOTICE: Invoice #${invoiceNumber} - Hi ${clientName}, This is your FINAL NOTICE. Invoice #${invoiceNumber} for $${invoiceAmount} is ${daysOverdue} days overdue. If payment is not received within 48 hours, we will suspend services and turn the account over to collections. This is your final opportunity to resolve this matter. Pay immediately: ${paymentLink} Contact us within 24 hours if you have questions. Best regards, ${companyName}`
        }

      default:
        throw new Error(`Unknown email phase: ${phase}`)
    }
  }

  public async sendBulkEmails(templates: EmailTemplate[]): Promise<{ success: number; failed: number }> {
    let success = 0
    let failed = 0

    for (const template of templates) {
      const result = await this.sendEmail(template)
      if (result) {
        success++
      } else {
        failed++
      }
    }

    return { success, failed }
  }

  public async validateEmail(email: string): Promise<boolean> {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
}

export default SendGridService
