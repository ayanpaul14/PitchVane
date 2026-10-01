import express from 'express';
import { CaseStore } from '../models/CaseStore.js';
import { executePitchGraph } from '../graph/pitchvaneGraph.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pitchvane_enterprise_jwt_secret_key_2026_secure';

// Soft auth — extracts userId if token present, but never blocks the request
function extractUserId(req) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id || null;
  } catch {
    return null;
  }
}

export function createCaseRouter(io) {
  const router = express.Router();

  // List Cases — filtered by the authenticated user
  router.get('/', async (req, res) => {
    try {
      const userId = extractUserId(req);
      const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
      const cases = await CaseStore.findAllCases({ limit, userId });
      res.json({ cases });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Aggregate Stats — filtered by the authenticated user
  router.get('/stats', async (req, res) => {
    try {
      const userId = extractUserId(req);
      const cases = await CaseStore.findAllCases({ limit: 1000, userId });
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

  // Create Case & Launch Graph — attach userId to the case
  router.post('/', async (req, res) => {
    try {
      const { idea } = req.body;
      if (!idea || idea.trim().length < 10) {
        return res.status(400).json({ error: 'Pitch/idea must be at least 10 characters long.' });
      }

      const userId = extractUserId(req);
      const newCase = await CaseStore.createCase({ idea, userId });
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
