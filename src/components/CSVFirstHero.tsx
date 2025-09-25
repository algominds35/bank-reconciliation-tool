'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Star, Upload, FileText, Clock, CheckCircle } from 'lucide-react';

export default function CSVFirstHero() {
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

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-slate-600 mb-8 leading-relaxed"
            >
              ReconcileBook uploads your bank-statement CSV, auto-matches transactions, flags duplicates, and cleans errors instantly — so your books are accurate without the manual grind.
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
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#F45B49] text-[#F45B49]" />
                <span className="font-semibold text-slate-900">4.9/5</span>
              </div>
              <span>stars from 500+ bookkeepers</span>
            </motion.div>

                   {/* Demo Video Section */}
          </motion.div>

          {/* Right Column - CSV Upload */}
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
                      src="https://www.youtube.com/embed/i0qS1_wyBWI?si=HrvgH2-2aaZYMmS3"
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
    </section>
  );
}
