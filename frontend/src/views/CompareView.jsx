import { useState, useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useTheme } from '../context/ThemeContext.jsx';
import {
  Swords, Trophy, ArrowRight, CheckCircle2, AlertTriangle,
  Sparkles, Plus, ChevronDown, Rocket
} from 'lucide-react';

// Single benchmark demo deal — the other slot is always the user's analysed pitch
const DEMO_DEAL = {
  id: 'neuromesh-ai',
  name: 'NeuroMesh AI',
  sector: 'AI Infrastructure',
  stage: 'Seed',
  raise: '$3.0M',
  score: 8.8,
  verdict: {
    recommendation: 'STRONG BUY (PROCEED TO TERM SHEET)',
    reasoning:
      'Dominant enterprise GPU routing efficiency with 40%+ latency reductions. Outstanding 82% software gross margins with direct enterprise demand from tier-1 labs.',
  },
  radar: { market: 92, moat: 90, economics: 86, risk: 76, conviction: 88 },
  metrics: {
    tam: '$48 Billion',
    grossMargin: '82%',
    runway: '18 Months',
    payback: '6 Months',
    moatSummary: 'Dynamic GPU kernel execution graph with proprietary compiler patents.',
    primaryRisk: 'Nvidia NIM or AWS Bedrock introducing native dynamic batch routing.',
  },
  pros: [
    'Mission-critical customer problem in GPU compute scarcity',
    'High software gross margins (82%) with near-zero marginal inference cost',
    'Already pilots with 3 tier-1 foundational model labs',
  ],
  cons: [
    'Potential incumbent platform risk from Nvidia / Hyperscalers',
    'Requires elite systems engineering talent retention',
  ],
};

// Normalize a completed analysis case into the comparison shape
function normalizeDeal(deal) {
  if (!deal) return null;
  const scoreNum = parseFloat(deal.score || deal.verdict?.score || 7.5);
  const scoreNorm = Math.round(scoreNum * 10);

  if (deal.radar && deal.metrics) return deal;

  const agentStates = deal.agentStates || {};
  const marketFinding = agentStates.market?.finding || {};
  const compFinding = agentStates.competitor?.finding || {};
  const finFinding = agentStates.financial?.finding || {};
  const riskFinding = agentStates.risk?.finding || {};

  const marketScore = marketFinding.score
    ? Math.round(marketFinding.score * 10)
    : marketFinding.confidence === 'high' ? 90 : 72;
  const moatScore = compFinding.score
    ? Math.round(compFinding.score * 10)
    : compFinding.confidence === 'high' ? 88 : 70;
  const finScore = finFinding.score
    ? Math.round(finFinding.score * 10)
    : finFinding.confidence === 'high' ? 85 : 65;
  const riskScore = riskFinding.score
    ? Math.round(riskFinding.score * 10)
    : riskFinding.confidence === 'high' ? 82 : 62;

  const tamRaw = marketFinding.tam || marketFinding.marketSize;
  const tam = tamRaw
    ? (typeof tamRaw === 'string' ? tamRaw : `$${tamRaw}B`)
    : (deal.sector?.includes('AI') ? '$48 Billion' : '$25 Billion');

  const grossMarginRaw = finFinding.grossMargin;
  const grossMargin = grossMarginRaw
    ? (typeof grossMarginRaw === 'string' ? grossMarginRaw : `${grossMarginRaw}%`)
    : (scoreNum >= 8 ? '78%' : '65%');

  const runwayRaw = finFinding.runway || finFinding.runwayMonths;
  const runway = runwayRaw
    ? (typeof runwayRaw === 'string' ? runwayRaw : `${runwayRaw} Months`)
    : '18 Months';

  const paybackRaw = finFinding.paybackPeriod || finFinding.payback;
  const payback = paybackRaw
    ? (typeof paybackRaw === 'string' ? paybackRaw : `${paybackRaw} Months`)
    : '9 Months';

  const moatSummary = compFinding.moat || compFinding.moatSummary
    || deal.summary?.slice(0, 100)
    || 'Proprietary customer workflow & defensibility.';

  const primaryRisk = riskFinding.primaryRisk || riskFinding.topRisk
    || 'Competitive response from category incumbents.';

  return {
    id: deal.id || deal.name,
    name: deal.name || 'Your Startup',
    sector: deal.sector || 'Technology',
    stage: deal.stage || 'Seed / Series A',
    raise: deal.raise || '$2.5M',
    score: scoreNum,
    verdict: deal.verdict || {
      recommendation: scoreNum >= 8 ? 'STRONG BUY' : scoreNum >= 6 ? 'PURSUE CAUTIOUSLY' : 'PASS',
      reasoning: 'Multi-agent analysis completed.',
    },
    radar: { market: marketScore, moat: moatScore, economics: finScore, risk: riskScore, conviction: scoreNorm },
    metrics: { tam, grossMargin, runway, payback, moatSummary, primaryRisk },
    pros: [
      tamRaw ? `TAM: ${tam}` : 'Demonstrated product differentiation validated by autonomous agents',
      grossMarginRaw ? `Gross Margin: ${grossMargin}` : 'Positive alignment on market opportunity',
    ],
    cons: [primaryRisk],
  };
}

// A small score ring badge
function ScoreRing({ score, color }) {
  const pct = Math.round((score / 10) * 100);
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="relative flex items-center justify-center w-14 h-14 shrink-0">
      <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
        <circle cx="28" cy="28" r={r} strokeWidth="4" className="stroke-slate-100 dark:stroke-slate-800 fill-none" />
        <circle
          cx="28" cy="28" r={r} strokeWidth="4" fill="none"
          stroke={color} strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-sm font-black text-slate-900 dark:text-white" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

export function CompareView({ completedCases = [], onSelectForDossier, onStartNew }) {
  const { isDark } = useTheme();

  const userDeals = useMemo(() =>
    completedCases.map(normalizeDeal).filter(Boolean),
  [completedCases]);

  // Build full list of available deals (demos + user analyzed cases)
  const allAvailableDeals = useMemo(() => {
    return [DEMO_DEAL, ...userDeals.filter((d) => d.id !== DEMO_DEAL.id)];
  }, [userDeals]);

  // Contender A state & memo
  const [dealAId, setDealAId] = useState(DEMO_DEAL.id);
  const dealA = useMemo(() => {
    return allAvailableDeals.find((d) => d.id === dealAId) || DEMO_DEAL;
  }, [allAvailableDeals, dealAId]);

  // Contender B state & memo
  const [dealBId, setDealBId] = useState(userDeals[0]?.id || DEMO_DEAL.id);
  const dealB = useMemo(() => {
    return allAvailableDeals.find((d) => d.id === dealBId) || userDeals[0] || DEMO_DEAL;
  }, [allAvailableDeals, dealBId, userDeals]);

  const comparing = Boolean(dealA && dealB);

  const radarData = useMemo(() => {
    if (!comparing) return [];
    return [
      { subject: 'Market', DealA: dealA.radar?.market || 75, DealB: dealB.radar?.market || 70, fullMark: 100 },
      { subject: 'Moat', DealA: dealA.radar?.moat || 70, DealB: dealB.radar?.moat || 75, fullMark: 100 },
      { subject: 'Economics', DealA: dealA.radar?.economics || 80, DealB: dealB.radar?.economics || 65, fullMark: 100 },
      { subject: 'Risk', DealA: dealA.radar?.risk || 75, DealB: dealB.radar?.risk || 70, fullMark: 100 },
      { subject: 'Conviction', DealA: dealA.radar?.conviction || 85, DealB: dealB.radar?.conviction || 78, fullMark: 100 },
    ];
  }, [comparing, dealA, dealB]);

  const scoreA = parseFloat(dealA?.score || 8.8);
  const scoreB = parseFloat(dealB?.score || 0);
  const isATie = comparing && Math.abs(scoreA - scoreB) < 0.2;
  const isAWinner = comparing && scoreA > scoreB;
  const winner = comparing && !isATie ? (isAWinner ? dealA : dealB) : null;
  const totalScore = scoreA + scoreB;
  const allocA = totalScore > 0 ? Math.round((scoreA / totalScore) * 100) : 50;
  const allocB = 100 - allocA;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1 border-b border-slate-200 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2 text-[11px] font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wider">
          <Swords className="w-3.5 h-3.5" />
          <span>Investment Committee Head-to-Head</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Deal Battle & Comparator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Compare any two deals head-to-head. Customize both slots with your analyzed pitches or benchmark deals.
        </p>
      </div>

      {/* ── Contender Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_40px_1fr] gap-3 items-center">

        {/* Slot A — Customizable Contender A */}
        <div className="bg-white dark:bg-[#060b19] border-2 border-indigo-200 dark:border-cyan-500/40 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-cyan-400 bg-indigo-50 dark:bg-cyan-950/60 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-cyan-500/30">
              Contender A
            </span>
            <div className="relative">
              <select
                value={dealAId || ''}
                onChange={(e) => setDealAId(e.target.value)}
                className="text-[11px] font-bold bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 pr-7 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 max-w-[180px] truncate"
              >
                {allAvailableDeals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id === DEMO_DEAL.id ? `Benchmark: ${d.name}` : d.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ScoreRing score={dealA.score} color={isDark ? '#38bdf8' : '#4f46e5'} />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{dealA.name}</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{dealA.sector} · {dealA.stage}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{dealA.raise} raise</p>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic border-t border-slate-100 dark:border-white/5 pt-2 line-clamp-2">
            "{dealA.verdict?.reasoning}"
          </p>
        </div>

        {/* VS Badge */}
        <div className="flex sm:flex-col justify-center items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-rose-600 text-white flex items-center justify-center font-black text-xs shadow-lg ring-4 ring-white dark:ring-[#030712]">
            VS
          </div>
        </div>

        {/* Slot B — Customizable Contender B */}
        <div className="bg-white dark:bg-[#060b19] border-2 border-rose-200 dark:border-rose-500/40 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-200 dark:border-rose-500/30">
              Contender B
            </span>
            <div className="relative">
              <select
                value={dealBId || ''}
                onChange={(e) => setDealBId(e.target.value)}
                className="text-[11px] font-bold bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 pr-7 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500 max-w-[180px] truncate"
              >
                {allAvailableDeals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.id === DEMO_DEAL.id ? `Benchmark: ${d.name}` : d.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>
          {dealB && (
            <>
              <div className="flex items-center gap-3">
                <ScoreRing score={dealB.score} color={isDark ? '#fb7185' : '#e11d48'} />
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white truncate">{dealB.name}</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{dealB.sector} · {dealB.stage}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{dealB.raise} raise</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic border-t border-slate-100 dark:border-white/5 pt-2 line-clamp-2">
                "{dealB.verdict?.reasoning}"
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Only show results when both sides are loaded ── */}
      {comparing && (
        <>
          {/* Winner / Allocation Card */}
          <div className="bg-gradient-to-br from-indigo-950/90 via-slate-900 to-slate-950 text-white border border-indigo-500/30 rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">IC Arbiter</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight">
                  {isATie ? (
                    <span>Close Call — Equal Conviction</span>
                  ) : (
                    <span>
                      Primary Allocation to{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">
                        {winner.name}
                      </span>
                    </span>
                  )}
                </h3>
              </div>

              {/* Allocation split */}
              <div className="bg-white/10 rounded-xl px-4 py-3 border border-white/15 shrink-0 flex items-center gap-4 self-start sm:self-auto">
                <div className="text-center">
                  <span className="block text-[10px] text-cyan-300 uppercase font-bold truncate max-w-[80px]">{dealA.name}</span>
                  <span className="text-xl font-black text-cyan-400">{allocA}%</span>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div className="text-center">
                  <span className="block text-[10px] text-rose-300 uppercase font-bold truncate max-w-[80px]">{dealB.name}</span>
                  <span className="text-xl font-black text-rose-400">{allocB}%</span>
                </div>
              </div>
            </div>

            {/* Why each stands out */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> {dealA.name}
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {dealA.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-rose-300 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> {dealB.name}
                </span>
                <ul className="space-y-1.5 text-slate-300">
                  {dealB.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Radar + Metrics side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Overlaid Radar */}
            <div className="bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Multi-Axis Benchmark</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Overlaid Diligence Radar</h4>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-cyan-400" /> {dealA.name}
                </span>
                <span className="flex items-center gap-1.5 font-bold text-rose-600 dark:text-rose-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 dark:bg-rose-400" /> {dealB.name}
                </span>
              </div>
              <div className="w-full h-56 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
                    <PolarGrid stroke={isDark ? '#334155' : '#e2e8f0'} />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: isDark ? '#cbd5e1' : '#475569', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke={isDark ? '#475569' : '#cbd5e1'} tick={false} />
                    <Radar name={dealA.name} dataKey="DealA"
                      stroke={isDark ? '#38bdf8' : '#4f46e5'} fill={isDark ? '#06b6d4' : '#6366f1'} fillOpacity={0.35} />
                    <Radar name={dealB.name} dataKey="DealB"
                      stroke={isDark ? '#fb7185' : '#e11d48'} fill={isDark ? '#f43f5e' : '#f43f5e'} fillOpacity={0.28} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-slate-400 text-center">
                Outer = stronger agent confidence & risk resilience
              </p>
            </div>

            {/* Dimension Breakdown */}
            <div className="bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Side-by-Side Audit</span>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">Dimension Breakdown</h4>
              </div>

              {/* Mobile-friendly stacked rows */}
              <div className="divide-y divide-slate-100 dark:divide-white/5 text-xs">
                {[
                  { label: 'Target Raise', a: dealA.raise, b: dealB.raise, colorA: 'text-indigo-700 dark:text-cyan-300', colorB: 'text-rose-700 dark:text-rose-300' },
                  { label: 'Market TAM', a: dealA.metrics?.tam, b: dealB.metrics?.tam },
                  { label: 'Gross Margin', a: dealA.metrics?.grossMargin, b: dealB.metrics?.grossMargin, colorA: 'text-emerald-600 dark:text-emerald-400', colorB: 'text-emerald-600 dark:text-emerald-400' },
                  { label: 'Runway', a: dealA.metrics?.runway, b: dealB.metrics?.runway },
                ].map(({ label, a, b, colorA, colorB }) => (
                  <div key={label} className="py-2.5 grid grid-cols-3 gap-2 items-center">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">{label}</span>
                    <span className={`font-bold ${colorA || 'text-slate-900 dark:text-white'} truncate`}>{a}</span>
                    <span className={`font-bold ${colorB || 'text-slate-900 dark:text-white'} truncate`}>{b}</span>
                  </div>
                ))}

                {/* Moat — stacked on mobile */}
                <div className="py-2.5 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Moat</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{dealA.metrics?.moatSummary}</p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{dealB.metrics?.moatSummary}</p>
                  </div>
                </div>

                {/* Primary Risk — stacked on mobile */}
                <div className="py-2.5 space-y-1.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px] block">Primary Risk</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <p className="text-rose-600 dark:text-rose-400 leading-relaxed flex items-start gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />{dealA.metrics?.primaryRisk}
                    </p>
                    <p className="text-rose-600 dark:text-rose-400 leading-relaxed flex items-start gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />{dealB.metrics?.primaryRisk}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dossier links */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSelectForDossier?.(dealA)}
                  className="text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Open {dealA.name} Dossier <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onSelectForDossier?.(dealB)}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Open {dealB.name} Dossier <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {!comparing && (
        <div className="text-center py-6 text-slate-400 text-sm">
          Select a pitch above to start comparing.
        </div>
      )}
    </div>
  );
}
