import React from 'react';
import { Layers, Cpu, Database, Compass, ArrowRight, CheckCircle2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export function ArchitecturePipeline() {
  return (
    <section id="architecture" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <div className="font-telemetry-sm text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> Parallel Swarm Architecture
          </div>
          <h2 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Step-by-Step Analysis Flow
          </h2>
        </div>
        <div className="text-xs font-mono text-indigo-700 dark:text-cyan-300 mt-2 md:mt-0 flex items-center space-x-2 bg-indigo-50 dark:bg-white/5 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse"></span>
          <span>Live Streaming Analysis Pipeline</span>
        </div>
      </div>

      {/* 3-Column Linear Flow Canvas with Dark/Light Support */}
      <div className="bg-white dark:bg-[#050914]/80 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 relative shadow-md dark:shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Glow gradients */}
        <div className="absolute -right-20 -top-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          {/* Step 01: Client Data Bus */}
          <motion.div
            whileHover={{ y: -2 }}
            className="md:col-span-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-md shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 mb-3">
                <span className="text-[12px] font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-700 dark:text-cyan-300">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  Step 01: Intake
                </span>
                <span className="font-mono text-[10px] bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                  READY
                </span>
              </div>
              <div className="space-y-2 text-[12px] font-mono text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Client:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">React 19 Vite</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Data Bus:</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400">Real-Time Stream</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payload:</span>
                  <span className="font-semibold text-slate-800 dark:text-white">Idea / Deck Text</span>
                </div>
              </div>
            </div>
            <div className="p-2.5 bg-slate-900 text-cyan-300 rounded-xl text-[11px] font-mono flex items-center space-x-2 border border-slate-800 dark:border-white/10">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#06b6d4]"></span>
              <span className="truncate">Initiating analysis stream...</span>
            </div>
          </motion.div>

          {/* Flow 1 Arrow */}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-cyan-600 dark:text-cyan-400 py-2 md:py-0">
            <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0 text-cyan-600 dark:text-cyan-400" />
            <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-500/30 px-1.5 py-0.5 rounded-full mt-1">
              live
            </span>
          </div>

          {/* Step 02: LangGraph Orchestrator */}
          <motion.div
            whileHover={{ y: -2 }}
            className="md:col-span-4 bg-slate-50 dark:bg-white/5 border border-indigo-200 dark:border-cyan-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-md shadow-sm relative"
          >
            <div className="absolute -top-3 left-4 bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-500 dark:to-orange-500 text-white text-[10px] font-mono font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
              Core Orchestrator
            </div>
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 mb-3 mt-1">
                <span className="text-[12px] font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-600 dark:text-orange-300">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  Step 02: AI Analysis Engine
                </span>
                <span className="font-mono text-[10px] bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span> PARALLEL
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-[11px] font-mono">
                <div className="bg-white dark:bg-white/5 p-2.5 rounded-xl border border-slate-200 dark:border-white/10">
                  <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <Database className="w-3 h-3" /> Knowledge Base
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] truncate">Private vector store</div>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold mt-1">Grounded Research</div>
                </div>
                <div className="bg-white dark:bg-white/5 p-2.5 rounded-xl border border-slate-200 dark:border-white/10">
                  <div className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                    <Compass className="w-3 h-3" /> Live Web Search
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 text-[10px] truncate">Real-time sources</div>
                  <div className="text-slate-800 dark:text-slate-200 font-semibold mt-1">Web Intelligence</div>
                </div>
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-white/10 pt-2 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500 dark:text-slate-400">Parallel Swarm:</span>
              <span className="text-indigo-700 dark:text-cyan-300 font-bold bg-indigo-50 dark:bg-cyan-950/60 border border-indigo-200 dark:border-cyan-500/30 px-2 py-0.5 rounded-full">
                4 Agents Active
              </span>
            </div>
          </motion.div>

          {/* Flow 2 Arrow */}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-indigo-600 dark:text-orange-400 py-2 md:py-0">
            <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0 text-indigo-600 dark:text-orange-400" />
            <span className="font-mono text-[10px] text-indigo-700 dark:text-orange-400 font-bold bg-indigo-50 dark:bg-orange-950/80 border border-indigo-200 dark:border-orange-500/30 px-1.5 py-0.5 rounded-full mt-1">
              sync
            </span>
          </div>

          {/* Step 03: Synthesizer Node */}
          <motion.div
            whileHover={{ y: -2 }}
            className="md:col-span-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4 backdrop-blur-md shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 mb-3">
                <span className="text-[12px] font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  Step 03: Synthesis
                </span>
                <span className="font-mono text-[10px] bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 font-bold px-2 py-0.5 rounded-full">
                  CONVERGED
                </span>
              </div>
              <div className="space-y-1.5 text-[12px] font-mono text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Contradiction Resolution
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Reconciled Conviction
                </div>
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Risk Assessment
                </div>
                <div className="text-indigo-600 dark:text-orange-400 font-bold pt-1 flex items-center gap-1">• 1-Click IC Memo</div>
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 px-3 py-2 rounded-xl text-center">
              <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                VERDICT: 8.6 / 10 HIGH CONVICTION
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
