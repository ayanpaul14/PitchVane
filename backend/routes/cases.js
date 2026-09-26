import express from 'express';
import { CaseStore } from '../models/CaseStore.js';
import { executePitchGraph } from '../graph/pitchvaneGraph.js';

export function createCaseRouter(io) {
  const router = express.Router();

  // List All Cases (History)
  router.get('/', async (req, res) => {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
      const cases = await CaseStore.findAllCases({ limit });
      res.json({ cases });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Aggregate Stats
  router.get('/stats', async (req, res) => {
    try {
      const cases = await CaseStore.findAllCases({ limit: 1000 });
      const total = cases.length;
      const done = cases.filter((c) => c.status === 'done').length;
      const avgScore = done > 0
        ? (cases.filter((c) => c.verdict?.score != null).reduce((sum, c) => sum + (c.verdict?.score || 0), 0) / Math.max(done, 1)).toFixed(1)
        : null;
      res.json({ total, done, avgScore });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Create Case & Launch Graph
  router.post('/', async (req, res) => {
    try {
      const { idea } = req.body;
      if (!idea || idea.trim().length < 10) {
        return res.status(400).json({ error: 'Pitch/idea must be at least 10 characters long.' });
      }

      const newCase = await CaseStore.createCase({ idea });
      const caseId = newCase._id.toString();

      // Trigger LangGraph asynchronously
      executePitchGraph(caseId, idea, io).catch((err) =>
        console.error(`Async execution failed for case ${caseId}:`, err)
      );

      res.status(202).json({ caseId, status: 'pending' });
    } catch (err) {
      console.error('Case creation error:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Get Case Status (Polling Fallback)
  router.get('/:id', async (req, res) => {
    try {
      const caseItem = await CaseStore.findCaseById(req.params.id);
      if (!caseItem) return res.status(404).json({ error: 'Case not found' });
      res.json(caseItem);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get Final Report Dossier
  router.get('/:id/report', async (req, res) => {
    try {
      const caseItem = await CaseStore.findCaseById(req.params.id);
      if (!caseItem) return res.status(404).json({ error: 'Case not found' });
      res.json({
        id: caseItem._id,
        idea: caseItem.idea,
        findings: caseItem.findings,
        debatePoints: caseItem.debatePoints,
        verdict: caseItem.verdict,
        metrics: caseItem.metrics,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  return router;
}
