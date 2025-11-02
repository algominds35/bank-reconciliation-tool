'use client'

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Do you have messy CSV files like this?",
      description: "Clients send multi-month CSVs with random columns and messy formatting. Hundreds of rows that are impossible to read.",
      image: "/images/Screenshot 2025-10-29 205827.png",
      label: "RAW MESSY CSV"
    },
    {
      number: 2,
      title: "We automatically parse and clean it",
      description: "Our smart parser extracts transactions from even the messiest formats. Everything organized in a clean table with red 'Unreconciled' badges instantly.",
      image: "/images/messy-statement.png",
      label: "CLEAN TABLE"
    },
    {
      number: 3,
      title: "Connect QuickBooks in one click",
      description: "One-click OAuth connection. Instantly sync all your QuickBooks accounts and 24 months of transactions.",
      image: "/images/qb-connected.png",
      label: "CONNECT QB"
    },
    {
      number: 4,
      title: "Detect duplicates automatically",
      description: "Yellow [DUPLICATE] badges flag potential duplicate transactions instantly. No more manual scanning. Export clean results and you're done.",
      image: "/images/duplicates-detected.png",
      label: "DETECT DUPLICATES"
    }
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From messy bank statements to clean reconciliation in 4 simple steps.
            Watch your reconciliation time drop from hours to minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-20">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Step Number Badge */}
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  {step.number}
                </div>
              </div>

              {/* Content */}
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  {step.description}
                </p>
              </div>

              {/* Screenshot */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden max-w-5xl mx-auto">
                {/* Browser Window Header */}
                <div className="flex items-center justify-between p-3 bg-gray-100 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">ReconcileBook Pro</span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                      step.number === 1 ? 'bg-red-100 text-red-700' :
                      step.number === 2 ? 'bg-blue-100 text-blue-700' :
                      step.number === 3 ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                </div>
                
                {/* Image */}
                <img 
                  src={step.image}
                  alt={step.title}
                  className="w-full h-auto"
                />
              </div>

              {/* Connector Line (except for last step) */}
              {index < steps.length - 1 && (
                <div className="flex justify-center mt-12">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Free Trial
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <p className="mt-4 text-gray-500">
            No credit card required • 14-day free trial
          </p>
        </div>
      </div>
    </section>
  )
}
