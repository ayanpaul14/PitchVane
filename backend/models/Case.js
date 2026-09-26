import mongoose from 'mongoose';

const FindingSubSchema = new mongoose.Schema(
  {
    finding: { type: String, default: '' },
    confidence: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    evidence: [{ type: String }],
    verdictTag: { type: String, default: 'Neutral' },
    groundingFailed: { type: Boolean, default: false },
  },
  { _id: false }
);

const CaseSchema = new mongoose.Schema(
  {
    idea: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'running', 'done', 'failed'],
      default: 'pending',
    },
    findings: {
      market: { type: FindingSubSchema, default: () => ({}) },
      competitor: { type: FindingSubSchema, default: () => ({}) },
      financial: { type: FindingSubSchema, default: () => ({}) },
      risk: { type: FindingSubSchema, default: () => ({}) },
    },
    debatePoints: [
      {
        topic: String,
        agreement: Boolean,
        agentsInvolved: [String],
        note: String,
      },
    ],
    verdict: {
      score: { type: Number, min: 0, max: 10, default: null },
      recommendation: { type: String, default: null },
      reasoning: { type: String, default: null },
    },
    metrics: {
      retrievalRelevanceAvg: Number,
      fallbackRate: Number,
      latencyMs: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Case || mongoose.model('Case', CaseSchema);
