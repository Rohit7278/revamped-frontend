export interface ProjectOnboardingState {
  id?: string;
  name: string;
  locations: string[];
  industries: string[];
  productUrl: string;
  productDescription: string;
  icps: string[];
  valueProps: string[];
  linkedin: {
    jobTitles: string[];
    companySize: string;
  };
  keywords: string[];
  completed?: boolean;
  createdAt?: string;
}

export const INITIAL_ONBOARDING_STATE: ProjectOnboardingState = {
  name: '',
  locations: ['United States', 'United Kingdom', 'Canada'],
  industries: ['Logistics & Supply Chain', 'SaaS & Cloud Software'],
  productUrl: '',
  productDescription: '',
  icps: [
    'Supply Chain Vice Presidents',
    'Logistics & Fleet Directors',
    'Demand Generation Leaders'
  ],
  valueProps: [
    'Real-time social intent listening across LinkedIn and Reddit',
    'Automated buying trigger detection for warm sales outreach',
    '4x higher conversion rate than generic cold emailing'
  ],
  linkedin: {
    jobTitles: [
      'VP of Supply Chain',
      'Director of Logistics',
      'Head of Outbound',
      'Founder / CEO'
    ],
    companySize: '51–200'
  },
  keywords: [
    'seeking supply chain tool',
    'cargo logistics automation software',
    'alternative to manual cold prospecting',
    'b2b linkedin lead finder'
  ]
};

export const SUGGESTED_LOCATIONS = [
  'United States',
  'United Kingdom',
  'Canada',
  'Germany',
  'India',
  'Australia',
  'Singapore',
  'France',
  'Netherlands',
  'UAE'
];

export const SUGGESTED_INDUSTRIES = [
  'Logistics & Supply Chain',
  'SaaS & Cloud Software',
  'E-Commerce & Retail',
  'Fintech & Banking',
  'Healthcare & Biotech',
  'AI & Machine Learning',
  'Marketing & Advertising',
  'Transportation & Freight',
  'Manufacturing',
  'Human Resources & Recruiting'
];

export const SUGGESTED_JOB_TITLES = [
  'Founder',
  'CEO',
  'VP Sales',
  'Head of Growth',
  'Marketing Director',
  'CMO',
  'Director of Logistics',
  'VP of Supply Chain',
  'Operations Manager',
  'IT Director'
];

export const COMPANY_SIZE_OPTIONS = [
  '1–10',
  '11–50',
  '51–200',
  '201–500',
  '501–1,000',
  '1,001–5,000',
  '5,001–10,000',
  '10,001+'
];

export interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  category: 'seeking' | 'aware' | 'browsing' | 'match';
  categoryLabel: string;
  avatarText: string;
  avatarColor: string;
  linkedinUrl: string;
  sharedConnections: number;
  fitScore: number;
  status?: 'contacted' | 'replied' | 'converted';
  profilePic?: string;
  intent?: string;
}
