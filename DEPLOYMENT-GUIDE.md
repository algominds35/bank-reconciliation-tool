# 🚀 **Deployment Guide: Standalone Invoice Tool**

## **Step 1: Set Up Supabase Database**

### **1.1 Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Choose your organization
6. Enter project name: `reconcilebook-invoices`
7. Enter database password (save this!)
8. Choose region closest to you
9. Click "Create new project"

### **1.2 Run Database Schema**
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire content from `standalone-invoice-schema.sql`
3. Click **Run** to execute all the SQL commands
4. Verify tables are created in **Table Editor**

### **1.3 Get Database Credentials**
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefghijklmnop.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

---

## **Step 2: Set Up SendGrid (Email Automation)**

### **2.1 Create SendGrid Account**
1. Go to [sendgrid.com](https://sendgrid.com)
2. Sign up for free account (100 emails/day free)
3. Verify your email address
4. Go to **Settings** → **API Keys**
5. Create new API key with "Mail Send" permissions
6. Copy the API key

### **2.2 Verify Sender Email**
1. Go to **Settings** → **Sender Authentication**
2. Click "Verify a Single Sender"
3. Enter your business email (e.g., `noreply@yourcompany.com`)
4. Click verification link in email

---

## **Step 3: Deploy to Vercel**

### **3.1 Push to GitHub**
```bash
# In your project directory
git add .
git commit -m "Add standalone invoice system without QuickBooks"
git push origin main
```

### **3.2 Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **New Project**
4. Import your GitHub repository
5. Click **Deploy**

### **3.3 Set Environment Variables**
1. In your Vercel project dashboard, go to **Settings** → **Environment Variables**
2. Add these variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@yourcompany.com

# App Configuration
COMPANY_NAME=Your Company Name
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### **3.4 Redeploy**
1. Go to **Deployments** tab
2. Click **Redeploy** on your latest deployment
3. Wait for deployment to complete

---

## **Step 4: Test Your System**

### **4.1 Test Invoice Creation**
1. Visit: `https://your-domain.vercel.app/invoices`
2. Click "Create Invoice"
3. Fill out the form with test data
4. Submit and verify invoice appears in list

### **4.2 Test CSV Import**
1. Create a CSV file with this format:
```csv
client_name,client_email,invoice_number,amount,due_date,description
John Doe,john@example.com,INV-001,500.00,2024-02-15,Web Design
Jane Smith,jane@example.com,INV-002,750.00,2024-02-20,Logo Design
```

2. Upload the CSV file
3. Verify invoices are imported

### **4.3 Test Collections Automation**
1. Create an overdue invoice (set due date to yesterday)
2. Call the API: `POST /api/collections/automate`
3. Check SendGrid logs for email delivery

---

## **Step 5: Set Up Automated Collections**

### **5.1 Create Cron Job (Optional)**
1. Go to **Vercel Dashboard** → **Functions**
2. Create a new function for automated collections
3. Set up cron trigger to run daily

### **5.2 Test Email Templates**
1. Send test emails through the API
2. Verify email formatting and delivery
3. Check spam folder if needed

---

## **Troubleshooting**

### **Database Connection Issues**
- Verify Supabase URL and keys are correct
- Check if tables exist in Supabase dashboard
- Ensure service role key has proper permissions

### **Email Not Sending**
- Verify SendGrid API key is correct
- Check sender email is verified
- Look at SendGrid activity logs

### **Build Errors**
- Check all dependencies are installed
- Verify TypeScript types are correct
- Check Vercel build logs for specific errors

---

## **Next Steps**

### **1. Customize Email Templates**
- Edit email content in `src/lib/sendgrid.ts`
- Update company branding and colors
- Add your logo and contact information

### **2. Set Up Payment Processing**
- Integrate Stripe for payment links
- Create payment success/failure pages
- Set up webhook handling

### **3. Add User Authentication**
- Implement Supabase Auth
- Create user registration/login
- Add user-specific data isolation

### **4. Launch Marketing**
- Update landing page copy
- Add pricing plans
- Set up analytics tracking

---

## **Support**

If you encounter issues:
1. Check Vercel function logs
2. Verify environment variables
3. Test database connection
4. Check SendGrid delivery status

**Your standalone invoice tool is now ready to scale to millions of dollars! 🚀**
