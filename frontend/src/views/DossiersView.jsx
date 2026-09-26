import { useState } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  FileDown, Sparkles, CheckCircle2, AlertTriangle, Scale, ShieldCheck,
  ArrowLeft, PlusCircle, TrendingUp, Users, DollarSign, BarChart3, Swords
} from 'lucide-react';
import { PrintableReport } from '../components/PrintableReport.jsx';

function buildRadarData(selectedDeal) {
  if (!selectedDeal?.agentStates) {
    return [
      { subject: 'Market Sizing', A: 75, fullMark: 100 },
      { subject: 'Moat', A: 70, fullMark: 100 },
      { subject: 'Unit Economics', A: 65, fullMark: 100 },
      { subject: 'Risk Profile', A: 80, fullMark: 100 },
      { subject: 'Data Quality', A: 85, fullMark: 100 },
    ];
  }

  const score = parseFloat(selectedDeal?.verdict?.score || 7) * 10;
  const marketConf = selectedDeal.agentStates.market?.finding?.confidence === 'high' ? 90 : 70;
  const competitorConf = selectedDeal.agentStates.competitor?.finding?.confidence === 'high' ? 88 : 68;
  const financialConf = selectedDeal.agentStates.financial?.finding?.confidence === 'high' ? 85 : 62;
  const riskConf = selectedDeal.agentStates.risk?.finding?.confidence === 'high' ? 88 : 60;

  return [
    { subject: 'Market Sizing', A: marketConf, fullMark: 100 },
    { subject: 'Moat Strength', A: competitorConf, fullMark: 100 },
    { subject: 'Unit Economics', A: financialConf, fullMark: 100 },
    { subject: 'Risk Profile', A: riskConf, fullMark: 100 },
    { subject: 'Conviction', A: Math.min(99, score), fullMark: 100 },
  ];
}

function parseCompanyName(selectedDeal) {
  if (selectedDeal?.name) {
    if (selectedDeal.name.length > 40) {
      return selectedDeal.name.slice(0, 37).trim() + '...';
    }
    return selectedDeal.name;
  }
  const idea = selectedDeal?.idea || '';
  const m = idea.match(/(?:Company|Startup|Name|Project):\s*([^\n\r,]+)/i);
  if (m?.[1]) return m[1].trim();
  const fl = idea.split('\n')[0].trim();
  if (fl.length > 3 && fl.length < 45 && !fl.includes('.')) {
    return fl.replace(/^(Company|Startup|Project):\s*/i, '');
  }
  const words = fl.split(' ');
  if (words.length > 5) {
    return words.slice(0, 4).join(' ') + '...';
  }
  return fl.slice(0, 32).trim() || 'Startup Case';
}


function AgentFindingPanel({ agentKey, agentState, label, colorClass }) {
  const finding = agentState?.finding;
  if (!finding?.finding) return null;

  // Parse bullet points from finding text
  const lines = finding.finding
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className={`border-l-4 ${colorClass} bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 p-4 sm:p-5 rounded-r-2xl shadow-sm space-y-3`}>
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="font-telemetry-sm text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
          {label}
        </span>
        <span className="font-telemetry-sm text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 uppercase">
          {finding.verdictTag || 'Validated'}
        </span>
      </div>
      <div className="space-y-2">
        {lines.map((line, i) => {
          // Render bold markdown **Label:** Text
          const parts = line.split(/(\*\*[^*]+\*\*)/g);
          return (
            <p key={i} className="text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {parts.map((part, j) =>
                part.startsWith('**') && part.endsWith('**') ? (
                  <strong key={j} className="text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>
                ) : (
                  <span key={j}>{part}</span>
                )
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export function DossiersView({
  selectedDeal,
  completedCases = [],
  onSelectDeal,
  currentAnalysis,
  onGoToDealFlow,
  onGoToCompare,
  onStartNew,
}) {
  const [activeTab, setActiveTab] = useState('memo');
  const { isDark } = useTheme();

  // If a deal was explicitly clicked, use it.
  // Otherwise, automatically fallback to current analysis or most recent completed deal!
  const activeDeal = selectedDeal || currentAnalysis || (completedCases.length > 0 ? completedCases[0] : null);

  const hasData = !!activeDeal?.verdict;
  const companyName = parseCompanyName(activeDeal);
  const dealScore = activeDeal?.score || activeDeal?.verdict?.score || 8.4;
  const dealSector = activeDeal?.sector || 'Technology & AI';
  const verdict = activeDeal?.verdict;
  const debatePoints = activeDeal?.debatePoints || [];
  const agentStates = activeDeal?.agentStates || {};

  const radarData = buildRadarData(activeDeal);
  const scoreNum = parseFloat(dealScore);
  const scorePercent = Math.min(100, Math.round(scoreNum * 10));

  const recommendation = verdict?.recommendation || 'Recommended for Investment';
  const reasoning = verdict?.reasoning || 'Full analysis pending.';

  const handlePrint = () => window.print();

  // Empty state — ONLY shown when no deal is selected, no current analysis, and no saved cases exist
  if (!activeDeal) {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        <div className="border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="font-telemetry-sm text-[11px] font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-cyan-400 animate-pulse"></span> Saved Reports
          </div>
          <h2 className="font-headline-lg text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Investment Dossiers
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-20 space-y-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-100 to-violet-100 dark:from-indigo-950/60 dark:to-violet-950/40 flex items-center justify-center shadow-inner">
            <BarChart3 className="w-8 h-8 text-indigo-500 dark:text-violet-400" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-headline-sm text-lg font-bold text-slate-900 dark:text-white">No dossier selected</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm font-sans">
              Select a deal from your Deal Flow pipeline or run an analysis in the War Room to view its full AI-generated investment dossier.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onGoToDealFlow}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/15 text-slate-800 dark:text-white font-bold text-sm rounded-xl shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Deal Flow
            </button>
            <button
              type="button"
              onClick={onStartNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-90 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Analyse a Pitch
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Screen-only Interactive View ── */}
      <div className="print:hidden space-y-6 sm:space-y-8 animate-in fade-in duration-200">
        {/* Deal Switcher Bar (if user analyzed multiple companies) */}
        {completedCases.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-telemetry-sm">
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider text-[10px] shrink-0">
              Switch Dossier:
            </span>
            {completedCases.map((deal) => {
              const isCurrent = (activeDeal?.id && activeDeal.id === deal.id) || activeDeal?.name === deal.name;
              return (
                <button
                  key={deal.id || deal.name}
                  type="button"
                  onClick={() => onSelectDeal?.(deal)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10'
                  }`}
                >
                  <span className="truncate max-w-[130px]">{deal.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${isCurrent ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'}`}>
                    {deal.score}/10
                  </span>
                </button>
              );
            })}
          </div>
        )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-white/10 pb-4 gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-telemetry-sm text-[11px] font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-2">
            <button
              onClick={onGoToDealFlow}
              className="flex items-center gap-1 hover:text-indigo-800 dark:hover:text-cyan-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Deal Flow
            </button>
            <span className="text-slate-300 dark:text-white/20">/</span>
            <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-cyan-400 animate-pulse"></span>
            Full Dossier
          </div>
          <h2 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight break-words">
            {companyName}
          </h2>
          <span className="text-xs font-telemetry-sm text-slate-500 dark:text-slate-400">
            {dealSector} · Full AI Research Dossier
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onGoToCompare && (
            <button
              type="button"
              onClick={onGoToCompare}
              className="px-3.5 py-2 bg-white dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 border border-slate-300 dark:border-white/15 hover:border-indigo-300 rounded-xl text-xs font-bold font-telemetry-sm text-slate-800 dark:text-white flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Swords className="w-4 h-4 text-indigo-500 dark:text-cyan-400" />
              <span>Deal Battle</span>
            </button>
          )}
          <button
            type="button"
            onClick={onStartNew}
            className="px-4 py-2 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-300 dark:border-white/15 rounded-xl text-xs font-bold font-telemetry-sm text-slate-800 dark:text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-indigo-500" />
            New Analysis
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-300 dark:border-white/15 rounded-xl text-xs font-bold font-telemetry-sm text-slate-800 dark:text-white flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-rose-500" />
            Export Report
          </button>
        </div>
      </div>

      {/* 2-Column Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* Left Column: Conviction Score + Radar */}
        <div className="lg:col-span-4 space-y-5 min-w-0">

          {/* Conviction Score Card */}
          <div className="bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-telemetry-sm text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Conviction Score
              </span>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${
                scoreNum >= 8
                  ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-500/40'
                  : scoreNum >= 6
                  ? 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-500/40'
                  : 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-500/40'
              }`}>
                {scoreNum >= 8 ? 'HIGH CONVICTION' : scoreNum >= 6 ? 'MODERATE' : 'CAUTION'}
              </span>
            </div>

            <div className="flex items-baseline space-x-2">
              <span className={`font-headline-lg text-5xl font-black text-transparent bg-clip-text ${
                scoreNum >= 8
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400'
                  : scoreNum >= 6
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                  : 'bg-gradient-to-r from-rose-500 to-red-500'
              }`}>
                {parseFloat(dealScore).toFixed(1)}
              </span>
              <span className="font-telemetry-sm text-slate-400 font-bold text-lg">/ 10.0</span>
            </div>

            {/* Score bar */}
            <div className="w-full bg-slate-200/80 dark:bg-black/50 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  scoreNum >= 8
                    ? 'bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 shadow-[0_0_8px_#10b981]'
                    : scoreNum >= 6
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-gradient-to-r from-rose-400 to-red-500'
                }`}
                style={{ width: `${scorePercent}%` }}
              />
            </div>

            {/* Radar Chart */}
            <div className="w-full h-56 pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: isDark ? '#cbd5e1' : '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDark ? '#475569' : '#cbd5e1'} />
                  <Radar
                    name="Conviction"
                    dataKey="A"
                    stroke={isDark ? '#38bdf8' : '#2563eb'}
                    fill={isDark ? '#06b6d4' : '#00f0ff'}
                    fillOpacity={isDark ? 0.4 : 0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/10 grid grid-cols-2 gap-2 text-[11px] font-telemetry-sm text-slate-600 dark:text-slate-300">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Agents Validated:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {Object.values(agentStates).filter((a) => a?.status === 'done').length}/4 Complete
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Verdict:</span>
                <span className="font-bold text-cyan-600 dark:text-cyan-400 truncate block">{recommendation?.split(' ').slice(0, 2).join(' ')}</span>
              </div>
            </div>
          </div>

          {/* Investment Recommendation Card */}
          <div className="bg-slate-900 dark:bg-black/60 text-slate-100 rounded-2xl p-5 sm:p-6 border border-slate-800 dark:border-white/10 space-y-4 shadow-md backdrop-blur-md">
            <div className="flex items-center gap-2 text-cyan-400">
              <Scale className="w-4 h-4" />
              <h4 className="font-headline-sm text-sm font-bold uppercase tracking-wide">Final Recommendation</h4>
            </div>

            <div className="space-y-1.5">
              <span className="text-emerald-400 font-bold text-xs font-telemetry-sm uppercase tracking-wide">{recommendation}</span>
              <p className="text-slate-300 text-xs leading-relaxed font-sans">{reasoning}</p>
            </div>

            {debatePoints.length > 0 && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[10px] font-telemetry-sm font-bold text-slate-400 uppercase tracking-wide">Agent Consensus Points</span>
                {debatePoints.slice(0, 2).map((pt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    {pt.agreement
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      : <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                    }
                    <span className="text-slate-300 leading-relaxed">{pt.topic}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Tabbed Memo & Agent Findings */}
        <div className="lg:col-span-8 space-y-5 min-w-0">

          {/* Tab Switcher */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto">
            {[
              { key: 'memo', label: 'Investment Memo' },
              { key: 'agents', label: 'Agent Findings' },
              { key: 'debate', label: 'Debate & Risks' },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-telemetry-sm transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-indigo-50 dark:bg-white/10 text-indigo-700 dark:text-cyan-300 border border-indigo-200 dark:border-cyan-400/30 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── TAB: Investment Memo ── */}
          {activeTab === 'memo' && (
            <div className="bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-8 space-y-6 shadow-sm text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              <section className="space-y-2">
                <h4 className="font-headline-sm text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded bg-cyan-500"></span>
                  1. Executive Investment Thesis
                </h4>
                <p>
                  <strong className="text-slate-900 dark:text-white">{companyName}</strong> operates in the <strong className="text-slate-900 dark:text-white">{dealSector}</strong> sector and was analysed by 4 specialist AI agents covering market opportunity, competitive landscape, financial model, and risk profile. The analysis yielded a conviction score of <strong className="text-slate-900 dark:text-white">{parseFloat(dealScore).toFixed(1)}/10</strong>.
                </p>
                <p>{reasoning}</p>
              </section>

              {agentStates.market?.finding?.finding && (
                <section className="space-y-2">
                  <h4 className="font-headline-sm text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-cyan-500"></span>
                    2. Market Opportunity
                  </h4>
                  <div className="space-y-1.5">
                    {agentStates.market.finding.finding.split('\n').filter(Boolean).map((line, i) => {
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={i}>
                          {parts.map((p, j) =>
                            p.startsWith('**') && p.endsWith('**')
                              ? <strong key={j} className="text-slate-900 dark:text-white">{p.slice(2, -2)}</strong>
                              : <span key={j}>{p}</span>
                          )}
                        </p>
                      );
                    })}
                  </div>
                </section>
              )}

              {agentStates.competitor?.finding?.finding && (
                <section className="space-y-2">
                  <h4 className="font-headline-sm text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-violet-500"></span>
                    3. Competitive Position & Moat
                  </h4>
                  <div className="space-y-1.5">
                    {agentStates.competitor.finding.finding.split('\n').filter(Boolean).map((line, i) => {
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={i}>
                          {parts.map((p, j) =>
                            p.startsWith('**') && p.endsWith('**')
                              ? <strong key={j} className="text-slate-900 dark:text-white">{p.slice(2, -2)}</strong>
                              : <span key={j}>{p}</span>
                          )}
                        </p>
                      );
                    })}
                  </div>
                </section>
              )}

              {agentStates.financial?.finding?.finding && (
                <section className="space-y-2">
                  <h4 className="font-headline-sm text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded bg-amber-500"></span>
                    4. Financial Model & Runway
                  </h4>
                  <div className="space-y-1.5">
                    {agentStates.financial.finding.finding.split('\n').filter(Boolean).map((line, i) => {
                      const parts = line.split(/(\*\*[^*]+\*\*)/g);
                      return (
                        <p key={i}>
                          {parts.map((p, j) =>
                            p.startsWith('**') && p.endsWith('**')
                              ? <strong key={j} className="text-slate-900 dark:text-white">{p.slice(2, -2)}</strong>
                              : <span key={j}>{p}</span>
                          )}
                        </p>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          )}

          {/* ── TAB: Agent Findings ── */}
          {activeTab === 'agents' && (
            <div className="space-y-4">
              <AgentFindingPanel
                agentKey="market"
                agentState={agentStates.market}
                label="📊 Market Analyst — Market Opportunity"
                colorClass="border-l-cyan-500"
              />
              <AgentFindingPanel
                agentKey="competitor"
                agentState={agentStates.competitor}
                label="🔍 Competitor Scout — Competitive Landscape"
                colorClass="border-l-violet-500"
              />
              <AgentFindingPanel
                agentKey="financial"
                agentState={agentStates.financial}
                label="💰 Financial Modeler — Unit Economics & Runway"
                colorClass="border-l-amber-500"
              />
              <AgentFindingPanel
                agentKey="risk"
                agentState={agentStates.risk}
                label="🛡️ Risk Assessor — Risk Profile & Red Flags"
                colorClass="border-l-emerald-500"
              />
              {!Object.values(agentStates).some((a) => a?.finding) && (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
                  Agent findings will appear here after analysis runs in the War Room.
                </div>
              )}
            </div>
          )}

          {/* ── TAB: Debate & Risks ── */}
          {activeTab === 'debate' && (
            <div className="space-y-4">
              {debatePoints.length === 0 && (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400 text-sm">
                  Debate points will appear here after synthesis completes.
                </div>
              )}

              {debatePoints.map((pt, i) => (
                <div
                  key={i}
                  className={`border-l-4 ${pt.agreement ? 'border-l-emerald-500' : 'border-l-rose-500'} bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 p-5 rounded-r-2xl shadow-sm space-y-3`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className={`font-telemetry-sm text-xs font-bold uppercase flex items-center gap-1.5 ${pt.agreement ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {pt.agreement
                        ? <CheckCircle2 className="w-4 h-4" />
                        : <AlertTriangle className="w-4 h-4" />
                      }
                      {pt.agreement ? 'Consensus' : 'Tension'}: {pt.topic}
                    </span>
                    <span className="text-[10px] font-telemetry-sm font-bold bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 uppercase">
                      {(pt.agentsInvolved || []).join(', ')} agents
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{pt.note}</p>
                </div>
              ))}

              {/* Risk finding from risk agent */}
              {agentStates.risk?.finding?.finding && (
                <div className="mt-6 space-y-2">
                  <div className="font-telemetry-sm text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Full Risk Assessment
                  </div>
                  <AgentFindingPanel
                    agentKey="risk"
                    agentState={agentStates.risk}
                    label="🛡️ Risk Assessor Detailed Findings"
                    colorClass="border-l-emerald-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>

      {/* ── Clean Formal Print / PDF Memo ── */}
      <PrintableReport
        companyName={companyName}
        sector={dealSector}
        stage={activeDeal?.stage || 'Seed / Series A'}
        raise={activeDeal?.raise || '$2.5M'}
        score={dealScore}
        verdict={verdict}
        debatePoints={debatePoints}
        agentStates={agentStates}
        idea={activeDeal?.idea || ''}
      />
    </>
  );
}
