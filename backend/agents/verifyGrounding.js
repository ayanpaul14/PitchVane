export function verifyGrounding(agentOutput, validRetrievedIds = []) {
  if (!agentOutput || !Array.isArray(agentOutput.evidence)) {
    return { ...agentOutput, confidence: 'low', groundingFailed: true };
  }

  const validSet = new Set(validRetrievedIds);
  const ungrounded = agentOutput.evidence.filter((id) => !validSet.has(id));

  if (ungrounded.length > 0 && validRetrievedIds.length > 0) {
    console.warn(`[Grounding Warning] Hallucinated IDs detected: ${ungrounded.join(', ')}`);
    return {
      ...agentOutput,
      confidence: 'low',
      groundingFailed: true,
      evidence: agentOutput.evidence.filter((id) => validSet.has(id)),
    };
  }

  return {
    ...agentOutput,
    groundingFailed: false,
  };
}
