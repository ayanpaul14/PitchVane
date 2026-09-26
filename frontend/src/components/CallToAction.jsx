import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Lock, Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export function CallToAction({ onRequestAccess }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.includes('@')) {
      setSubscribed(true);
      if (onRequestAccess) onRequestAccess();
    }
  };

  return (
    <section className="bg-white dark:bg-[#050914]/90 border border-slate-200 dark:border-white/10 rounded-3xl p-8 md:p-12 text-center space-y-8 shadow-sm dark:shadow-2xl relative overflow-hidden backdrop-blur-xl" id="demo">
      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-indigo-500/10 dark:to-orange-500/10 pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-white/5 border border-indigo-200 dark:border-white/10 text-indigo-700 dark:text-cyan-300 font-mono text-xs uppercase tracking-wider backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
          Faster Deal Review
        </div>
        <h2 className="font-display-lg text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Accelerate Your Investment Decisions
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-light">
          Upload pitch decks, business plans, or financials to receive a comprehensive, 4-agent due diligence report in just 120 seconds.
        </p>
      </div>

      <div className="relative z-10 max-w-xl mx-auto">
        {subscribed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/40 rounded-2xl text-emerald-800 dark:text-emerald-300 font-mono text-sm font-bold flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            Priority access request received. Our team will reach out within 2 hours.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-50 dark:bg-black/60 border border-slate-300 dark:border-white/20 rounded-full px-5 py-3.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-cyan-400 flex-1 min-w-0 backdrop-blur-md transition-colors"
              placeholder="partner@fundname.vc"
            />
            <button
              type="submit"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-500 dark:to-orange-500 hover:opacity-90 text-white font-semibold text-xs uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Request Access</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>

      <div className="relative z-10 font-mono text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-4 flex-wrap">
        <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4" />
          SOC2 Type II Certified
        </span>
        <span className="text-cyan-600 dark:text-cyan-400 font-medium flex items-center gap-1.5">
          <Lock className="w-4 h-4" />
          Private Encrypted Storage
        </span>
        <span className="text-indigo-600 dark:text-orange-400 font-medium flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          Zero Data Leakage
        </span>
      </div>
    </section>
  );
}
