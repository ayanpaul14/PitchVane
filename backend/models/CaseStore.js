import mongoose from 'mongoose';
import Case from './Case.js';

// In-Memory Storage Cache fallback for offline / disconnected modes
const memoryStore = new Map();

export const CaseStore = {
  async createCase(data) {
    if (mongoose.connection.readyState === 1) {
      try {
        const doc = await Case.create(data);
        const obj = doc.toObject();
        obj._id = doc._id.toString();
        memoryStore.set(obj._id, obj);
        return obj;
      } catch (err) {
        console.warn('[CaseStore] MongoDB create failed, using memory cache:', err.message);
      }
    }

    const id = 'case_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newRecord = {
      _id: id,
      idea: data.idea,
      status: 'pending',
      findings: {
        market: { finding: '', confidence: 'medium', evidence: [], verdictTag: 'Pending' },
        competitor: { finding: '', confidence: 'medium', evidence: [], verdictTag: 'Pending' },
        financial: { finding: '', confidence: 'medium', evidence: [], verdictTag: 'Pending' },
        risk: { finding: '', confidence: 'medium', evidence: [], verdictTag: 'Pending' },
      },
      debatePoints: [],
      verdict: null,
      metrics: { latencyMs: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.set(id, newRecord);
    return newRecord;
  },

  async updateCase(id, updateData) {
    let updatedObj = null;

    if (mongoose.connection.readyState === 1 && !id.startsWith('case_')) {
      try {
        const doc = await Case.findByIdAndUpdate(id, updateData, { new: true });
        if (doc) updatedObj = doc.toObject();
      } catch (err) {
        console.warn('[CaseStore] MongoDB update failed, fallback to memory:', err.message);
      }
    }

    const existing = memoryStore.get(id) || { _id: id };
    const merged = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    memoryStore.set(id, merged);
    return updatedObj || merged;
  },

  async findCaseById(id) {
    if (mongoose.connection.readyState === 1 && !id.startsWith('case_')) {
      try {
        const doc = await Case.findById(id);
        if (doc) return doc.toObject();
      } catch (err) {
        console.warn('[CaseStore] MongoDB findById failed:', err.message);
      }
    }
    return memoryStore.get(id) || null;
  },

  async findAllCases({ limit = 50 } = {}) {
    if (mongoose.connection.readyState === 1) {
      try {
        const docs = await Case.find({}).sort({ createdAt: -1 }).limit(limit).lean();
        return docs;
      } catch (err) {
        console.warn('[CaseStore] MongoDB findAll failed, using memory cache:', err.message);
      }
    }
    // In-memory fallback: return all stored cases sorted by createdAt desc
    const all = Array.from(memoryStore.values());
    all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return all.slice(0, limit);
  },
};
