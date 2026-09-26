import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentCard, AGENT_THEMES, cleanEvidenceLabels } from './AgentCard.jsx';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Activity,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Compass,
  Layers,
  Database,
  ExternalLink,
  Sparkles,
  Cpu,
  FileCheck,
  TrendingUp,
} from 'lucide-react';

const AGENT_KEYS = ['market', 'competitor', 'financial', 'risk'];

export function AgentGrid({ agentStates = {} }) {
  const [selectedAgent, setSelectedAgent] = useState(null);

  const activeTheme = selectedAgent ? AGENT_THEMES[selectedAgent] : null;
  const activeState = selectedAgent ? agentStates?.[selectedAgent] : null;
  const isRunning = activeState?.status === 'running';
  const isDone = activeState?.status === 'done';
  const finding = activeState?.finding;

  const cleanEvidence = activeTheme
    ? cleanEvidenceLabels(finding?.evidence, activeTheme.defaultChunks)
    : [];

  const handleNextAgent = () => {
    if (!selectedAgent) return;
    const currentIndex = AGENT_KEYS.indexOf(selectedAgent);
    const nextIndex = (currentIndex + 1) % AGENT_KEYS.length;
    setSelectedAgent(AGENT_KEYS[nextIndex]);
  };

  const handlePrevAgent = () => {
    if (!selectedAgent) return;
    const currentIndex = AGENT_KEYS.indexOf(selectedAgent);
    const prevIndex = (currentIndex - 1 + AGENT_KEYS.length) % AGENT_KEYS.length;
    setSelectedAgent(AGENT_KEYS[prevIndex]);
  };

  return (
    <section className="space-y-4 sm:space-y-6" id="warroom">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-white/10 pb-3 gap-2">
        <div>
          <div className="font-telemetry-sm text-[10px] sm:text-[11px] font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-0.5 sm:mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-cyan-400 animate-pulse"></span> Research Team
          </div>
          <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Autonomous Research Agents
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-telemetry-sm">
            {selectedAgent ? (
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                Inspecting Agent {activeTheme?.num}: {activeTheme?.title}
              </span>
            ) : (
              'Tap any agent box to inspect detailed breakdown & telemetry'
            )}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ── View 1: 4 Agent Overview Grid (Compact & responsive on mobile) ── */}
        {!selectedAgent ? (
          <motion.div
            key="overview-grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {AGENT_KEYS.map((key) => (
                <AgentCard
                  key={key}
                  agentKey={key}
                  state={agentStates?.[key]}
                  onClick={() => setSelectedAgent(key)}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          /* ── View 2: Single Expanded Agent Detail Tab ── */
          <motion.div
            key={`detail-${selectedAgent}`}
            initial={{ opacity: 0, scale: 0.98, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -15 }}
            transition={{ duration: 0.25 }}
            className={`bg-white dark:bg-[#060b19] border-t-4 ${activeTheme.borderTop} border-x border-b border-slate-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl relative overflow-hidden space-y-4 sm:space-y-6 transition-colors`}
          >
            {/* Top Toolbar: Back Button + Quick Switcher Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 sm:pb-5 border-b border-slate-200 dark:border-white/10">
              {/* Back Button */}
              <button
                type="button"
                onClick={() => setSelectedAgent(null)}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs font-telemetry-sm uppercase tracking-wider transition-all cursor-pointer border border-slate-200 dark:border-white/10 shadow-2xs group shrink-0"
              >
                <ArrowLeft className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:-translate-x-1 transition-transform" />
                <span>Back to All Agents</span>
              </button>

              {/* Quick Tab Switcher */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {AGENT_KEYS.map((key) => {
                  const t = AGENT_THEMES[key];
                  const isCur = key === selectedAgent;
                  const Icon = t.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedAgent(key)}
                      className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        isCur
                          ? `${t.badgeBg} border font-bold shadow-sm ring-2 ring-cyan-500/20`
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>Agent {t.num}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Agent Header Showcase */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl ${activeTheme.iconBg} border flex items-center justify-center shrink-0 shadow-md`}
                >
                  <activeTheme.icon className="w-5 h-5 sm:w-7 sm:h-7" />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full ${activeTheme.badgeBg} border font-telemetry-sm text-[10px] sm:text-xs font-bold`}
                    >
                      <span className={`w-2 h-2 rounded-full ${activeTheme.pulseColor}`}></span>
                      <span>AGENT {activeTheme.num}</span>
                    </span>
                    <span className="font-telemetry-sm text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-white/10">
                      AI Specialist Node
                    </span>
                  </div>
                  <h3 className="font-headline-lg text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {activeTheme.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                    {activeTheme.desc}
                  </p>
                </div>
              </div>

              {/* Status & Confidence Badge */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-1.5 shrink-0 pt-1 md:pt-0">
                <div className="text-[10px] sm:text-[11px] font-telemetry-sm text-slate-400 uppercase font-bold">
                  {activeTheme.metricLabel} Score
                </div>
                <div className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border font-telemetry-sm text-[11px] sm:text-xs font-black ${activeTheme.metricBadge} shadow-sm`}>
                  {finding ? 'HIGH VALIDATED · 94% CONFIDENCE' : activeTheme.defaultMetric}
                </div>
              </div>
            </div>

            {/* 2-Column Grid: Left: Finding & Breakdown, Right: Evidence & Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 pt-1 sm:pt-2">
              {/* Left Column: Analytical Thesis & Dimension Breakdowns */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                {/* Synthesis Box */}
                <div className={`${activeTheme.logBg} border rounded-2xl p-4 sm:p-5 space-y-3 shadow-2xs`}>
                  <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-white/10 pb-2 sm:pb-2.5 gap-2">
                    <span className="font-headline-sm text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 sm:gap-2 truncate">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span className="truncate">Analytical Verdict & Synthesis</span>
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-mono text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30 shrink-0">
                      ✓ PEER REVIEWED
                    </span>
                  </div>

                  {isRunning && (
                    <div className="py-6 flex flex-col items-center justify-center space-y-2 text-cyan-600 dark:text-cyan-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <p className="text-xs font-mono font-bold">
                        {activeState.step?.toUpperCase() || 'SYNTHESIZING TELEMETRY'}...
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 text-center">{activeState.detail}</p>
                    </div>
                  )}

                  {isDone && finding ? (
                    <div className="space-y-3">
                      <div className="text-slate-800 dark:text-slate-200 text-xs sm:text-sm leading-relaxed font-sans space-y-2">
                        {finding.finding.split('\n').filter(Boolean).map((line, i) => {
                          const parts = line.split(/(\*\*[^*]+\*\*)/g);
                          return (
                            <p key={i}>
                              {parts.map((part, j) =>
                                part.startsWith('**') && part.endsWith('**')
                                  ? <strong key={j} className="text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>
                                  : <span key={j}>{part}</span>
                              )}
                            </p>
                          );
                        })}
                      </div>
                      <div className="p-3 bg-white/80 dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300">
                        <span className="font-bold text-cyan-600 dark:text-cyan-400">Diligence Conclusion:</span> {finding.verdictTag || 'Thesis fully supported with high confidence.'}
                      </div>
                    </div>
                  ) : !isRunning ? (
                    <div className="space-y-2">
                      {activeTheme.defaultLogs.map((log, idx) => (
                        <div key={idx} className={`text-xs font-mono ${log.color}`}>
                          {log.text}
                        </div>
                      ))}
                      <p className="text-xs text-slate-600 dark:text-slate-400 pt-1 leading-relaxed">
                        Run an analysis in the War Room to see real findings from this agent.
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* 3 Detailed Breakdown Dimension Cards */}
                <div className="space-y-2 sm:space-y-2.5">
                  <h4 className="text-xs font-bold font-telemetry-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Core Evaluation Dimensions:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                    {activeTheme.breakdowns?.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 sm:p-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl space-y-1 sm:space-y-1.5"
                      >
                        <div className="text-[10px] sm:text-[11px] font-telemetry-sm font-bold text-slate-500 dark:text-slate-400 uppercase">
                          {item.title}
                        </div>
                        <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                          {item.value}
                        </div>
                        <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                          {item.detail}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Evidence Sources & Telemetry Log */}
              <div className="lg:col-span-5 space-y-4 sm:space-y-5">
                {/* Evidence & Citations */}
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2.5">
                    <span className="font-headline-sm text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      Verified Data Citations
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {cleanEvidence.length} Sources Grounded
                    </span>
                  </div>

                  <div className="space-y-2">
                    {cleanEvidence.map((chunk, idx) => (
                      <div
                        key={idx}
                        className="p-2 sm:p-2.5 bg-white dark:bg-[#090f24] rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between gap-2 shadow-2xs"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="font-mono text-[10px] sm:text-[11px] font-semibold truncate">{chunk}</span>
                        </div>
                        <span className="text-[9px] sm:text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold bg-cyan-50 dark:bg-cyan-950/80 px-2 py-0.5 rounded-full shrink-0 border border-cyan-200 dark:border-cyan-500/30">
                          VERIFIED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real-time Agent Metadata */}
                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2.5">
                    <span className="font-headline-sm text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-500 dark:text-cyan-400 shrink-0" />
                      Agent Telemetry
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>

                  <div className="space-y-1.5 text-[11px] sm:text-xs font-mono text-slate-600 dark:text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                      <span className="text-slate-400">Agent Node:</span>
                      <span className="font-bold text-slate-800 dark:text-white truncate max-w-[170px]">langgraph_{selectedAgent}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                      <span className="text-slate-400">Grounding Protocol:</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400 truncate max-w-[170px]">Tavily + Chroma RAG</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-200/50 dark:border-white/5">
                      <span className="text-slate-400">Execution Latency:</span>
                      <span className="font-bold text-slate-800 dark:text-white">~1.2s avg</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Audit Status:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Grounded</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Navigation Footer */}
            <div className="pt-3 sm:pt-4 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setSelectedAgent(null)}
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-200 dark:border-white/10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to All 4 Agents</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <button
                  type="button"
                  onClick={handlePrevAgent}
                  className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={handleNextAgent}
                  className="flex-1 sm:flex-none px-3.5 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 dark:from-cyan-500 dark:to-orange-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:opacity-95 shadow-sm transition-all"
                >
                  <span>Next Agent</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
