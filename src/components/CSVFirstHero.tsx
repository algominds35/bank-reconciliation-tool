'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Star, Upload, FileText, Clock, CheckCircle, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CSVFirstHero() {
  const router = useRouter();

  const handleBetaSignup = () => {
    console.log('Beta signup clicked!');
    router.push('/auth/signup?beta=true');
  };

  return (
    <section className="relative pt-32 pb-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:pr-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#F45B49]/10 border border-[#F45B49]/20 rounded-full text-sm font-medium text-[#F45B49] mb-6"
            >
              <Upload className="h-4 w-4" />
              Instant Reconciliation
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Turn hours of{' '}
              <span className="text-[#F45B49]">reconciliation</span>
              <br />
              into{' '}
              <span className="text-[#F45B49]">seconds</span>
            </motion.h1>

            {/* Target Audience */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-slate-700 mb-4 leading-relaxed font-medium"
            >
              Built for bookkeepers handling client onboarding, cleanup work, and delegated reconciliation.
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="text-xl text-slate-600 mb-8 leading-relaxed"
            >
              Upload CSV or PDF bank statements or connect QuickBooks. Automatically match transactions, find missing entries, flag duplicates, and generate a clean reconciliation ready for posting.
            </motion.p>

            {/* Value Props */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Instant Results</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FileText className="h-4 w-4 text-blue-500" />
                <span>Your Real Data</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="h-4 w-4 text-purple-500" />
                <span>Save Hours</span>
              </div>
            </motion.div>

            {/* Rating */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex items-center gap-2 text-sm text-slate-600 mb-8"
            >
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#F45B49] text-[#F45B49]" />
                <span className="font-semibold text-slate-900">4.9/5</span>
              </div>
              <span>stars from 500+ bookkeepers</span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {/* Beta Signup Button */}
              <button
                onClick={handleBetaSignup}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-[#F45B49] to-[#E63946] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Users className="w-5 h-5 mr-2" />
                Join Beta Testing
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                  FREE
                </span>
              </button>

              {/* Try for Free Button */}
              <button
                onClick={handleBetaSignup}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-[#F45B49] bg-white border-2 border-[#F45B49] rounded-xl hover:bg-[#F45B49] hover:text-white transition-all duration-300"
              >
                <Upload className="w-5 h-5 mr-2" />
                Try for Free
              </button>
            </motion.div>

            {/* Beta Program Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Beta Testing Program</h3>
                  <p className="text-sm text-slate-600 mb-2">
                    Help shape the future of reconciliation! Get early access to new features and influence product development.
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">Free Access</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Early Features</span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Direct Feedback</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column - Demo Video */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10">
              {/* YouTube Demo Video */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      See How It Works
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Watch how transactions are matched and duplicates are flagged in real time.
                    </p>
                  </div>
                  
                  {/* YouTube Video Embed */}
                  <div className="relative w-full h-64 bg-slate-100 rounded-xl overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/DYNIy7zt36Q?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0"
                      title="ReconcileBook Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-xs text-slate-500">
                      2:08 min demo • Updated Today
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4"
                >
                  <div className="text-2xl font-bold text-slate-900">8 hrs/month saved</div>
                  <div className="text-sm text-slate-500">Automates reconciliation that normally eats a whole workday.</div>
                  <div className="mt-2 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-4/5 h-full bg-green-500 rounded-full"></div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4"
                >
                  <div className="text-2xl font-bold text-slate-900">Reconcile years of transactions</div>
                  <div className="text-sm text-slate-500">Catch up on months/years of backlogged books in minutes.</div>
                  <div className="mt-2 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-[99%] h-full bg-blue-600 rounded-full"></div>
                  </div>
                </motion.div>
              </div>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-6 mt-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F45B49] rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                    MA
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="font-semibold text-slate-900">Miller & Associates CPA</div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[#F45B49] text-[#F45B49]" />
                        <Star className="h-4 w-4 fill-[#F45B49] text-[#F45B49]" />
                        <Star className="h-4 w-4 fill-[#F45B49] text-[#F45B49]" />
                        <Star className="h-4 w-4 fill-[#F45B49] text-[#F45B49]" />
                        <Star className="h-4 w-4 fill-[#F45B49] text-[#F45B49]" />
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      "I uploaded my messy CSV and it found 23 duplicates I completely missed. This tool literally saved me 4 hours of weekend work."
                    </p>
                    <div className="text-xs text-slate-500">
                      Senior Accountant • 50+ clients managed
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Background Gradient */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-20 right-20 w-72 h-72 bg-[#F45B49]/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Simple Security Badges */}
      <div className="bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h3 className="text-lg font-semibold text-slate-900 mb-6">
              Your financial data is always safe
            </h3>
            
            <div className="flex flex-wrap justify-center items-center gap-6">
              <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-700">256-bit SSL Encryption</span>
                </div>
              </div>
              
              <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-700">Secure Cloud Storage</span>
                </div>
              </div>
              
              <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <span className="text-sm font-medium text-slate-700">Private & Secure</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
