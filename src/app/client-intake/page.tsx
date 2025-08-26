'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

interface ClientData {
  // Business Information
  businessName: string
  businessType: string
  industry: string
  ein: string
  yearEstablished: string
  
  // Contact Information
  contactPerson: string
  title: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  
  // Financial Information
  annualRevenue: string
  numberOfEmployees: string
  currentBookkeeper: string
  accountingSoftware: string
  bankAccounts: string
  
  // Services Needed
  servicesNeeded: string[]
  frequency: string
  startDate: string
  specialRequirements: string
  
  // Additional Information
  referralSource: string
  goals: string
  challenges: string
}

export default function ClientIntakePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  const [clientData, setClientData] = useState<ClientData>({
    businessName: '',
    businessType: '',
    industry: '',
    ein: '',
    yearEstablished: '',
    contactPerson: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    annualRevenue: '',
    numberOfEmployees: '',
    currentBookkeeper: '',
    accountingSoftware: '',
    bankAccounts: '',
    servicesNeeded: [],
    frequency: '',
    startDate: '',
    specialRequirements: '',
    referralSource: '',
    goals: '',
    challenges: ''
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof ClientData, value: string | string[]) => {
    setClientData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleServiceToggle = (service: string) => {
    setClientData(prev => ({
      ...prev,
      servicesNeeded: prev.servicesNeeded.includes(service)
        ? prev.servicesNeeded.filter(s => s !== service)
        : [...prev.servicesNeeded, service]
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/client-intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientData)
      })

      if (response.ok) {
        setIsComplete(true)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('There was an error submitting your information. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
            <p className="text-gray-600 mb-6">
              Your information has been submitted successfully. We'll review your details and contact you within 24 hours to discuss next steps.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>What's Next:</strong><br/>
                • We'll review your business needs<br/>
                • Schedule a consultation call<br/>
                • Create your custom service plan<br/>
                • Get you started within 5 business days
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Onboarding</h1>
          <p className="text-gray-600">Help us understand your business so we can provide the best service</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Step 1: Business Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Business Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      value={clientData.businessName}
                      onChange={(e) => handleInputChange('businessName', e.target.value)}
                      placeholder="Your Business LLC"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessType">Business Type *</Label>
                    <Select value={clientData.businessType} onValueChange={(value) => handleInputChange('businessType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LLC">LLC</SelectItem>
                        <SelectItem value="Corporation">Corporation</SelectItem>
                        <SelectItem value="S-Corp">S-Corporation</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="industry">Industry *</Label>
                    <Input
                      id="industry"
                      value={clientData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      placeholder="e.g., Consulting, Retail, Manufacturing"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="ein">EIN (Tax ID)</Label>
                    <Input
                      id="ein"
                      value={clientData.ein}
                      onChange={(e) => handleInputChange('ein', e.target.value)}
                      placeholder="XX-XXXXXXX"
                    />
                  </div>

                  <div>
                    <Label htmlFor="yearEstablished">Year Established</Label>
                    <Input
                      id="yearEstablished"
                      value={clientData.yearEstablished}
                      onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
                      placeholder="2020"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPerson">Primary Contact *</Label>
                    <Input
                      id="contactPerson"
                      value={clientData.contactPerson}
                      onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                      placeholder="John Smith"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={clientData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Owner, CEO, CFO"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={clientData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@business.com"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={clientData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      value={clientData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={clientData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="New York"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={clientData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="NY"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={clientData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Financial Information */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Financial Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annualRevenue">Annual Revenue</Label>
                    <Select value={clientData.annualRevenue} onValueChange={(value) => handleInputChange('annualRevenue', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under $100K">Under $100K</SelectItem>
                        <SelectItem value="$100K - $500K">$100K - $500K</SelectItem>
                        <SelectItem value="$500K - $1M">$500K - $1M</SelectItem>
                        <SelectItem value="$1M - $5M">$1M - $5M</SelectItem>
                        <SelectItem value="Over $5M">Over $5M</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                    <Select value={clientData.numberOfEmployees} onValueChange={(value) => handleInputChange('numberOfEmployees', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Just me">Just me</SelectItem>
                        <SelectItem value="2-5">2-5</SelectItem>
                        <SelectItem value="6-15">6-15</SelectItem>
                        <SelectItem value="16-50">16-50</SelectItem>
                        <SelectItem value="Over 50">Over 50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="currentBookkeeper">Current Bookkeeper/Accountant</Label>
                    <Input
                      id="currentBookkeeper"
                      value={clientData.currentBookkeeper}
                      onChange={(e) => handleInputChange('currentBookkeeper', e.target.value)}
                      placeholder="None, or current provider name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="accountingSoftware">Accounting Software</Label>
                    <Select value={clientData.accountingSoftware} onValueChange={(value) => handleInputChange('accountingSoftware', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select software" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="QuickBooks Online">QuickBooks Online</SelectItem>
                        <SelectItem value="QuickBooks Desktop">QuickBooks Desktop</SelectItem>
                        <SelectItem value="Xero">Xero</SelectItem>
                        <SelectItem value="FreshBooks">FreshBooks</SelectItem>
                        <SelectItem value="Excel">Excel/Spreadsheets</SelectItem>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="bankAccounts">Bank Accounts</Label>
                    <Textarea
                      id="bankAccounts"
                      value={clientData.bankAccounts}
                      onChange={(e) => handleInputChange('bankAccounts', e.target.value)}
                      placeholder="List your business bank accounts (e.g., Chase Business Checking, Wells Fargo Savings)"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Services Needed */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Services Needed</h3>
                </div>

                <div>
                  <Label>Select all services you need:</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {[
                      'Monthly Bank Reconciliation',
                      'Financial Statement Preparation',
                      'Accounts Payable Management',
                      'Accounts Receivable Management',
                      'Payroll Processing',
                      'Tax Preparation',
                      'Cash Flow Analysis',
                      'Budget Planning',
                      'QuickBooks Setup/Training',
                      'Financial Reporting',
                      'Expense Management',
                      'Invoice Management'
                    ].map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={service}
                          checked={clientData.servicesNeeded.includes(service)}
                          onChange={() => handleServiceToggle(service)}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={service} className="text-sm">{service}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <Label htmlFor="frequency">Service Frequency</Label>
                    <Select value={clientData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="How often?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="As needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="startDate">Preferred Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={clientData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="specialRequirements">Special Requirements</Label>
                  <Textarea
                    id="specialRequirements"
                    value={clientData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    placeholder="Any specific requirements or preferences we should know about?"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 5: Additional Information */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Final Details</h3>
                </div>

                <div>
                  <Label htmlFor="referralSource">How did you hear about us?</Label>
                  <Select value={clientData.referralSource} onValueChange={(value) => handleInputChange('referralSource', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Google Search">Google Search</SelectItem>
                      <SelectItem value="Referral">Referral from client/friend</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Professional Network">Professional Network</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goals">Business Goals</Label>
                  <Textarea
                    id="goals"
                    value={clientData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    placeholder="What are your main business goals for the next 12 months?"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="challenges">Current Challenges</Label>
                  <Textarea
                    id="challenges"
                    value={clientData.challenges}
                    onChange={(e) => handleInputChange('challenges', e.target.value)}
                    placeholder="What are your biggest bookkeeping/financial challenges right now?"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={nextStep}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
