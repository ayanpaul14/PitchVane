import React from 'react';

export function SocialProofTicker() {
  const funds = [
    { name: 'NEXUS VENTURES', icon: 'token' },
    { name: 'APEX SYNDICATE', icon: 'diamond' },
    { name: 'CYPHER CAPITAL', icon: 'deployed_code' },
    { name: 'FOUNDRY ALLIANCE', icon: 'account_balance' },
    { name: 'PARALLEL FUND', icon: 'layers' },
  ];

  return (
    <section className="space-y-4 pt-4">
      <div className="text-center space-y-1">
        <div className="font-telemetry-sm text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Deployed Across Top-Tier Institutional Capital
        </div>
        <div className="text-sm text-slate-500">
          Over $1.4B in aggregate venture deal flow processed through Pitchvane multi-agent pipelines
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 pt-2">
        {funds.map((fund, idx) => (
          <div
            key={idx}
            className={`${
              idx === 4 ? 'col-span-2 md:col-span-1' : ''
            } bg-white border border-slate-200 rounded-md py-3.5 px-4 flex items-center justify-center space-x-2 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-2xs transition-all`}
          >
            <span className="material-symbols-outlined text-[18px] text-slate-500">{fund.icon}</span>
            <span className="font-headline-sm text-[12px] font-bold tracking-wider">{fund.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
