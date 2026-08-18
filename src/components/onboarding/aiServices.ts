/**
 * AI Generation Service layer for Rixly Onboarding Flow.
 * Isolated from the UI components so it can be easily replaced or hooked up
 * to a real backend AI endpoint / LLM API later.
 */

export async function generateProductDescription(
  url: string, 
  industries: string[] = []
): Promise<string> {
  // Simulate network/AI response delay
  await new Promise(resolve => setTimeout(resolve, 850));

  const lowerUrl = url.toLowerCase();
  const indString = industries.join(' ').toLowerCase();

  if (lowerUrl.includes('cargo') || lowerUrl.includes('logistic') || indString.includes('logistics') || indString.includes('freight')) {
    return 'Autonomous B2B supply chain intelligence platform that captures real-time freight signals, port congestion discussions, and dispatcher requirements across social channels to generate high-intent outbound sales leads.';
  }

  if (lowerUrl.includes('saas') || lowerUrl.includes('crm') || indString.includes('saas') || indString.includes('cloud')) {
    return 'AI-powered social intent listening engine designed for modern B2B SaaS teams to find active buyers on LinkedIn and Reddit looking for software recommendations and workflow automation.';
  }

  if (lowerUrl.includes('fintech') || indString.includes('fintech') || indString.includes('bank')) {
    return 'Next-generation financial operations platform that provides seamless transaction workflows and compliance monitoring for high-growth tech enterprises.';
  }

  return 'AI-driven social listening & buyer intent discovery platform that scans Reddit conversations and LinkedIn discussions to find qualified leads actively seeking solutions in real time.';
}

export async function generateICPs(
  description: string, 
  currentIcps: string[] = []
): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 900));

  const desc = description.toLowerCase();
  let suggestions = [
    'SaaS Founders',
    'B2B Marketing Leaders',
    'VP of Sales',
    'Head of Growth',
    'Agency Owners'
  ];

  if (desc.includes('supply chain') || desc.includes('freight') || desc.includes('logistics') || desc.includes('port')) {
    suggestions = [
      'VP of Supply Chain & Operations',
      'Global Freight & Logistics Directors',
      'Freight Forwarding CEOs',
      'Fleet Operations Managers',
      'Demand Gen Leaders for Logistics'
    ];
  } else if (desc.includes('finance') || desc.includes('banking') || desc.includes('compliance')) {
    suggestions = [
      'Chief Financial Officers',
      'VP of Compliance & Risk',
      'Fintech Product Directors',
      'Head of Treasury Operations'
    ];
  }

  // Non-destructive: Filter out already existing ICPs
  const uniqueNewSuggestions = suggestions.filter(s => !currentIcps.includes(s));
  return uniqueNewSuggestions.length > 0 ? uniqueNewSuggestions : ['Enterprise Growth Leaders', 'Revenue Operations Directors'];
}

export async function generateValueProps(
  description: string, 
  icps: string[] = [], 
  currentProps: string[] = []
): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 950));

  const desc = `${description} ${icps.join(' ')}`.toLowerCase();
  let suggestions = [
    'Real-time intent detection across LinkedIn and Reddit',
    'Replaces cold outreach with warm social trigger signals',
    '4x higher response rates than generic email campaigns',
    'Instant CRM pipeline synchronization with auto-scoring'
  ];

  if (desc.includes('supply chain') || desc.includes('freight') || desc.includes('logistics') || desc.includes('operations')) {
    suggestions = [
      'Zero-setup real-time port and freight trigger detection',
      'Connect directly with dispatchers discussing manifest delays',
      'Turn social complaints into qualified enterprise sales opportunities',
      'Integrated outbound multi-channel outreach engine'
    ];
  }

  const uniqueNewSuggestions = suggestions.filter(s => !currentProps.includes(s));
  return uniqueNewSuggestions.length > 0 ? uniqueNewSuggestions : ['Automated lead scoring and enrichment', 'Unified workspace for social intent conversion'];
}

export async function generateKeywords(
  description: string, 
  icps: string[] = [], 
  valueProps: string[] = [], 
  currentKeywords: string[] = []
): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, 900));

  const combinedText = `${description} ${icps.join(' ')} ${valueProps.join(' ')}`.toLowerCase();
  let suggestions = [
    'seeking lead generation tool',
    'alternative to cold email outreach',
    'b2b linkedin lead finder',
    'sales pipeline prospecting software',
    'best intent data providers'
  ];

  if (combinedText.includes('supply chain') || combinedText.includes('freight') || combinedText.includes('logistics')) {
    suggestions = [
      'seeking supply chain tool',
      'port congestion manifest automation',
      'freight dispatcher tracking software recommendations',
      'alternative to manual cold prospecting',
      'best logistics crm tool'
    ];
  } else if (combinedText.includes('saas') || combinedText.includes('marketing') || combinedText.includes('sales')) {
    suggestions = [
      'expandi alternative reddit',
      'best linkedin outreach automation',
      'looking for b2b sales leads tool',
      'cold outbound personalization software',
      'social selling playbook recommendations'
    ];
  }

  const uniqueNewSuggestions = suggestions.filter(s => !currentKeywords.includes(s));
  return uniqueNewSuggestions.length > 0 ? uniqueNewSuggestions : ['looking for software recommendations', 'social intent lead scoring'];
}
