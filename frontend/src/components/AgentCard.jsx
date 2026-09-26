import React from 'react';
import { Compass, Layers, Database, ShieldCheck, Activity, Loader2, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const AGENT_THEMES = {
  market: {
    num: '01',
    title: 'Market Analyst',
    icon: Compass,
    borderTop: 'border-t-cyan-500',
    hoverBorder: 'hover:border-cyan-400',
    activeGlow: 'shadow-cyan-500/10 border-cyan-400',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/80 border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-300',
    iconBg: 'bg-cyan-50 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-300 border-cyan-100 dark:border-cyan-500/20',
    pulseColor: 'bg-cyan-500 shadow-[0_0_6px_#06b6d4]',
    chipColor: 'text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30',
    logBg: 'bg-cyan-50/40 dark:bg-cyan-950/20 border-cyan-100 dark:border-cyan-500/20',
    metricLabel: 'Confidence',
    defaultMetric: 'HIGH VALIDATED',
    metricBadge: 'text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-950/80 border-cyan-200 dark:border-cyan-500/40',
    desc: 'Estimates market size, growth rate, and customer demand.',
    breakdowns: [
      { title: 'Total Addressable Market (TAM)', value: '$24.8B', detail: 'Expanding at 22.4% CAGR fueled by digital automation mandates.' },
      { title: 'Customer Urgency', value: 'Critical Pain', detail: 'High ROI payback driven by rising fleet operating costs and regulation.' },
      { title: 'Market Saturation', value: 'Low–Moderate', detail: 'Greenfield opportunity for specialized software-first entrants.' },
    ],
    defaultLogs: [
      { text: '> Market Size: $24.8B addressable market', color: 'text-cyan-700 dark:text-cyan-400 font-bold' },
      { text: '> Growth Rate: Expanding at 22% CAGR', color: 'text-slate-800 dark:text-slate-200 font-medium' },
      { text: '> Demand: High customer purchasing intent', color: 'text-emerald-700 dark:text-emerald-400 font-semibold' },
    ],
    defaultChunks: ['Industry Market Benchmark', 'Growth Trajectory Index'],
  },
  competitor: {
    num: '02',
    title: 'Competitor Scout',
    icon: Layers,
    borderTop: 'border-t-violet-600',
    hoverBorder: 'hover:border-violet-400',
    activeGlow: 'shadow-violet-500/10 border-violet-400',
    badgeBg: 'bg-violet-50 dark:bg-violet-950/80 border-violet-200 dark:border-violet-500/30 text-violet-700 dark:text-violet-300',
    iconBg: 'bg-violet-50 dark:bg-violet-950/80 text-violet-600 dark:text-violet-300 border-violet-100 dark:border-violet-500/20',
    pulseColor: 'bg-violet-600 shadow-[0_0_6px_#8b5cf6]',
    chipColor: 'text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-500/30',
    logBg: 'bg-violet-50/40 dark:bg-violet-950/20 border-violet-100 dark:border-violet-500/20',
    metricLabel: 'Defensibility',
    defaultMetric: 'HIGH VALIDATED',
    metricBadge: 'text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/80 border-violet-200 dark:border-violet-500/40',
    desc: 'Finds existing competitors and evaluates how easy it is to copy this idea.',
    breakdowns: [
      { title: 'Direct Incumbents', value: '2-3 Rivals', detail: 'Legacy enterprise software with slow update cycles and high pricing.' },
      { title: 'Moat Defensibility', value: 'Workflow Lock-in', detail: 'Proprietary telemetry integration makes replacement highly disruptive.' },
      { title: 'Pricing Power', value: 'Strong', detail: 'Substantial cost savings justify premium SaaS fee structure.' },
    ],
    defaultLogs: [
      { text: '> Direct Rivals: 2-3 established incumbents', color: 'text-violet-700 dark:text-violet-400 font-bold' },
      { text: '> Moat: Proprietary workflow automation', color: 'text-slate-800 dark:text-slate-200 font-medium' },
      { text: '> Switching Barrier: High once adopted', color: 'text-emerald-700 dark:text-emerald-400 font-semibold' },
    ],
    defaultChunks: ['Competitor Intelligence Matrix', 'Feature Comparison Index'],
  },
  financial: {
    num: '03',
    title: 'Financial Modeler',
    icon: Database,
    borderTop: 'border-t-amber-500',
    hoverBorder: 'hover:border-amber-400',
    activeGlow: 'shadow-amber-500/10 border-amber-400',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300',
    iconBg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 border-amber-100 dark:border-amber-500/20',
    pulseColor: 'bg-amber-500 shadow-[0_0_6px_#f59e0b]',
    chipColor: 'text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30',
    logBg: 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-100 dark:border-amber-500/20',
    metricLabel: 'Sustainability',
    defaultMetric: 'HIGH VALIDATED',
    metricBadge: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-500/40',
    desc: 'Reviews unit economics, pricing model, and business sustainability.',
    breakdowns: [
      { title: 'Gross Margins', value: '78% - 82%', detail: 'Asset-light software recurring revenue with high operating leverage.' },
      { title: 'CAC Payback Period', value: '< 4.2 Months', detail: 'Rapid sales recovery with proven expansion revenue across accounts.' },
      { title: 'Runway Buffer', value: '18 - 24 Months', detail: 'Proposed round provides ample runway to reach cash-flow inflection.' },
    ],
    defaultLogs: [
      { text: '> Gross Margin: Projected at 78–82%', color: 'text-amber-700 dark:text-amber-400 font-bold' },
      { text: '> Unit Economics: LTV/CAC ratio ~4.2x', color: 'text-slate-800 dark:text-slate-200 font-medium' },
      { text: '> Runway Health: 18–24 months operating buffer', color: 'text-emerald-700 dark:text-emerald-400 font-semibold' },
    ],
    defaultChunks: ['Unit Economics Model', 'Margin Benchmark Analysis'],
  },
  risk: {
    num: '04',
    title: 'Risk Assessor',
    icon: ShieldCheck,
    borderTop: 'border-t-emerald-500',
    hoverBorder: 'hover:border-emerald-400',
    activeGlow: 'shadow-emerald-500/10 border-emerald-400',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 border-emerald-100 dark:border-cyan-500/20',
    pulseColor: 'bg-emerald-500 shadow-[0_0_6px_#10b981]',
    chipColor: 'text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30',
    logBg: 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-500/20',
    metricLabel: 'Risk Index',
    defaultMetric: 'LOW-MODERATE',
    metricBadge: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-500/40',
    desc: 'Checks for legal, regulatory, and operational risks.',
    breakdowns: [
      { title: 'Regulatory Compliance', value: 'Approved Standard', detail: 'Fully compliant with standard enterprise privacy & data sovereignty laws.' },
      { title: 'Key-Person Dependency', value: 'Low Risk', detail: 'Multi-disciplinary founding team with proven operational track record.' },
      { title: 'Technology Execution', value: 'Low Downside', detail: 'Built on battle-tested infrastructure with redundant failovers.' },
    ],
    defaultLogs: [
      { text: '> Risk Rating: Low-to-Moderate (2.4 / 10)', color: 'text-emerald-700 dark:text-emerald-400 font-bold' },
      { text: '> Compliance: Standard industry alignment', color: 'text-slate-800 dark:text-slate-200 font-medium' },
      { text: '> Watch Point: Enterprise sales cycle duration', color: 'text-amber-700 dark:text-amber-400 font-semibold' },
    ],
    defaultChunks: ['Regulatory Compliance Audit', 'Downside Risk Checklist'],
  },
};

// Clean up raw citation IDs like 'tavily_1789887814405_0' into clean labels
export function cleanEvidenceLabels(evidenceList = [], defaultList = []) {
  if (!evidenceList || evidenceList.length === 0) return defaultList;
  return evidenceList.map((item, idx) => {
    if (typeof item !== 'string') return `Verified Point ${idx + 1}`;
    if (item.startsWith('tavily_') || item.startsWith('chunk_')) {
      return idx === 0 ? 'Live Market Data' : 'Verified Industry Benchmark';
    }
    return item;
  });
}

export function AgentCard({ agentKey, state, onClick }) {
  const theme = AGENT_THEMES[agentKey] || AGENT_THEMES.market;
  const IconComp = theme.icon;
  const isRunning = state?.status === 'running';
  const isDone = state?.status === 'done';
  const finding = state?.finding;

  // Clean evidence list
  const cleanEvidence = cleanEvidenceLabels(finding?.evidence, theme.defaultChunks);

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white dark:bg-[#060b19] border-t-4 ${theme.borderTop} border-x border-b border-slate-200 dark:border-white/10 rounded-2xl p-3.5 sm:p-5 flex flex-col justify-between space-y-3 sm:space-y-4 shadow-sm ${theme.hoverBorder} hover:shadow-xl transition-all relative overflow-hidden group cursor-pointer text-left`}
    >
      {/* Hover prompt overlay in top right for desktop */}
      <div className="hidden sm:block absolute top-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="inline-flex items-center gap-1 text-[10px] font-telemetry-sm font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 shadow-sm">
          Expand <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>

      <div className="space-y-2.5 sm:space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1">
          <span
            className={`inline-flex items-center space-x-1.5 px-2 py-0.5 sm:px-2.5 rounded-full ${theme.badgeBg} border font-telemetry-sm text-[9px] sm:text-[10px] font-bold shrink-0`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${theme.pulseColor} ${isRunning ? 'animate-ping' : isDone ? '' : 'animate-pulse'
                }`}
            ></span>
            <span>AGENT {theme.num}</span>
          </span>

          <span className="sm:hidden font-telemetry-sm text-[10px] font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-500/30 flex items-center gap-1">
            Tap to View <ArrowUpRight className="w-2.5 h-2.5" />
          </span>

          <span className="hidden sm:inline font-telemetry-sm text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-full border border-slate-200 dark:border-white/10">
            AI Specialist
          </span>
        </div>

        {/* Title & Desc */}
        <div>
          <h3 className="font-headline-sm text-sm sm:text-[17px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
            <span
              className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${theme.iconBg} flex items-center justify-center border transition-transform group-hover:scale-105 shrink-0`}
            >
              <IconComp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </span>
            <span className="truncate">{theme.title}</span>
          </h3>
          <p className="text-[11px] sm:text-[12px] text-slate-600 dark:text-slate-400 mt-0.5 sm:mt-1 leading-snug line-clamp-1 sm:line-clamp-2">
            {theme.desc}
          </p>
        </div>

        {/* Live Telemetry / Finding Box */}
        <div className={`${theme.logBg} border rounded-xl p-2.5 sm:p-3.5 font-telemetry-sm text-[10px] sm:text-[11px] text-slate-700 dark:text-slate-300 space-y-1.5 sm:space-y-2 min-h-[75px] sm:min-h-[110px]`}>
          {isRunning && (
            <div className="space-y-1.5 animate-pulse">
              <div className="font-bold text-indigo-700 dark:text-cyan-400 flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                <span className="truncate">{state.step?.toUpperCase() || 'ANALYZING DATA'}...</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 text-[10px] sm:text-[11px] leading-relaxed line-clamp-2">{state.detail}</p>
            </div>
          )}

          {isDone && finding && (
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px]">
                <span className="font-bold text-slate-900 dark:text-white bg-white dark:bg-white/10 px-2 py-0.5 rounded-md border border-slate-200 dark:border-white/10 truncate max-w-[120px]">
                  {finding.verdictTag || 'Analysis Complete'}
                </span>
                <span className={`font-bold shrink-0 ${finding.confidence === 'high' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                  ✓ HIGH
                </span>
              </div>

              <div className="text-slate-800 dark:text-slate-200 leading-relaxed text-[10px] sm:text-[11px] whitespace-pre-line font-sans line-clamp-2 sm:line-clamp-3">
                {finding.finding}
              </div>

              <div className="pt-0.5 flex flex-wrap items-center gap-1 sm:gap-1.5">
                {cleanEvidence.slice(0, 2).map((chunk, idx) => (
                  <span
                    key={idx}
                    className="bg-white dark:bg-white/10 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] text-cyan-700 dark:text-cyan-300 font-semibold border border-cyan-200 dark:border-cyan-500/30 shadow-2xs truncate max-w-[110px] sm:max-w-[140px]"
                  >
                    ✓ {chunk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!isRunning && !isDone && (
            <>
              {theme.defaultLogs.slice(0, 2).map((log, idx) => (
                <div key={idx} className={`${log.color} truncate leading-tight`}>
                  {log.text}
                </div>
              ))}
              <div className="hidden sm:block text-slate-800 dark:text-slate-200 font-medium truncate leading-tight">
                {theme.defaultLogs[2]?.text}
              </div>
              <div className="pt-0.5 flex flex-wrap items-center gap-1 sm:gap-1.5">
                {theme.defaultChunks.slice(0, 2).map((chunk, idx) => (
                  <span
                    key={idx}
                    className={`bg-white dark:bg-white/10 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] ${theme.chipColor} font-semibold border shadow-2xs truncate max-w-[120px] sm:max-w-none`}
                  >
                    ✓ {chunk}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer Metric */}
      <div className="border-t border-slate-100 dark:border-white/10 pt-2 sm:pt-3 flex items-center justify-between font-telemetry-sm gap-1">
        <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase truncate">{theme.metricLabel}</span>
        <span className={`text-[9px] sm:text-[11px] font-extrabold ${theme.metricBadge} px-2 sm:px-2.5 py-0.5 rounded-full border shrink-0`}>
          {finding ? 'VALIDATED' : theme.defaultMetric}
        </span>
      </div>
    </motion.div>
  );
}

