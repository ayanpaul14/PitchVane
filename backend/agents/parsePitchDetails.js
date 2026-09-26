export function parsePitchDetails(rawText = '') {
  if (!rawText || typeof rawText !== 'string') {
    return {
      companyName: 'Startup Case',
      stage: 'Seed / Series A',
      targetRaise: '$2.5M - $5M',
      sector: 'Technology & Software',
      cleanSummary: 'Early-stage venture opportunity under diligence review.',
    };
  }

  const text = rawText.trim();

  // Extract Company Name
  let companyName = 'Startup Venture';
  const companyMatch = text.match(/(?:Company|Startup|Name):\s*([^\n\r,]+)/i);
  if (companyMatch && companyMatch[1]) {
    companyName = companyMatch[1].trim();
  } else {
    // Try to take the first 3-5 words if it looks like a title
    const firstLine = text.split('\n')[0].trim();
    if (firstLine.length > 3 && firstLine.length < 50 && !firstLine.includes('.')) {
      companyName = firstLine.replace(/^(Company|Startup):\s*/i, '');
    } else {
      companyName = text.slice(0, 32).split(/[\n,.]/)[0].trim() || 'Startup Venture';
    }
  }

  // Extract Stage
  let stage = 'Seed / Series A';
  const stageMatch = text.match(/(?:Stage|Round):\s*([^\n\r]+)/i);
  if (stageMatch && stageMatch[1]) {
    stage = stageMatch[1].trim();
  } else if (/series\s+[a-c]/i.test(text)) {
    const s = text.match(/series\s+[a-c]/i);
    stage = s ? s[0].toUpperCase() : 'Series A';
  } else if (/seed/i.test(text)) {
    stage = 'Seed Round';
  }

  // Extract Target Raise / Valuation
  let targetRaise = '$2.5M';
  const raiseMatch = text.match(/(?:\$([0-9.]+[MKB]?)|(?:Raise|Target|Valuation):\s*([^\n\r]+))/i);
  if (raiseMatch) {
    targetRaise = raiseMatch[0].trim();
  }

  // Extract Sector
  let sector = 'Technology & Software';
  const sectorMatch = text.match(/(?:Sector|Industry|Category):\s*([^\n\r]+)/i);
  if (sectorMatch && sectorMatch[1]) {
    sector = sectorMatch[1].trim();
  } else if (/health|ehr|hipaa|medical|clinical/i.test(text)) {
    sector = 'Healthcare & AI Medicine';
  } else if (/supply chain|logistics|freight|fleet/i.test(text)) {
    sector = 'Supply Chain & Fleet Intelligence';
  } else if (/crypto|identity|zero-knowledge|kyc|web3/i.test(text)) {
    sector = 'Identity & Compliance';
  } else if (/gpu|compute|cloud|infrastructure/i.test(text)) {
    sector = 'AI Infrastructure & Cloud';
  } else if (/fintech|payment|fx|treasury|bank/i.test(text)) {
    sector = 'Fintech & Payments';
  }

  // Clean Summary
  let cleanSummary = text.replace(/^(Company|Stage|Sector|Target Raise):[^\n]*\n?/gim, '').trim();
  if (cleanSummary.length > 180) {
    cleanSummary = cleanSummary.slice(0, 180) + '...';
  }

  return {
    companyName,
    stage,
    targetRaise,
    sector,
    cleanSummary,
  };
}
