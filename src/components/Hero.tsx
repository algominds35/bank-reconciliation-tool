'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Star, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
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
              <TrendingUp className="h-4 w-4" />
              Revolutionize Your Workflow Now
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              AI-Powered{' '}
              <span className="text-[#F45B49]">Bank Reconciliation</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl text-slate-600 mb-8 leading-relaxed"
            >
              Stop wasting hours on manual reconciliation. Our AI matches transactions instantly, 
              generates professional reports, and handles your entire bookkeeping workflow automatically.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <Link
                href="/auth/signup"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#F45B49] text-white font-semibold rounded-full hover:bg-[#E24C3A] transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Free Trial
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center justify-center px-8 py-4 text-slate-700 font-semibold rounded-full border border-slate-300 hover:border-slate-400 transition-all duration-200 group"
              >
                <Play className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                Watch Demo
              </Link>
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
          </motion.div>

          {/* Right Column - Video Player */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10">
              {/* Video Player Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden"
              >
                                                                      {/* Video Container */}
                <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200">
                                     {/* YouTube Video Embed */}
                                                           <iframe
                      className="absolute inset-0 w-full h-full rounded-t-2xl"
                      src="https://www.youtube.com/embed/_K9NET1njog?autoplay=0&modestbranding=1&rel=0&showinfo=0&controls=1"
                      title="AI-Powered Bank Reconciliation Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  
                  {/* Play Button Overlay - Removed since YouTube controls are enabled */}
                  
                  {/* Duration Badge - Removed to show real YouTube duration */}
                </div>
                
                {/* Video Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">AI-Powered Reconciliation Demo</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                      HD Quality
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">
                    Watch our AI match transactions in real-time and generate professional reports automatically.
                  </p>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>26 transactions processed</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-[#F45B49] rounded-full"></div>
                      <span>Live Demo</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4"
                >
                  <div className="text-2xl font-bold text-slate-900">1,234</div>
                  <div className="text-sm text-slate-500">Transactions</div>
                  <div className="mt-2 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4"
                >
                  <div className="text-2xl font-bold text-slate-900">98%</div>
                  <div className="text-sm text-slate-500">Match Rate</div>
                  <div className="mt-2 w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-[#F45B49] rounded-full"></div>
                  </div>
                </motion.div>
              </div>

              {/* Client Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-4 mt-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F45B49] rounded-full flex items-center justify-center text-white font-semibold">
                    JD
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">John's Bakery LLC</div>
                    <div className="text-sm text-slate-500">Monthly reconciliation ready</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                    <div className="w-8 h-8 bg-slate-100 rounded-full -ml-2"></div>
                    <span className="text-xs text-slate-500 ml-1">+3</span>
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