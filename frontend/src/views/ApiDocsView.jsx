import { useState } from 'react';
import { API_BASE_URL } from '../config';

const CODE_EXAMPLES = {
  javascript: `// Initialize Socket.io client
import { io } from 'socket.io-client';

const socket = io('${API_BASE_URL}');

// 1. Submit pitch for autonomous due diligence
const response = await fetch('${API_BASE_URL}/api/cases', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    idea: 'Decentralized ZK-identity verification for Tier-1 banks.'
  })
});

const { caseId } = await response.json();

// 2. Subscribe to real-time agent telemetry stream
socket.emit('join:case', caseId);

socket.on('agent:step', ({ agent, step, detail }) => {
  console.log(\`[\${agent}] \${step}: \${detail}\`);
});

socket.on('report:ready', ({ verdict }) => {
  console.log('Final Score:', verdict.score, verdict.recommendation);
});`,
  python: `import requests
import socketio

sio = socketio.Client()
sio.connect('${API_BASE_URL}')

# 1. Initiate case run
res = requests.post('${API_BASE_URL}/api/cases', json={
    'idea': 'Decentralized ZK-identity verification for Tier-1 banks.'
})
case_id = res.json()['caseId']

# 2. Listen to multi-agent analysis events
sio.emit('join:case', case_id)

@sio.on('agent:done')
def on_agent_done(data):
    print(f"Agent {data['agent']} finished with finding:", data['finding'])

@sio.on('report:ready')
def on_report_ready(data):
    print("Synthesized Verdict:", data['verdict'])`,
  curl: `# 1. Create a due diligence case
curl -X POST ${API_BASE_URL}/api/cases \\
  -H "Content-Type: application/json" \\
  -d '{"idea":"Decentralized ZK-identity verification for Tier-1 banks."}'

# 2. Query case report status (Polling Fallback)
curl ${API_BASE_URL}/api/cases/67634f19bc32a90014b2d184/report`,
};

export function ApiDocsView() {
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[selectedLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="font-telemetry-sm text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span> API Reference
          </div>
          <h2 className="font-headline-lg text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Programmatic Intelligence API
          </h2>
          <span className="text-xs font-telemetry-sm text-slate-500 dark:text-slate-400">
            REST Endpoints &amp; WebSocket Stream Protocol v2.4
          </span>
        </div>
        <div className="mt-3 md:mt-0 font-telemetry-sm text-xs bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full border border-cyan-200 dark:border-cyan-800 font-bold">
          Base URL: {API_BASE_URL}
        </div>
      </div>

      {/* 2-Column Docs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: API Endpoints Table & Schema */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-headline-sm text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-indigo-600 dark:text-indigo-400">api</span>
              REST Core Endpoints
            </h4>

            <div className="space-y-3 font-telemetry-sm text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">POST</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">/api/cases</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Submits a startup idea or pitch document and triggers the 4-agent research workflow.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-bold text-[10px]">GET</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">/api/cases/:id</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Fetches current case status (pending, running, done, failed).
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 font-bold text-[10px]">GET</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">/api/cases/:id/report</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Retrieves the finalized synthesis dossier, debate points, and 0–10 score.
                </p>
              </div>
            </div>
          </div>

          {/* WebSocket Contract Card */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <h4 className="font-headline-sm text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-cyan-600 dark:text-cyan-400">sync_alt</span>
              Socket.IO Event Stream Contract
            </h4>

            <div className="space-y-2 text-xs font-telemetry-sm">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-cyan-700 dark:text-cyan-400">agent:start</span>
                <span className="text-slate-500 dark:text-slate-400">{'{ caseId, agent }'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-cyan-700 dark:text-cyan-400">agent:step</span>
                <span className="text-slate-500 dark:text-slate-400">{'{ caseId, agent, step, detail }'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-cyan-700 dark:text-cyan-400">agent:done</span>
                <span className="text-slate-500 dark:text-slate-400">{'{ caseId, agent, finding }'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-indigo-700 dark:text-indigo-400">synthesis:point</span>
                <span className="text-slate-500 dark:text-slate-400">{'{ caseId, topic, agreement, note }'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="font-bold text-emerald-700 dark:text-emerald-400">report:ready</span>
                <span className="text-slate-500 dark:text-slate-400">{'{ caseId, verdict, report }'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Code Snippets */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            {/* Lang Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-telemetry-sm text-xs">
                {['javascript', 'python', 'curl'].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setSelectedLang(lang)}
                    className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-colors cursor-pointer ${
                      selectedLang === lang ? 'bg-slate-800 text-cyan-400 border border-slate-700' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-telemetry-sm flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">
                  {copied ? 'check' : 'content_copy'}
                </span>
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Block */}
            <pre className="font-telemetry-sm text-xs text-cyan-300 p-2 overflow-x-auto leading-relaxed max-h-96 overflow-y-auto">
              {CODE_EXAMPLES[selectedLang]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}