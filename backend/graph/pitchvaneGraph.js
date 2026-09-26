import { runMarketAnalyst } from '../agents/marketAnalyst.js';
import { runCompetitorScout } from '../agents/competitorScout.js';
import { runFinancialModeler } from '../agents/financialModeler.js';
import { runRiskAssessor } from '../agents/riskAssessor.js';
import { runSynthesizer } from '../agents/synthesizer.js';
import { CaseStore } from '../models/CaseStore.js';

export async function executePitchGraph(caseId, idea, io) {
  const emitToRoom = (event, payload) => {
    if (io) io.to(caseId).emit(event, { caseId, ...payload });
  };

  try {
    const startTime = Date.now();
    await CaseStore.updateCase(caseId, { status: 'running' });

    // 1. Parallel Agent Execution
    const runAgentWithEvents = async (name, runner) => {
      emitToRoom('agent:start', { agent: name });
      const finding = await runner(idea, (step, detail) => {
        emitToRoom('agent:step', { agent: name, step, detail });
      });
      emitToRoom('agent:done', { agent: name, finding });
      return finding;
    };

    const [market, competitor, financial, risk] = await Promise.all([
      runAgentWithEvents('market', runMarketAnalyst),
      runAgentWithEvents('competitor', runCompetitorScout),
      runAgentWithEvents('financial', runFinancialModeler),
      runAgentWithEvents('risk', runRiskAssessor),
    ]);

    const findings = { market, competitor, financial, risk };

    // 2. Synthesis & Fan-in
    const synthesisResult = await runSynthesizer(idea, findings, (point) => {
      emitToRoom('synthesis:point', point);
    });

    const latencyMs = Date.now() - startTime;

    // 3. Persist Final Dossier
    const updatedCase = await CaseStore.updateCase(caseId, {
      status: 'done',
      findings,
      debatePoints: synthesisResult.debatePoints,
      verdict: synthesisResult.verdict,
      'metrics.latencyMs': latencyMs,
    });

    emitToRoom('report:ready', { verdict: synthesisResult.verdict, report: updatedCase });
    return updatedCase;
  } catch (error) {
    console.error(`[Graph Error in Case ${caseId}]:`, error);
    await CaseStore.updateCase(caseId, { status: 'failed' });
    emitToRoom('case:error', { stage: 'orchestration', message: error.message });
    throw error;
  }
}
