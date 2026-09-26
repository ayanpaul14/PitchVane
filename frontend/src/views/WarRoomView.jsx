import { useRef, useEffect } from 'react';
import { CaseIntakeForm } from '../components/CaseIntakeForm.jsx';
import { AgentGrid } from '../components/AgentGrid.jsx';
import { DossierView } from '../components/DossierView.jsx';
import { Activity, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

export function WarRoomView({
  onStartAnalysis,
  loading,
  fetchError,
  socketError,
  agentStates,
  verdict,
  debatePoints,
  currentCaseIdea,
  fullCaseData,
  isConnected,
  onViewInDealFlow,
}) {
  const agentsRef = useRef(null);
  const allDone = agentStates && Object.values(agentStates).length > 0 && Object.values(agentStates).every((a) => a.status === 'done');
  const isAnalyzing = agentStates && Object.values(agentStates).some((a) => a.status === 'running');

  // Auto-scroll to Agents section when analysis starts (loading or running)
  useEffect(() => {
    if (loading || isAnalyzing) {
      if (agentsRef.current) {
        agentsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [loading, isAnalyzing]);

  return (
    <div className="space-y-8 sm:space-y-12 animate-in fade-in duration-200">
      {/* War Room Dedicated Header & Live Telemetry Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-[#050914] dark:via-[#0c142b] dark:to-[#050914] border border-indigo-500/20 dark:border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl text-white relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="font-telemetry-sm text-[11px] font-extrabold uppercase tracking-widest text-cyan-400">
                Live Analysis
              </span>
            </div>
            <h2 className="font-headline-lg text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              AI Due Diligence War Room
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed font-sans font-light">
              Describe your startup below. Our AI covers market size, competitors, financials, and risks — with real-world data and named examples, not generic advice.
            </p>
          </div>

          {/* Telemetry Status Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 font-telemetry-sm text-[11px]">
            <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 flex items-center gap-2 backdrop-blur-md">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
              <span className="text-slate-200">Socket: {isConnected ? 'Streaming' : 'Connecting'}</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 flex items-center gap-2 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              <span className="text-slate-200">Team: 4 Agents Active</span>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/10 flex items-center gap-2 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-orange-400"></span>
              <span className="text-slate-200">AI Engine: Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Case Intake Form */}
      <CaseIntakeForm onSubmit={onStartAnalysis} loading={loading} />

      {/* Error Notification */}
      {(fetchError || socketError) && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-300 rounded-2xl text-xs font-telemetry-sm flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
          <span>Error: {fetchError || socketError}</span>
        </div>
      )}

      {/* 4 Agent War Room Showcase Grid */}
      <div ref={agentsRef} className="space-y-4 scroll-mt-6">
        <AgentGrid agentStates={agentStates} />
      </div>

      {/* Reconciled Dossier View & Scorecard */}
      <DossierView
        verdict={verdict}
        debatePoints={debatePoints}
        currentCaseIdea={currentCaseIdea}
        fullCaseData={fullCaseData}
      />

      {/* "View in Deal Flow" CTA — shown after full analysis completes */}
      {verdict && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-950/40 dark:to-cyan-950/20 border border-indigo-200 dark:border-white/10 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </span>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-sm">Analysis Complete — Case Added to Pipeline</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-telemetry-sm mt-0.5">View this deal in your Deal Flow board, or run a new analysis.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onViewInDealFlow}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
          >
            View in Deal Flow
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
