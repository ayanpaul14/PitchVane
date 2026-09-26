import React from 'react';

// Formats **bold** markdown cleanly
function BoldText({ text = '' }) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-bold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function PrintableReport({
  companyName = 'Investment Opportunity',
  sector = 'Technology & AI',
  stage = 'Seed / Series A',
  raise = '$2.5M',
  score = '8.0',
  verdict = {},
  debatePoints = [],
  agentStates = {},
  idea = '',
}) {
  const scoreNum = parseFloat(score) || 8.0;
  const recommendation = verdict?.recommendation || 'Recommended for Investment';
  const reasoning = verdict?.reasoning || 'Autonomous multi-agent diligence completed.';

  const isHighConviction = scoreNum >= 8;
  const isModerate = scoreNum >= 6 && scoreNum < 8;

  const convictionLabel = isHighConviction
    ? 'HIGH CONVICTION (PROCEED TO TERM SHEET)'
    : isModerate
    ? 'MODERATE CONVICTION (REVISE TERMS / CONDITIONAL)'
    : 'LOW CONVICTION (PASS / MONITOR)';

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const agreementPoints = debatePoints.filter((p) => p.agreement);
  const tensionPoints = debatePoints.filter((p) => !p.agreement);

  return (
    <div className="hidden print:block font-sans text-slate-900 bg-white p-2 max-w-4xl mx-auto leading-normal">
      {/* ── 1. INSTITUTIONAL MASTHEAD ── */}
      <div className="border-b-2 border-slate-900 pb-3 mb-6">
        <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-slate-500 mb-1">
          <span>PitchVane Autonomous Intelligence Engine</span>
          <span>Confidential &amp; Proprietary</span>
        </div>
        <div className="flex justify-between items-baseline">
          <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase font-mono">
            Investment Committee Memorandum
          </h1>
          <span className="text-xs font-mono text-slate-600 font-semibold">{currentDate}</span>
        </div>
      </div>

      {/* ── 2. DEAL OVERVIEW & CONVICTION SCORE ── */}
      <div className="mb-6 border border-slate-300 rounded-lg p-5 bg-slate-50/50 break-inside-avoid">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="text-xs font-mono uppercase text-slate-500 font-semibold tracking-wider">
              Target Company
            </div>
            <h2 className="text-2xl font-bold text-slate-900 leading-tight">
              {companyName}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 pt-1 font-medium">
              <span><strong>Sector:</strong> {sector}</span>
              <span><strong>Round Stage:</strong> {stage}</span>
              <span><strong>Target Raise:</strong> {raise}</span>
            </div>
          </div>

          {/* Conviction Score Card */}
          <div className="border-2 border-slate-900 rounded-lg p-3 text-center min-w-[140px] bg-white shadow-xs shrink-0">
            <div className="text-[10px] font-mono uppercase font-bold text-slate-500 tracking-wider">
              Conviction Score
            </div>
            <div className="text-3xl font-black text-slate-900 my-0.5">
              {scoreNum.toFixed(1)} <span className="text-sm font-normal text-slate-500">/ 10</span>
            </div>
            <div className="text-[9px] font-mono uppercase font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
              {isHighConviction ? 'STRONG BUY' : isModerate ? 'CAUTIOUS' : 'PASS'}
            </div>
          </div>
        </div>

        {/* Strategic Verdict Banner */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase font-bold text-slate-600">Committee Recommendation:</span>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              {recommendation} ({convictionLabel})
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed italic">
            "{reasoning}"
          </p>
        </div>
      </div>

      {/* ── 3. EXECUTIVE THESIS & PROBLEM STATEMENT ── */}
      {idea && (
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-mono uppercase font-bold tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
            1. Pitch &amp; Core Value Proposition
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3 border border-slate-200 rounded">
            {idea}
          </p>
        </div>
      )}

      {/* ── 4. STRENGTHS & RISKS MATRIX ── */}
      <div className="mb-6 grid grid-cols-2 gap-4 break-inside-avoid">
        {/* Bull Case */}
        <div className="border border-slate-300 rounded-lg p-4 bg-white">
          <h4 className="text-xs font-mono uppercase font-bold text-emerald-800 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
            <span>●</span> Key Investment Catalysts (Bull Case)
          </h4>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
            {agreementPoints.length > 0 ? (
              agreementPoints.map((pt, i) => (
                <li key={i}>
                  <strong>{pt.topic}:</strong> {pt.note || 'Validated across agent consensus.'}
                </li>
              ))
            ) : (
              <>
                <li>Significant defensibility potential via specialized proprietary domain data.</li>
                <li>Favorable customer unit economics with scalable recurring revenue profile.</li>
                <li>Expansion opportunities into adjacent regulated or high-value enterprise markets.</li>
              </>
            )}
          </ul>
        </div>

        {/* Bear Case / Risks */}
        <div className="border border-slate-300 rounded-lg p-4 bg-white">
          <h4 className="text-xs font-mono uppercase font-bold text-rose-800 border-b border-slate-200 pb-1 mb-2 flex items-center gap-1.5">
            <span>▲</span> Downside Risks &amp; Critical Vulnerabilities
          </h4>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
            {tensionPoints.length > 0 ? (
              tensionPoints.map((pt, i) => (
                <li key={i}>
                  <strong>{pt.topic}:</strong> {pt.note || 'Identified as a critical point of friction during review.'}
                </li>
              ))
            ) : (
              <>
                <li>Aggressive retaliatory pricing from incumbent market leaders.</li>
                <li>Execution friction and elongated enterprise sales procurement cycles.</li>
                <li>Underestimated customer acquisition costs prior to achieving scale.</li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* ── 5. DETAILED SPECIALIST AGENT FINDINGS ── */}
      <div className="mb-6 space-y-4">
        <h3 className="text-xs font-mono uppercase font-bold tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1">
          2. Autonomous Specialist Due Diligence Findings
        </h3>

        {/* Market & Moat Analysis */}
        {agentStates.market?.finding?.finding && (
          <div className="border border-slate-200 rounded-lg p-4 bg-white break-inside-avoid">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase font-mono">
                A. Market Sizing &amp; Competitive Moat
              </h5>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Agent: MarketAnalyst
              </span>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed space-y-1.5">
              {agentStates.market.finding.finding.split('\n').filter(Boolean).map((line, i) => (
                <p key={i}>
                  <BoldText text={line} />
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Competitor Analysis */}
        {agentStates.competitor?.finding?.finding && (
          <div className="border border-slate-200 rounded-lg p-4 bg-white break-inside-avoid">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase font-mono">
                B. Competitive Landscape &amp; Barriers to Entry
              </h5>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Agent: CompetitorScout
              </span>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed space-y-1.5">
              {agentStates.competitor.finding.finding.split('\n').filter(Boolean).map((line, i) => (
                <p key={i}>
                  <BoldText text={line} />
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Financial Model */}
        {agentStates.financial?.finding?.finding && (
          <div className="border border-slate-200 rounded-lg p-4 bg-white break-inside-avoid">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase font-mono">
                C. Financial Model, Unit Economics &amp; Runway
              </h5>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Agent: FinancialModeler
              </span>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed space-y-1.5">
              {agentStates.financial.finding.finding.split('\n').filter(Boolean).map((line, i) => (
                <p key={i}>
                  <BoldText text={line} />
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Devil's Advocate / Risk Assessment */}
        {agentStates.risk?.finding?.finding && (
          <div className="border border-slate-200 rounded-lg p-4 bg-white break-inside-avoid">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase font-mono">
                D. Devil's Advocate Critique &amp; Vulnerability Audit
              </h5>
              <span className="text-[10px] font-mono text-slate-500 uppercase">
                Agent: DevilsAdvocate
              </span>
            </div>
            <div className="text-xs text-slate-700 leading-relaxed space-y-1.5">
              {agentStates.risk.finding.finding.split('\n').filter(Boolean).map((line, i) => (
                <p key={i}>
                  <BoldText text={line} />
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── 6. COMMITTEE DEBATE & DELIBERATION LOG ── */}
      {debatePoints.length > 0 && (
        <div className="mb-6 break-inside-avoid">
          <h3 className="text-xs font-mono uppercase font-bold tracking-wider text-slate-900 border-b-2 border-slate-900 pb-1 mb-3">
            3. Multi-Agent Debate &amp; Arbitration Record
          </h3>
          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-mono text-[10px] uppercase">
                  <th className="py-2 px-3">Dimension</th>
                  <th className="py-2 px-3">Alignment</th>
                  <th className="py-2 px-3">Deliberation &amp; Resolution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {debatePoints.map((pt, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="py-2 px-3 font-semibold text-slate-900">{pt.topic}</td>
                    <td className="py-2 px-3 font-mono text-[10px]">
                      {pt.agreement ? (
                        <span className="text-emerald-700 font-bold uppercase">Consensus</span>
                      ) : (
                        <span className="text-rose-700 font-bold uppercase">Tension</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-slate-600">{pt.note || 'Synthesized across agent findings.'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── 7. INSTITUTIONAL SIGN-OFF & DISCLAIMER ── */}
      <div className="pt-4 border-t border-slate-300 text-[10px] text-slate-500 space-y-1 font-mono break-inside-avoid">
        <div className="flex justify-between items-center font-bold text-slate-700 uppercase">
          <span>Prepared by PitchVane IC Engine v2.4</span>
          <span>Security Classification: Strictly Confidential</span>
        </div>
        <p>
          Disclaimer: This memorandum is generated autonomously by autonomous intelligence agents for institutional due diligence and internal analysis only. It does not constitute a public offer or financial solicitation.
        </p>
      </div>
    </div>
  );
}
