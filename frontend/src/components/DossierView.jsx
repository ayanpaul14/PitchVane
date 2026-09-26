import React, { useState } from 'react';
import { TelemetryModal } from './TelemetryModal.jsx';
import { FileDown, Code2, CheckCircle2, AlertTriangle, Quote, Sparkles, HelpCircle } from 'lucide-react';
import { PrintableReport } from './PrintableReport.jsx';

function parseCaseInfo(rawText = '') {
  if (!rawText || typeof rawText !== 'string') {
    return {
      companyName: 'Pitch Case',
      stage: 'Seed / Series A',
      targetRaise: '$2.5M',
      sector: 'Enterprise Technology',
      summary: 'Automated due diligence review across market, competitor, financial, and risk dimensions.',
    };
  }

  const text = rawText.trim();
  let companyName = 'Startup Venture';
  const companyMatch = text.match(/(?:Company|Startup|Name|Project):\s*([^\n\r,]+)/i);
  if (companyMatch && companyMatch[1]) {
    companyName = companyMatch[1].trim();
  } else {
    const firstLine = text.split('\n')[0].trim();
    if (firstLine.length > 3 && firstLine.length < 45 && !firstLine.includes('.')) {
      companyName = firstLine.replace(/^(Company|Startup|Project):\s*/i, '');
    } else {
      const words = firstLine.split(' ');
      if (words.length > 5) {
        companyName = words.slice(0, 4).join(' ') + '...';
      } else {
        companyName = text.slice(0, 32).split(/[\n,.]/)[0].trim() || 'Startup Venture';
      }
    }
  }
  if (companyName.length > 36) {
    companyName = companyName.slice(0, 33).trim() + '...';
  }

  let stage = 'Seed / Series A';
  const stageMatch = text.match(/(?:Stage|Round):\s*([^\n\r]+)/i);
  if (stageMatch && stageMatch[1]) stage = stageMatch[1].trim();

  let targetRaise = '$2.5M';
  const raiseMatch = text.match(/\$[0-9.]+[MKBmkb]?/i);
  if (raiseMatch) targetRaise = raiseMatch[0].trim();

  let sector = 'Enterprise Technology';
  const sectorMatch = text.match(/(?:Sector|Industry|Category):\s*([^\n\r]+)/i);
  if (sectorMatch && sectorMatch[1]) {
    sector = sectorMatch[1].trim();
  } else if (/health|ehr|hipaa|medical/i.test(text)) {
    sector = 'Healthcare & AI Medicine';
  } else if (/supply chain|logistics|freight/i.test(text)) {
    sector = 'Supply Chain & Logistics';
  } else if (/crypto|identity|kyc/i.test(text)) {
    sector = 'Identity & Compliance';
  } else if (/gpu|compute|cloud/i.test(text)) {
    sector = 'AI Infrastructure';
  } else if (/fintech|payment|banking/i.test(text)) {
    sector = 'Fintech & Payments';
  }

  return { companyName, stage, targetRaise, sector };
}

// Renders text with **bold** markdown as real bold
function BoldText({ text = '' }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function DossierView({ verdict, debatePoints = [], currentCaseIdea, fullCaseData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const rawIdea = currentCaseIdea || fullCaseData?.idea || '';
  const meta = parseCaseInfo(rawIdea);

  const displayScore = verdict?.score != null ? Number(verdict.score).toFixed(1) : null;
  const scorePercent = displayScore ? Math.min(100, Math.max(0, Math.round(Number(displayScore) * 10))) : 0;
  const recommendation = verdict?.recommendation || null;
  const reasoning = verdict?.reasoning || null;

  const handleExportPDF = () => window.print();

  // Don't render anything if no verdict yet
  if (!verdict) return null;

  const scoreNum = parseFloat(displayScore);
  const isHighConviction = scoreNum >= 8;
  const isModerate = scoreNum >= 6 && scoreNum < 8;

  const scoreGradient = isHighConviction
    ? 'from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400'
    : isModerate
    ? 'from-amber-500 to-orange-500'
    : 'from-rose-500 to-red-500';

  const scoreBarColor = isHighConviction
    ? 'bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-500 shadow-[0_0_8px_#10b981]'
    : isModerate
    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
    : 'bg-gradient-to-r from-rose-400 to-red-500';

  const convictionLabel = isHighConviction ? 'HIGH CONVICTION' : isModerate ? 'MODERATE' : 'LOW CONVICTION';
  const convictionBadge = isHighConviction
    ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-500/40'
    : isModerate
    ? 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-500/40'
    : 'text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-500/40';

  // Get consensus and tension points from debatePoints
  const agreementPoints = debatePoints.filter((p) => p.agreement);
  const tensionPoints = debatePoints.filter((p) => !p.agreement);

  return (
    <>
      <section id="dossiers" className="print:hidden space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3 flex-wrap gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-telemetry-sm text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:to-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-cyan-400"></span> Diligence Summary
          </div>
          <h2 className="font-headline-lg text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight break-words">
            Investment Verdict: <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-cyan-400 dark:to-indigo-400">{meta.companyName}</span>
          </h2>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            type="button"
            onClick={handleExportPDF}
            className="px-3.5 py-1.5 bg-white dark:bg-white/5 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-300 dark:border-white/15 hover:border-rose-300 rounded-xl text-slate-700 dark:text-slate-200 hover:text-rose-700 text-[12px] font-bold inline-flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-rose-500" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 rounded-2xl p-5 sm:p-8 shadow-md relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* Left Col: Conviction Score */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-5 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/10 pb-6 lg:pb-0 lg:pr-8 min-w-0 overflow-hidden">
            <div className="space-y-5 min-w-0">
              {/* Company Badge */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-11 h-11 p-2 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-headline-lg font-extrabold text-lg shadow-md shrink-0">
                  {meta.companyName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="flex items-center gap-2 min-w-0">
                    <h3 className="font-headline-sm text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate" title={meta.companyName}>
                      {meta.companyName}
                    </h3>
                    <span className="bg-cyan-50 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 text-[9px] font-telemetry-sm font-extrabold px-2 py-0.5 rounded-full border border-cyan-200 dark:border-cyan-500/30 shrink-0">
                      ANALYSED
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 truncate">{meta.sector} · {meta.stage}</p>
                </div>
              </div>

              {/* Conviction Gauge */}
              <div className="bg-gradient-to-b from-slate-50 to-indigo-50/30 dark:from-white/5 dark:to-cyan-950/20 border border-indigo-100 dark:border-white/10 rounded-xl p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-telemetry-sm text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Conviction Score
                  </span>
                  <span className={`font-telemetry-sm text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${convictionBadge}`}>
                    {convictionLabel}
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className={`font-headline-lg text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${scoreGradient}`}>
                    {displayScore}
                  </span>
                  <span className="font-telemetry-sm text-slate-400 font-bold text-lg">/ 10.0</span>
                </div>
                <div className="w-full bg-slate-200/80 dark:bg-black/50 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`${scoreBarColor} h-full rounded-full transition-all duration-700`}
                    style={{ width: `${scorePercent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-telemetry-sm text-slate-500 dark:text-slate-400 pt-0.5 font-medium">
                  <span>Debate points: {debatePoints.length}</span>
                  <span>Verdict: {recommendation?.split(' ').slice(0, 2).join(' ')}</span>
                </div>
              </div>

              {/* Deal Metadata */}
              <div className="space-y-2 text-[12px] font-telemetry-sm">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Stage:</span>
                  <span className="text-slate-900 dark:text-slate-200 font-bold">{meta.stage}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Funding Target:</span>
                  <span className="text-indigo-600 dark:text-cyan-300 font-bold bg-indigo-50 dark:bg-white/5 px-2 py-0.5 rounded">{meta.targetRaise}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400 dark:text-slate-500 font-medium">Industry:</span>
                  <span className="text-cyan-700 dark:text-cyan-400 font-bold truncate max-w-[170px]">{meta.sector}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/15 text-cyan-300 text-[12px] font-bold font-telemetry-sm py-3 rounded-xl transition-all flex items-center justify-center space-x-2 border border-slate-800 dark:border-white/10 shadow-sm cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>View Raw Analysis Data</span>
            </button>
          </div>

          {/* Right Col: Actual Agent Findings & Debate Points */}
          <div className="lg:col-span-8 space-y-4 min-w-0">
            <div>
              <div className="font-telemetry-sm text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Executive Takeaways
              </div>
              <h4 className="font-headline-sm text-lg font-bold text-slate-900 dark:text-white">
                What the 4 Agents Discovered
              </h4>
            </div>

            {/* Real Debate / Consensus Points */}
            <div className="space-y-3">
              {agreementPoints.length > 0 && (
                <div className="border-l-4 border-l-emerald-500 bg-white dark:bg-[#070e22] border border-slate-200 dark:border-white/10 p-4 rounded-r-xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-telemetry-sm text-[12px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      Consensus: {agreementPoints[0].topic}
                    </span>
                    <span className="font-telemetry-sm text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/40 uppercase">
                      AGREED
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {agreementPoints[0].note}
                  </p>
                  {agreementPoints[0].agentsInvolved?.length > 0 && (
                    <div className="text-[10px] font-telemetry-sm text-slate-400 dark:text-slate-500">
                      Agents involved: {agreementPoints[0].agentsInvolved.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {tensionPoints.length > 0 && (
                <div className="border-l-4 border-l-amber-500 bg-white dark:bg-[#070e22] border border-slate-200 dark:border-white/10 p-4 rounded-r-xl shadow-sm space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-telemetry-sm text-[12px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Caution: {tensionPoints[0].topic}
                    </span>
                    <span className="font-telemetry-sm text-[10px] font-extrabold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-500/40 uppercase">
                      MONITOR
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                    {tensionPoints[0].note}
                  </p>
                  {tensionPoints[0].agentsInvolved?.length > 0 && (
                    <div className="text-[10px] font-telemetry-sm text-slate-400 dark:text-slate-500">
                      Agents flagging this: {tensionPoints[0].agentsInvolved.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Fallback if no debate points yet */}
              {debatePoints.length === 0 && (
                <div className="border-l-4 border-l-slate-300 dark:border-l-white/20 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-r-xl text-[13px] text-slate-500 dark:text-slate-400">
                  Agent synthesis in progress — debate points will appear here shortly.
                </div>
              )}
            </div>

            {/* Final Recommendation */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/40 dark:from-white/5 dark:to-cyan-950/20 border border-indigo-200/80 dark:border-white/10 p-4 sm:p-5 rounded-xl space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="font-telemetry-sm text-[11px] font-bold text-indigo-900 dark:text-cyan-300 uppercase tracking-wide flex items-center gap-1.5">
                  <Quote className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
                  Final Investment Recommendation
                </span>
                {recommendation && (
                  <span className="font-telemetry-sm text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30">
                    {recommendation}
                  </span>
                )}
              </div>
              {reasoning && (
                <p className="font-sans text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                  <BoldText text={reasoning} />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <TelemetryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={fullCaseData || { verdict, debatePoints, idea: currentCaseIdea }}
      />
    </section>

    {/* ── Structured Institutional Print / PDF Report ── */}
    <PrintableReport
      companyName={meta.companyName}
      sector={meta.sector}
      stage={meta.stage}
      raise={meta.targetRaise}
      score={displayScore || '8.0'}
      verdict={verdict}
      debatePoints={debatePoints}
      agentStates={fullCaseData?.agentStates || {}}
      idea={rawIdea}
    />
  </>
  );
}

