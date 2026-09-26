export const AGENT_JSON_SCHEMA_INSTRUCTION = `
You must reply ONLY in valid JSON matching this exact structure. Do NOT include any markdown, code fences, or explanation outside the JSON.
{
  "finding": "A direct, plain-English analysis written in 3-5 bullet points. Each bullet must start with a bold label (e.g., **Market Size:**) followed by a specific, real-world fact or data point. Use actual company names, real percentage figures, and named industry reports where possible. Avoid vague claims. Write as if explaining to a smart non-technical founder.",
  "confidence": "high",
  "evidence": ["Source label 1", "Source label 2"],
  "verdictTag": "One of: Strong Positive | Cautiously Optimistic | High Risk | Critical Flaw"
}
`;

export const SYNTHESIZER_JSON_SCHEMA_INSTRUCTION = `
You must reply ONLY in valid JSON matching this exact structure. Do NOT include any markdown, code fences, or explanation outside the JSON.
{
  "debatePoints": [
    {
      "topic": "Short title of the consensus or conflict (e.g. 'Revenue Model Viability')",
      "agreement": true,
      "agentsInvolved": ["market", "financial"],
      "note": "One specific, actionable sentence summarizing what agents agreed or disagreed on — include real numbers or named factors."
    }
  ],
  "verdict": {
    "score": 7.8,
    "recommendation": "Invest / Proceed to Alpha / Pivot / Pass",
    "reasoning": "3-5 sentences of plain-English executive summary. Reference specific agent findings (market size, margins, risks). Give a clear action for investors. Avoid jargon."
  }
}
`;
