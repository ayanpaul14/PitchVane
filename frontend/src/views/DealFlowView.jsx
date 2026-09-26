import { useState } from 'react';
import { Search, ArrowRight, CheckCircle2, Sparkles, PlusCircle, TrendingUp, Clock, ShieldCheck, Swords } from 'lucide-react';

// Score to color mapping
function getScoreColor(score) {
  const s = parseFloat(score);
  if (s >= 8) return 'text-emerald-600 dark:text-emerald-400';
  if (s >= 6) return 'text-amber-600 dark:text-amber-400';
  return 'text-rose-600 dark:text-rose-400';
}

function getScoreBg(score) {
  const s = parseFloat(score);
  if (s >= 8) return 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40';
  if (s >= 6) return 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/40';
  return 'bg-rose-50 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/40';
}

function getRecommendationLabel(verdict) {
  if (!verdict) return 'Analysed';
  const r = verdict.recommendation || '';
  if (r.toLowerCase().includes('invest')) return 'Term Sheet Active';
  if (r.toLowerCase().includes('pivot')) return 'Pivot Recommended';
  if (r.toLowerCase().includes('pass')) return 'Passed';
  if (r.toLowerCase().includes('proceed')) return 'Proceeding to Alpha';
  return 'Diligence Complete';
}

// Parse sector from idea text
function parseSector(idea = '') {
  if (!idea) return 'Technology & AI';
  if (/health|ehr|hipaa|medical/i.test(idea)) return 'Healthcare & AI Medicine';
  if (/supply chain|logistics|freight/i.test(idea)) return 'Supply Chain & Logistics';
  if (/crypto|web3|defi|nft/i.test(idea)) return 'Web3 & Blockchain';
  if (/fintech|payment|banking|finance/i.test(idea)) return 'Fintech & Payments';
  if (/edtech|learning|education/i.test(idea)) return 'EdTech & Learning';
  if (/saas|software|b2b/i.test(idea)) return 'B2B SaaS';
  if (/consumer|d2c|marketplace/i.test(idea)) return 'Consumer & Marketplace';
  if (/climate|green|sustainability/i.test(idea)) return 'Climate Tech';
  return 'Technology & AI';
}

// Parse company name from idea
function parseCompanyName(idea = '') {
  if (!idea) return 'Startup Case';
  const companyMatch = idea.match(/(?:Company|Startup|Name):\s*([^\n\r,]+)/i);
  if (companyMatch?.[1]) return companyMatch[1].trim();
  const firstLine = idea.split('\n')[0].trim();
  if (firstLine.length > 3 && firstLine.length < 60 && !firstLine.includes('.')) return firstLine;
  return idea.slice(0, 40).trim();
}

// Parse raise from idea
function parseRaise(idea = '') {
  const m = idea.match(/\$([0-9.]+[MKBmkb]?)/);
  return m ? m[0] : '$2.5M';
}

export function DealFlowView({ onSelectDeal, completedCases = [], onStartNew, onGoToCompare }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterScore, setFilterScore] = useState('All');

  const SCORE_FILTERS = ['All', '8+ High Conviction', '6-8 Moderate', 'Under 6'];

  // Enrich completedCases with parsed fields
  const enriched = completedCases.map((c) => ({
    ...c,
    name: c.name || parseCompanyName(c.idea),
    sector: c.sector || parseSector(c.idea),
    raise: c.raise || parseRaise(c.idea),
    status: c.status || getRecommendationLabel(c.verdict),
    badgeColor: c.badgeColor || getScoreBg(c.score),
    consensus: c.consensus || `${Object.values(c.agentStates || {}).filter((a) => a?.status === 'done').length}/4 Agents Validated`,
  }));

  const filtered = enriched.filter((deal) => {
    const matchesSearch =
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.sector?.toLowerCase().includes(searchQuery.toLowerCase());

    const score = parseFloat(deal.score);
    const matchesScore =
      filterScore === 'All' ||
      (filterScore === '8+ High Conviction' && score >= 8) ||
      (filterScore === '6-8 Moderate' && score >= 6 && score < 8) ||
      (filterScore === 'Under 6' && score < 6);

    return matchesSearch && matchesScore;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-white/10 pb-4 gap-3">
        <div>
          <div className="font-telemetry-sm text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> Your Deals
          </div>
          <h2 className="font-headline-lg text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Deal Flow Pipeline
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-telemetry-sm mt-1">
            Every pitch you analyse in the War Room is automatically tracked here.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-telemetry-sm text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-900 dark:text-white">{enriched.length} active cases</span>
            {enriched.length > 0 && (
              <> · avg score <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {(enriched.reduce((s, c) => s + parseFloat(c.score || 0), 0) / enriched.length).toFixed(1)}
              </span></>
            )}
          </span>
          {onGoToCompare && (
            <button
              type="button"
              onClick={onGoToCompare}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-white/15 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400" />
              <span>Deal Battle</span>
            </button>
          )}
          <button
            type="button"
            onClick={onStartNew}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            New Analysis
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#060b19] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {SCORE_FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterScore(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-telemetry-sm transition-all cursor-pointer whitespace-nowrap ${
                filterScore === f
                  ? 'bg-slate-900 dark:bg-white/15 text-white shadow-sm border border-slate-700 dark:border-cyan-400/40'
                  : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals, sector, keywords..."
            className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/15 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-cyan-400 focus:bg-white dark:focus:bg-black/80 transition-all"
          />
        </div>
      </div>

      {/* Empty State */}
      {enriched.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 space-y-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-100 to-cyan-100 dark:from-indigo-950/60 dark:to-cyan-950/40 flex items-center justify-center shadow-inner">
            <TrendingUp className="w-8 h-8 text-indigo-500 dark:text-cyan-400" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-headline-sm text-lg font-bold text-slate-900 dark:text-white">No deals yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm font-sans">
              Run your first analysis in the War Room — every completed pitch is automatically added to your pipeline here.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartNew}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-bold text-sm rounded-xl shadow-md hover:opacity-90 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            Analyse Your First Pitch
          </button>
        </div>
      )}

      {/* No results for filter */}
      {enriched.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
          No deals match your filter. <button onClick={() => { setSearchQuery(''); setFilterScore('All'); }} className="text-indigo-600 dark:text-cyan-400 font-semibold cursor-pointer">Clear filters</button>
        </div>
      )}

      {/* Deal Pipeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((deal) => {
          const scoreColor = getScoreColor(deal.score);
          const agentsDone = Object.values(deal.agentStates || {}).filter((a) => a?.status === 'done').length;

          return (
            <div
              key={deal.id}
              className="bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-cyan-500/40 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group"
            >
              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-headline-sm text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                        {deal.name}
                      </h3>
                      <span className="text-[10px] font-telemetry-sm font-extrabold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 shrink-0">
                        {deal.stage}
                      </span>
                    </div>
                    <span className="text-xs font-telemetry-sm text-indigo-600 dark:text-cyan-400 font-semibold">{deal.sector}</span>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="flex items-baseline justify-end gap-0.5">
                      <span className={`font-headline-lg text-2xl font-black ${scoreColor}`}>{deal.score}</span>
                      <span className="font-telemetry-sm text-[10px] text-slate-400">/ 10</span>
                    </div>
                    <span className={`text-[9px] font-telemetry-sm font-bold uppercase px-2 py-0.5 rounded-md border ${deal.badgeColor}`}>
                      {deal.status}
                    </span>
                  </div>
                </div>

                {/* Deal Summary */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                  {deal.summary || deal.idea?.slice(0, 140)}
                </p>

                {/* Agent Quick Stats */}
                <div className="flex items-center gap-2 pt-1">
                  {['market', 'competitor', 'financial', 'risk'].map((key) => {
                    const agState = deal.agentStates?.[key];
                    const done = agState?.status === 'done';
                    return (
                      <div
                        key={key}
                        className={`flex-1 h-1.5 rounded-full ${done ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-white/10'}`}
                        title={`${key} agent: ${done ? 'complete' : 'pending'}`}
                      />
                    );
                  })}
                  <span className="text-[10px] font-telemetry-sm text-slate-400 ml-1 whitespace-nowrap">{agentsDone}/4</span>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-telemetry-sm border-t border-slate-100 dark:border-white/5">
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Target Raise:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{deal.raise}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Recommendation:</span>
                    <span className="font-semibold text-indigo-600 dark:text-cyan-400 truncate block">{deal.verdict?.recommendation || 'Analysed'}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between font-telemetry-sm text-xs">
                <span className="text-cyan-700 dark:text-cyan-400 text-[11px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {agentsDone}/4 Agents Validated
                </span>

                <button
                  type="button"
                  onClick={() => onSelectDeal(deal)}
                  className="bg-gradient-to-r from-cyan-500 to-indigo-600 hover:opacity-90 text-white px-3.5 py-1.5 rounded-xl text-[11px] font-bold tracking-wide uppercase flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                >
                  <span>Full Dossier</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
