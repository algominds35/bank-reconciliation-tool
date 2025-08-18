"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle, 
  Zap, 
  Shield, 
  BarChart3, 
  Users, 
  Clock,
  ArrowRight,
  Star,
  Play,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-neutral-600" />,
    title: "AI-Powered Matching",
    description: "Automatically match bank transactions with QuickBooks data using advanced machine learning algorithms."
  },
  {
    icon: <Shield className="w-6 h-6 text-neutral-600" />,
    title: "Bank-Level Security",
    description: "Enterprise-grade encryption with SOC 2 compliance. Your financial data is protected with military-grade security."
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-neutral-600" />,
    title: "Real-Time Analytics",
    description: "Live dashboards showing reconciliation status, cash flow insights, and financial health metrics."
  },
  {
    icon: <Users className="w-6 h-6 text-neutral-600" />,
    title: "Multi-Client Management",
    description: "Handle unlimited clients from one dashboard. Perfect for bookkeepers and accounting firms."
  },
  {
    icon: <Clock className="w-6 h-6 text-neutral-600" />,
    title: "Automated Workflows",
    description: "Set up rules and automation to handle recurring transactions. Never miss a reconciliation again."
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-neutral-600" />,
    title: "QuickBooks Native",
    description: "Seamless integration with QuickBooks Online. Sync invoices, transactions, and accounts automatically."
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "CFO",
    company: "TechFlow Solutions",
    content: "This tool saved us 15 hours per month on bank reconciliation. The AI matching is incredibly accurate.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Managing Partner",
    company: "Rodriguez & Associates",
    content: "We handle 50+ clients and this tool has revolutionized our workflow. The multi-client dashboard is a game-changer.",
    rating: 5
  },
  {
    name: "Jennifer Walsh",
    role: "Finance Director",
    company: "GreenLeaf Retail",
    content: "Finally, a reconciliation tool that actually works with QuickBooks. We've eliminated 90% of our manual work.",
    rating: 5
  }
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for small businesses getting started with automation",
    features: [
      "Up to 1,000 transactions/month",
      "Basic AI matching",
      "QuickBooks integration",
      "Email support",
      "Standard reports"
    ],
    popular: false
  },
  {
    name: "Pro",
    price: "$99",
    period: "/month",
    description: "Ideal for growing businesses and bookkeepers",
    features: [
      "Up to 10,000 transactions/month",
      "Advanced AI matching",
      "Multi-account support",
      "Priority support",
      "Advanced analytics",
      "Custom rules & automation"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with complex needs",
    features: [
      "Unlimited transactions",
      "Custom AI models",
      "White-label solution",
      "Dedicated account manager",
      "API access",
      "Custom integrations",
      "On-premise deployment"
    ],
    popular: false
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">QB</span>
              </div>
              <span className="ml-3 text-xl font-semibold text-neutral-900">ReconcilePro</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">Features</a>
              <a href="#pricing" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">Pricing</a>
              <a href="#testimonials" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">Reviews</a>
              <a href="#demo" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm font-medium">Demo</a>
            </nav>

            {/* CTA Button */}
            <Button className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              Start Free Trial
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-3 py-1.5 bg-neutral-100 text-neutral-700 rounded-full text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Financial Automation
            </motion.div>

            <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-8 tracking-tight">
              Bank Reconciliation
              <span className="block bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                That Actually Works
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-neutral-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Automate your bank reconciliation with AI-powered matching. 
              Reconcile months of transactions in minutes, not hours. 
              Seamlessly integrated with QuickBooks Online.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button className="bg-neutral-900 hover:bg-neutral-800 text-white px-8 py-4 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="border-2 border-neutral-200 text-neutral-700 px-8 py-4 text-lg rounded-lg hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-200 font-medium">
                <Play className="mr-2 w-5 h-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="pt-8 border-t border-neutral-200">
              <p className="text-neutral-500 text-sm font-medium mb-6">TRUSTED BY LEADING COMPANIES</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="text-lg font-medium text-neutral-400">TechFlow Solutions</div>
                <div className="text-lg font-medium text-neutral-400">Rodriguez & Associates</div>
                <div className="text-lg font-medium text-neutral-400">GreenLeaf Retail</div>
                <div className="text-lg font-medium text-neutral-400">InnovateCorp</div>
                <div className="text-lg font-medium text-neutral-400">Peak Financial</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              Everything You Need to
              <span className="block bg-gradient-to-r from-neutral-900 to-neutral-600 bg-clip-text text-transparent">
                Automate Reconciliation
              </span>
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Powerful features designed for modern businesses that need accuracy, speed, and reliability in their financial operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-xl">
                  <CardHeader className="pb-4">
                    <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-semibold text-neutral-900">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id="demo" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              See It In Action
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Watch how ReconcilePro transforms hours of manual work into minutes of automated reconciliation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-12 text-center text-white">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                  Demo Video Coming Soon
                </h3>
                <p className="text-lg mb-8 opacity-90 leading-relaxed">
                  We're preparing an in-depth demo showing the complete reconciliation workflow from start to finish.
                </p>
                <Button className="bg-white text-neutral-900 hover:bg-neutral-100 px-8 py-3 text-lg rounded-lg font-medium transition-all duration-200">
                  Get Early Access
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              What Our Customers Say
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Join thousands of businesses that have transformed their reconciliation process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-0 shadow-sm bg-white rounded-xl">
                  <CardContent className="p-8">
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-neutral-700 mb-8 leading-relaxed text-sm">
                      "{testimonial.content}"
                    </p>
                    <div>
                      <p className="font-semibold text-neutral-900">{testimonial.name}</p>
                      <p className="text-sm text-neutral-600">{testimonial.role}</p>
                      <p className="text-sm text-neutral-500">{testimonial.company}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Choose the plan that fits your business needs. All plans include our core features and 14-day free trial.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-neutral-900 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card className={`h-full border ${
                  plan.popular 
                    ? 'border-neutral-900 shadow-lg' 
                    : 'border-neutral-200 shadow-sm'
                } transition-all duration-300 bg-white rounded-xl`}>
                  <CardHeader className="text-center pb-6">
                    <CardTitle className="text-2xl font-semibold text-neutral-900 mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-neutral-900">{plan.price}</span>
                      <span className="text-neutral-600">{plan.period}</span>
                    </div>
                    <p className="text-neutral-600 text-sm">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-neutral-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full py-3 rounded-lg font-medium ${
                        plan.popular
                          ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
                      }`}
                    >
                      {plan.popular ? 'Start Free Trial' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 tracking-tight">
              Ready to Transform Your Reconciliation?
            </h2>
            <p className="text-xl text-neutral-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Join thousands of businesses saving hours every month on bank reconciliation. 
              Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-neutral-900 hover:bg-neutral-100 px-8 py-4 text-lg rounded-lg shadow-lg font-medium transition-all duration-200">
                Start Free Trial
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-neutral-900 px-8 py-4 text-lg rounded-lg font-medium transition-all duration-200">
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-neutral-900 to-neutral-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">QB</span>
                </div>
                <span className="ml-3 text-xl font-semibold text-neutral-900">ReconcilePro</span>
              </div>
              <p className="text-neutral-600 mb-4 text-sm leading-relaxed">
                The most powerful bank reconciliation tool for modern businesses.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-neutral-900">Product</h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">API</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-neutral-900">Support</h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-neutral-900">Company</h3>
              <ul className="space-y-2 text-neutral-600 text-sm">
                <li><a href="#" className="hover:text-neutral-900 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-neutral-900 transition-colors">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-600 text-sm">
              © 2024 ReconcilePro. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 