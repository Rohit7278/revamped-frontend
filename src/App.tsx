import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import type { Lead } from './components/onboarding/types';
import { ProspectDrawer } from './components/ProspectDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import { CRMProvider, useCRM } from './components/crm/CRMContext';
import { CRMLayout } from './components/crm/CRMLayout';
import { OnboardingModal, type OnboardingProfile } from './components/OnboardingModal';
import { CreateProjectPage } from './components/onboarding/CreateProjectPage';
import { ProfileSettings } from './components/ProfileSettings';
import { 
  AreaChart, 
  Area, 
  PieChart,
  Cell,
  Pie,
  XAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { 
  CheckCircle, 
  Loader2, 
  Star, 
  Flame, 
  Search, 
  Sparkles, 
  Zap, 
  Target, 
  MessageSquare,
  HelpCircle,
  Users,
  Compass,
  BellOff,
  Filter,
  Heart,
  Bookmark,
  ArrowUpDown,
  UserCheck,
  Archive,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import './App.css';

// Profiles matching Rixly Action Queue (Screenshot 2)
const INITIAL_HOT_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Ashish Gujral',
    title: 'Supply Chain Vice President',
    company: 'LogiCorp Ltd',
    category: 'match',
    categoryLabel: 'Profile Match',
    avatarText: 'AG',
    avatarColor: '#e5ac24',
    linkedinUrl: 'https://linkedin.com',
    sharedConnections: 4,
    fitScore: 96,
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    intent: 'Explicitly looking for cold carrier outreach tools.'
  },
  {
    id: 'lead-2',
    name: 'Padmakumar G',
    title: 'Supply Chain Vice President',
    company: 'Apex Supply Systems',
    category: 'match',
    categoryLabel: 'Profile Match',
    avatarText: 'PG',
    avatarColor: '#a855f7',
    linkedinUrl: 'https://linkedin.com',
    sharedConnections: 2,
    fitScore: 91,
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    intent: 'Sourcing automation partners for cargo tracking.'
  },
  {
    id: 'lead-3',
    name: 'Mahesh Dharap',
    title: 'Supply Chain Vice President',
    company: 'Flexport Freight',
    category: 'match',
    categoryLabel: 'Profile Match',
    avatarText: 'MD',
    avatarColor: '#3b82f6',
    linkedinUrl: 'https://linkedin.com',
    sharedConnections: 1,
    fitScore: 89,
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120',
    intent: 'Sourcing warehouse bottleneck consultants.'
  },
  {
    id: 'lead-4',
    name: 'Prashant Thorat',
    title: 'Supply Chain Vice President',
    company: 'Indigo Cargo Solutions',
    category: 'match',
    categoryLabel: 'Profile Match',
    avatarText: 'PT',
    avatarColor: '#64748b',
    linkedinUrl: 'https://linkedin.com',
    sharedConnections: 3,
    fitScore: 85,
    profilePic: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120',
    intent: 'Interested in outbound campaign personalization.'
  },
  {
    id: 'lead-5',
    name: 'Rohan Mehta',
    title: 'VP Global Sourcing',
    company: 'Mumbai Freight Corp',
    category: 'match',
    categoryLabel: 'Profile Match',
    avatarText: 'RM',
    avatarColor: '#eab308',
    linkedinUrl: 'https://linkedin.com',
    sharedConnections: 5,
    fitScore: 95,
    profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    intent: 'Evaluating outbound coordination engines.'
  },
  {
    id: 'lead-6',
    name: 'Claire Dupont',
    title: 'Director of Procurement',
    company: 'Euro Foods Group',
    category: 'match',
    categoryLabel: 'Profile Match',
    avatarText: 'CD',
    avatarColor: '#ec4899',
    linkedinUrl: 'https://linkedin.com',
    sharedConnections: 2,
    fitScore: 91,
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    intent: 'Seeking autonomous scanning supplier alerts.'
  },
  {
    id: 'lead-7',
    name: 'Hans Webber',
    title: 'Global Logistics Director',
    company: 'Berlin Freight Labs',
    category: 'match',
    categoryLabel: 'Profile Match',
    avatarText: 'HW',
    avatarColor: '#f97316',
    linkedinUrl: 'https://linkedin.com',
    sharedConnections: 3,
    fitScore: 94,
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    intent: 'Needs customs scan bottleneck automation.'
  },
  {
    id: 'lead-8',
    name: 'Amina Al-Mansoor',
    title: 'VP Operations & Supply',
    company: 'Dubai Trade Hub',
    category: 'match',
    categoryLabel: 'Profile Match',
    avatarText: 'AA',
    avatarColor: '#06b6d4',
    linkedinUrl: 'https://linkedin.com',
    sharedConnections: 4,
    fitScore: 92,
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    intent: 'Sourcing automated pipeline trigger connectors.'
  }
];

// Replies matching Gojiberry example profiles (Screenshot 1)
const INITIAL_REPLY_LEADS: Lead[] = [
  {
    id: 'reply-1',
    name: 'Dylan Teixeira (example)',
    title: 'Co-Founder',
    company: 'Gojiberry.ai',
    category: 'seeking',
    categoryLabel: 'Actively Seeking',
    avatarText: 'DT',
    avatarColor: '#eab308',
    linkedinUrl: 'https://linkedin.com',
    sharedConnections: 6,
    fitScore: 98,
    status: 'replied',
    profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    intent: 'Replied requesting outbound automation demo.'
  },
  {
    id: 'reply-2',
    name: 'Sarah Jenkins',
    title: 'Head of Global Logistics',
    company: 'FlexPort LLC',
    category: 'seeking',
    categoryLabel: 'Actively Seeking',
    avatarText: 'SJ',
    avatarColor: '#10b981',
    linkedinUrl: 'https://linkedin.com',
    sharedConnections: 3,
    fitScore: 94,
    status: 'replied',
    profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    intent: 'Replied asking for logistics integration pricing.'
  },
  {
    id: 'reply-3',
    name: 'Marc Dupont',
    title: 'VP Supply Chain',
    company: 'Apex Logistics Systems',
    category: 'aware',
    categoryLabel: 'Problem Aware',
    avatarText: 'MD',
    avatarColor: '#3b82f6',
    linkedinUrl: 'https://linkedin.com',
    sharedConnections: 1,
    fitScore: 88,
    status: 'replied',
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    intent: 'Replied noting interest in custom API triggers.'
  }
];

// Gojiberry Line Chart Data (Leads Created vs. Profile Scans)
const LEADS_GROWTH_DATA = [
  { name: 'Apr 27', scans: 4, leads: 1 },
  { name: 'May 01', scans: 12, leads: 2 },
  { name: 'May 05', scans: 25, leads: 8 },
  { name: 'May 10', scans: 45, leads: 15 },
  { name: 'May 15', scans: 68, leads: 24 },
  { name: 'May 20', scans: 95, leads: 38 },
  { name: 'May 27', scans: 120, leads: 50 }
];

interface ScanItem {
  id: string;
  name: string;
  leadsFound: number;
  status: 'waiting' | 'scanning' | 'completed';
  timeLabel: string;
}

// Candidates feed list items mapping Rixly outbox page (Screenshot 7)
interface LeadsFeedItem {
  id: string;
  name: string;
  avatarText: string;
  avatarColor: string;
  timeLabel: string;
  category: 'owner' | 'seeker';
  categoryLabel: 'Problem Owner' | 'Solution Seeker';
  postQuote: string;
  flameSignal: string;
  position: 'vp' | 'director' | 'founder' | 'manager';
  positionLabel: string;
  location: 'ny' | 'sf' | 'london' | 'chicago' | 'toronto';
  locationLabel: string;
  platform: 'linkedin' | 'reddit';
  fitScore: number;
  profilePic?: string;
  timestamp: number;
  status?: 'new' | 'contacted' | 'archived';
}

const INITIAL_FEED_LEADS: LeadsFeedItem[] = [
  {
    id: 'feed-1',
    name: 'Joel T',
    avatarText: 'JT',
    avatarColor: '#f97316',
    timeLabel: '18d ago',
    category: 'owner',
    categoryLabel: 'Problem Owner',
    postQuote: "I've seen hospital discharge gaps close up. Families step out of theatres into uncertainty.",
    flameSignal: "Matches discharge challenges.",
    position: 'vp',
    positionLabel: 'VP Operations',
    location: 'ny',
    locationLabel: 'New York, US',
    platform: 'linkedin',
    fitScore: 96,
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 1,
    status: 'new'
  },
  {
    id: 'feed-2',
    name: 'Antoinette Thomas',
    avatarText: 'AT',
    avatarColor: '#06b6d4',
    timeLabel: '18d ago',
    category: 'seeker',
    categoryLabel: 'Solution Seeker',
    postQuote: "Seeking likeminded professionals to join a caregiver support nonprofit this December.",
    flameSignal: "Seeking support professionals.",
    position: 'founder',
    positionLabel: 'Co-Founder',
    location: 'sf',
    locationLabel: 'San Francisco, US',
    platform: 'linkedin',
    fitScore: 94,
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 2,
    status: 'contacted'
  },
  {
    id: 'feed-3',
    name: 'Queen C Pinkston',
    avatarText: 'QP',
    avatarColor: '#ec4899',
    timeLabel: '18d ago',
    category: 'owner',
    categoryLabel: 'Problem Owner',
    postQuote: "Caregiver burnout is real and exhausting. You are not alone, I've been there.",
    flameSignal: "Highlights caregiver burnout.",
    position: 'director',
    positionLabel: 'Director of Logistics',
    location: 'london',
    locationLabel: 'London, UK',
    platform: 'linkedin',
    fitScore: 97,
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 3,
    status: 'archived'
  },
  {
    id: 'feed-4',
    name: 'Robel Gugsa',
    avatarText: 'RG',
    avatarColor: '#e5ac24',
    timeLabel: '18d ago',
    category: 'owner',
    categoryLabel: 'Problem Owner',
    postQuote: "Logistics ranking is messy. Need automated coordinate compilation.",
    flameSignal: "Needs coordinates automation.",
    position: 'director',
    positionLabel: 'Global Transportation Director',
    location: 'london',
    locationLabel: 'London, UK',
    platform: 'linkedin',
    fitScore: 93,
    profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 4
  },
  {
    id: 'feed-5',
    name: 'r_supplychain_user',
    avatarText: 'SU',
    avatarColor: '#ef4444',
    timeLabel: '3d ago',
    category: 'seeker',
    categoryLabel: 'Solution Seeker',
    postQuote: "Shipping 500 orders/day but tracking is messy. Need automated LinkedIn VP alerts.",
    flameSignal: "Explicitly seeking tracking automation.",
    position: 'manager',
    positionLabel: 'Operations Manager',
    location: 'chicago',
    locationLabel: 'Chicago, US',
    platform: 'reddit',
    fitScore: 92,
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 10
  },
  {
    id: 'feed-6',
    name: 'logistics_director_xyz',
    avatarText: 'LD',
    avatarColor: '#f97316',
    timeLabel: '5d ago',
    category: 'owner',
    categoryLabel: 'Problem Owner',
    postQuote: "Warehouse bottlenecks cost us $10k/mo. Sourcing takes 80% of our team's time.",
    flameSignal: "Notes warehouse bottleneck issues.",
    position: 'director',
    positionLabel: 'Supply Chain Director',
    location: 'toronto',
    locationLabel: 'Toronto, CA',
    platform: 'reddit',
    fitScore: 90,
    profilePic: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 6
  },
  {
    id: 'feed-7',
    name: 'Rohan Mehta',
    avatarText: 'RM',
    avatarColor: '#eab308',
    timeLabel: '1d ago',
    category: 'seeker',
    categoryLabel: 'Solution Seeker',
    postQuote: "Evaluating outbound coordination engines. Sourcing overheads are peaking.",
    flameSignal: "Explicitly looking for coordination tools.",
    position: 'vp',
    positionLabel: 'VP Sourcing',
    location: 'chicago',
    locationLabel: 'Chicago, US',
    platform: 'linkedin',
    fitScore: 95,
    profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 14
  },
  {
    id: 'feed-8',
    name: 'Claire Dupont',
    avatarText: 'CD',
    avatarColor: '#ec4899',
    timeLabel: '2d ago',
    category: 'owner',
    categoryLabel: 'Problem Owner',
    postQuote: "Supplier delay signals take hours to catalog. Seeking autonomous scanning alerts.",
    flameSignal: "Burned by slow catalog times.",
    position: 'director',
    positionLabel: 'Procurement Director',
    location: 'london',
    locationLabel: 'London, UK',
    platform: 'linkedin',
    fitScore: 91,
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 12
  },
  {
    id: 'feed-9',
    name: 'Marcus Vance',
    avatarText: 'MV',
    avatarColor: '#06b6d4',
    timeLabel: '4d ago',
    category: 'seeker',
    categoryLabel: 'Solution Seeker',
    postQuote: "Looking to integrate automated LinkedIn outbound sequences directly with logistics tools.",
    flameSignal: "Actively sourcing sequence tool integrations.",
    position: 'founder',
    positionLabel: 'Operations Chief',
    location: 'sf',
    locationLabel: 'San Francisco, US',
    platform: 'linkedin',
    fitScore: 88,
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 8
  },
  {
    id: 'feed-10',
    name: 'Elena Rostova',
    avatarText: 'ER',
    avatarColor: '#3b82f6',
    timeLabel: '6d ago',
    category: 'owner',
    categoryLabel: 'Problem Owner',
    postQuote: "Outbound tracking gaps cost us 15% in delivery penalties this quarter. Manual scanning is too slow.",
    flameSignal: "Suffering delivery penalties.",
    position: 'manager',
    positionLabel: 'Logistics Manager',
    location: 'ny',
    locationLabel: 'New York, US',
    platform: 'reddit',
    fitScore: 86,
    profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 5
  },
  {
    id: 'feed-11',
    name: 'Hans Webber',
    avatarText: 'HW',
    avatarColor: '#f97316',
    timeLabel: '1d ago',
    category: 'owner',
    categoryLabel: 'Problem Owner',
    postQuote: "Outbound customs scans bottleneck our shipping lines by 24h. Need smart webhook triggers.",
    flameSignal: "Suffers customs bottleneck delays.",
    position: 'director',
    positionLabel: 'Global Logistics Director',
    location: 'london',
    locationLabel: 'London, UK',
    platform: 'linkedin',
    fitScore: 94,
    profilePic: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 13
  },
  {
    id: 'feed-12',
    name: 'Amina Al-Mansoor',
    avatarText: 'AA',
    avatarColor: '#06b6d4',
    timeLabel: '2d ago',
    category: 'seeker',
    categoryLabel: 'Solution Seeker',
    postQuote: "Evaluating automated pipeline triggers to match carrier bids. Need a custom API connector.",
    flameSignal: "Evaluating pipeline triggers.",
    position: 'vp',
    positionLabel: 'VP Operations',
    location: 'ny',
    locationLabel: 'New York, US',
    platform: 'linkedin',
    fitScore: 92,
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 11
  },
  {
    id: 'feed-13',
    name: 'Kenji Sato',
    avatarText: 'KS',
    avatarColor: '#e5ac24',
    timeLabel: '3d ago',
    category: 'owner',
    categoryLabel: 'Problem Owner',
    postQuote: "Carrier delivery disputes take 5 hours per day to settle. Sourcing data manually is painful.",
    flameSignal: "Struggling with carrier disputes.",
    position: 'manager',
    positionLabel: 'Operations Manager',
    location: 'sf',
    locationLabel: 'San Francisco, US',
    platform: 'reddit',
    fitScore: 89,
    profilePic: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 9
  },
  {
    id: 'feed-14',
    name: 'Sofia Lopez',
    avatarText: 'SL',
    avatarColor: '#ec4899',
    timeLabel: '5d ago',
    category: 'seeker',
    categoryLabel: 'Solution Seeker',
    postQuote: "Looking to deploy smart outbound campaigns to reach cargo directors in US ports.",
    flameSignal: "Seeking outbound campaign triggers.",
    position: 'founder',
    positionLabel: 'Co-Founder',
    location: 'toronto',
    locationLabel: 'Toronto, CA',
    platform: 'linkedin',
    fitScore: 87,
    profilePic: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 7
  },
  {
    id: 'feed-15',
    name: 'Sarah Jenkins',
    avatarText: 'SJ',
    avatarColor: '#8b5cf6',
    timeLabel: '2h ago',
    category: 'owner',
    categoryLabel: 'Problem Owner',
    postQuote: "Warehouse inventory sync delays are costing us 6+ hours every single shift. Need real-time automated webhook triggers to eliminate manual spreadsheets.",
    flameSignal: "Critical inventory sync delay friction.",
    position: 'vp',
    positionLabel: 'VP Supply Chain',
    location: 'chicago',
    locationLabel: 'Chicago, US',
    platform: 'linkedin',
    fitScore: 98,
    profilePic: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 20
  },
  {
    id: 'feed-16',
    name: 'David Sterling',
    avatarText: 'DS',
    avatarColor: '#06b6d4',
    timeLabel: '4h ago',
    category: 'seeker',
    categoryLabel: 'Solution Seeker',
    postQuote: "Currently sourcing and benchmarking automated outbound social listening tools for freight forwarders. Any software recommendations for high-intent matching?",
    flameSignal: "Actively benchmarking outbound listening platforms.",
    position: 'founder',
    positionLabel: 'Chief Logistics Officer',
    location: 'sf',
    locationLabel: 'San Francisco, US',
    platform: 'linkedin',
    fitScore: 96,
    profilePic: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 19
  },
  {
    id: 'feed-17',
    name: 'Priya Sharma',
    avatarText: 'PS',
    avatarColor: '#10b981',
    timeLabel: '6h ago',
    category: 'seeker',
    categoryLabel: 'Solution Seeker',
    postQuote: "Looking for an alternative to manual LinkedIn prospecting that identifies high-intent conversations and buying signals in real time.",
    flameSignal: "Seeking automated intent prospecting tools.",
    position: 'director',
    positionLabel: 'Director of Outbound Growth',
    location: 'london',
    locationLabel: 'London, UK',
    platform: 'linkedin',
    fitScore: 95,
    profilePic: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 18
  },
  {
    id: 'feed-18',
    name: 'Alexander Cruz',
    avatarText: 'AC',
    avatarColor: '#f97316',
    timeLabel: '1d ago',
    category: 'owner',
    categoryLabel: 'Problem Owner',
    postQuote: "Managing 80+ freight carriers manually over email is causing dispatch errors and demurrage penalties every single week. Sourcing is breaking down.",
    flameSignal: "Experiencing demurrage penalty overheads.",
    position: 'manager',
    positionLabel: 'Fleet & Operations Manager',
    location: 'toronto',
    locationLabel: 'Toronto, CA',
    platform: 'reddit',
    fitScore: 93,
    profilePic: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 17
  },
  {
    id: 'feed-19',
    name: 'Nathalie Dubois',
    avatarText: 'ND',
    avatarColor: '#ec4899',
    timeLabel: '1d ago',
    category: 'owner',
    categoryLabel: 'Problem Owner',
    postQuote: "Our manual supplier scorecards take days to update. Need an automated platform to track supplier disruptions and port delays as they happen.",
    flameSignal: "Suffers from manual supplier tracking delays.",
    position: 'director',
    positionLabel: 'Head of Procurement & Logistics',
    location: 'ny',
    locationLabel: 'New York, US',
    platform: 'linkedin',
    fitScore: 94,
    profilePic: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 16
  },
  {
    id: 'feed-20',
    name: 'Lucas Meyer',
    avatarText: 'LM',
    avatarColor: '#3b82f6',
    timeLabel: '2d ago',
    category: 'seeker',
    categoryLabel: 'Solution Seeker',
    postQuote: "Evaluating tools to capture Reddit and LinkedIn discussions where users ask for logistics SaaS recommendations. Need seamless CRM sync.",
    flameSignal: "Explicitly evaluating social lead monitoring software.",
    position: 'founder',
    positionLabel: 'Founder & COO',
    location: 'chicago',
    locationLabel: 'Chicago, US',
    platform: 'reddit',
    fitScore: 91,
    profilePic: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    timestamp: 15
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Theme switcher state - defaults to 'light' mode and syncs with landing & login page
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('rixly_theme') || localStorage.getItem('theme') || localStorage.getItem('app_theme');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
    return 'light'; // Light theme by default
  });
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Time range filter (Screenshot 1: 30 days active)
  const [timeRange, setTimeRange] = useState('30 days');

  // Hot Leads Tab vs Replies Tab selector
  const [activeRightTab, setActiveRightTab] = useState<'hotLeads' | 'replies'>('hotLeads');

  // Onboarding Setup Modal & Dedicated Create Project Page state
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCreateProjectPage, setShowCreateProjectPage] = useState<boolean>(() => {
    return window.location.pathname.includes('/create-project');
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes('/create-project')) {
        setShowCreateProjectPage(true);
      } else {
        setShowCreateProjectPage(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToCreateProject = () => {
    if (!window.location.pathname.includes('/create-project')) {
      window.history.pushState({}, '', '/create-project');
    }
    setShowCreateProjectPage(true);
  };

  const navigateBackFromCreateProject = (newProject?: any) => {
    if (window.location.pathname.includes('/create-project')) {
      window.history.pushState({}, '', '/');
    }
    if (newProject) {
      setOnboardingProfile(newProject as any);
    }
    setShowCreateProjectPage(false);
    setActiveTab('dashboard');
  };

  const [onboardingProfile, setOnboardingProfile] = useState<OnboardingProfile | null>(() => {
    const saved = localStorage.getItem('rixly_onboarding_profile');
    return saved ? JSON.parse(saved) : null;
  });


  
  const [hotLeads, setHotLeads] = useState<Lead[]>(INITIAL_HOT_LEADS);
  const [replyLeads, setReplyLeads] = useState<Lead[]>(INITIAL_REPLY_LEADS);

  // Scan History registers (Screenshot 6)
  const [scans, setScans] = useState<ScanItem[]>([
    { id: 'scan-1', name: 'linkedin_posts_rank', leadsFound: 0, status: 'waiting', timeLabel: 'WAITING TO SCAN' },
    { id: 'scan-2', name: 'Marathon Scan', leadsFound: 0, status: 'waiting', timeLabel: 'WAITING TO SCAN' },
    { id: 'scan-3', name: 'Quick Scan', leadsFound: 2, status: 'completed', timeLabel: '18 DAYS AGO • COMPLETED' },
    { id: 'scan-4', name: 'Historical Scan', leadsFound: 0, status: 'completed', timeLabel: '18 DAYS AGO • COMPLETED' },
    { id: 'scan-5', name: 'Deep Search', leadsFound: 10, status: 'completed', timeLabel: '18 DAYS AGO • COMPLETED' }
  ]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLog, setScanLog] = useState<string[]>([]);

  // Leads feed registers (Screenshot 7) + Split View active selection state
  const [leadsFeed, setLeadsFeed] = useState<LeadsFeedItem[]>(() => {
    const saved = localStorage.getItem('rixly_leads_feed');
    if (saved) {
      try {
        const parsed: LeadsFeedItem[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(p => p.id));
        const missingInitial = INITIAL_FEED_LEADS.filter(item => !existingIds.has(item.id));
        if (missingInitial.length > 0) {
          const merged = [...parsed, ...missingInitial];
          localStorage.setItem('rixly_leads_feed', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch (e) {}
    }
    return INITIAL_FEED_LEADS;
  });

  useEffect(() => {
    localStorage.setItem('rixly_leads_feed', JSON.stringify(leadsFeed));
  }, [leadsFeed]);

  const [selectedFeedLeadId, setSelectedFeedLeadId] = useState<string | null>(null);
  const [animatingLeadId, setAnimatingLeadId] = useState<string | null>(null);
  const [profileSavedToast, setProfileSavedToast] = useState(false);

  useEffect(() => {
    const handleProfileUpdated = () => {
      setProfileSavedToast(true);
      setTimeout(() => setProfileSavedToast(false), 2400);
    };
    window.addEventListener('rixly_profile_updated', handleProfileUpdated);
    return () => window.removeEventListener('rixly_profile_updated', handleProfileUpdated);
  }, []);

  // Consume Rixly CRM Context Store
  const { addLeadToCRM, crmLeads } = useCRM();
  
  const [platformTab, setPlatformTab] = useState<'linkedin' | 'reddit'>('linkedin');
  const [filterReason, setFilterReason] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread'>('all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'name-desc' | 'rating-desc' | 'rating-asc' | 'date-desc' | 'date-asc'>('default');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Playbook interactive sandbox keywords state
  const [sandboxKeyword, setSandboxKeyword] = useState('linkedin outreach automation');
  const [sandboxQueryCount, setSandboxQueryCount] = useState(6);
  const [sandboxNoiseRatio, setSandboxNoiseRatio] = useState('100% Qualified');
  const [sandboxSample, setSandboxSample] = useState(
    'Need a linkedin outreach automation script or tool to sync shipping prospects.'
  );
  const [sandboxConfidence, setSandboxConfidence] = useState(98);

  const handleSandboxKeywordChange = (kw: string) => {
    setSandboxKeyword(kw);
    if (kw.toLowerCase().includes('lead') && !kw.toLowerCase().includes('outreach')) {
      setSandboxQueryCount(140);
      setSandboxNoiseRatio('92% Noise (Unqualified)');
      setSandboxSample('How do you guys generate B2B sales leads for agencies?');
      setSandboxConfidence(35);
    } else if (kw.toLowerCase().includes('competitor') || kw.toLowerCase().includes('alternatives')) {
      setSandboxQueryCount(12);
      setSandboxNoiseRatio('25% Noise (High intent)');
      setSandboxSample('Looking for alternatives to Expandi or Copilot for B2B sequence automation.');
      setSandboxConfidence(88);
    } else {
      setSandboxQueryCount(6);
      setSandboxNoiseRatio('100% Qualified (High intent)');
      setSandboxSample('Need a linkedin outreach automation script or tool to sync shipping prospects.');
      setSandboxConfidence(98);
    }
  };

  // Synchronize theme across localStorage, attributes, and cross-tab/cross-page events
  useEffect(() => {
    localStorage.setItem('rixly_theme', theme);
    localStorage.setItem('theme', theme);
    localStorage.setItem('app_theme', theme);

    // Broadcast theme update custom event
    window.dispatchEvent(new CustomEvent('rixly_theme_changed', { detail: theme }));

    if (theme === 'light') {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [theme]);

  // Listen for storage events (e.g. from Landing page or Login page)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rixly_theme' || e.key === 'theme' || e.key === 'app_theme') {
        if (e.newValue === 'light' || e.newValue === 'dark') {
          setTheme(e.newValue);
        }
      }
    };
    const handleCustomThemeChange = (e: any) => {
      if (e.detail === 'light' || e.detail === 'dark') {
        setTheme(e.detail);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rixly_theme_changed', handleCustomThemeChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rixly_theme_changed', handleCustomThemeChange);
    };
  }, []);

  // Donut chart representation of Rixly's 4 intent categories (Screenshot 2)
  const donutData = [
    { name: 'Actively Seeking', value: 12, color: '#eab308' }, // Yellow
    { name: 'Problem Aware', value: 18, color: '#e5ac24' }, // Gold
    { name: 'Passively Browsing', value: 10, color: theme === 'dark' ? '#ffffff' : '#6366f1' }, // White or Indigo
    { name: 'Profile Match', value: 10, color: '#a855f7' } // Purple
  ];

  const handleStatusUpdate = (leadId: string, status: 'contacted' | 'replied' | 'converted') => {
    // Update Hot Leads
    setHotLeads(prevLeads => 
      prevLeads.map(lead => {
        if (lead.id === leadId) {
          return { ...lead, status };
        }
        return lead;
      })
    );

    // Update Reply Leads
    setReplyLeads(prevLeads => 
      prevLeads.map(lead => {
        if (lead.id === leadId) {
          return { ...lead, status };
        }
        return lead;
      })
    );

    // Sync marked contacted leads from Action Queue to Rixly CRM
    if (status === 'contacted') {
      const leadToMove = hotLeads.find(l => l.id === leadId) || replyLeads.find(l => l.id === leadId) || selectedLead;
      if (leadToMove) {
        addLeadToCRM(leadToMove);
        
        // Also remove from discovery leadsFeed if exists there
        setLeadsFeed(prev => {
          const updated = prev.filter(l => l.id !== leadId && l.id !== leadToMove.id);
          localStorage.setItem('rixly_leads_feed', JSON.stringify(updated));
          return updated;
        });

        // Switch to Rixly CRM workspace tab
        setActiveTab('crm');
      }
    }
  };

  // Simulated scan campaign trigger linking history list to crawler
  const handleRunScan = () => {
    if (isScanning) return;
    
    // Find the first scan with status 'waiting'
    let targetIndex = scans.findIndex(s => s.status === 'waiting');
    
    // If no scans are waiting, reset the first two to allow repeated runs!
    if (targetIndex === -1) {
      setScans(prev => prev.map((s, idx) => idx < 2 ? { ...s, status: 'waiting', leadsFound: 0, timeLabel: 'WAITING TO SCAN' } : s));
      targetIndex = 0;
    }
    
    setIsScanning(true);
    setScanProgress(0);
    setScanLog(['[1/5] Initiating secure B2B search API proxy...']);
    
    // Set target scan status to scanning
    setScans(prev => prev.map((s, idx) => idx === targetIndex ? {
      ...s,
      status: 'scanning',
      timeLabel: 'SCANNING PROFILES...'
    } : s));
    
    let currentProgress = 0;
    let currentLeads = 0;
    
    const interval = setInterval(() => {
      currentProgress += 10;
      if (currentProgress > 100) currentProgress = 100;
      setScanProgress(currentProgress);
      
      // Randomly find leads along the way
      if (currentProgress % 30 === 0) {
        currentLeads += Math.floor(Math.random() * 2) + 1;
        setScans(prev => prev.map((s, idx) => idx === targetIndex ? {
          ...s,
          leadsFound: currentLeads
        } : s));
      }

      // Add dynamic log files based on progress percentage
      if (currentProgress === 20) {
        setScanLog(prev => [...prev, '[2/5] Filtering B2B target titles (VP, Director, Founder)...']);
      } else if (currentProgress === 50) {
        setScanLog(prev => [...prev, '[3/5] Scraping LinkedIn search indices & post feeds...']);
      } else if (currentProgress === 80) {
        setScanLog(prev => [...prev, '[4/5] Running Rixly semantic classifier & category mapping...']);
      } else if (currentProgress === 100) {
        setScanLog(prev => [...prev, '[5/5] Scan Complete: Discovered high-intent logistics match!']);
      }
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      
      // Determine found prospect matching Screenshot 6 profiles
      const newProspect: Lead = targetIndex === 0 ? {
        id: `lead-prospect-1-${Date.now()}`,
        name: 'Queen C Pinkston',
        title: 'Strategic Logistics Manager',
        company: 'OrbitFlow Inc',
        category: 'seeking',
        categoryLabel: 'Actively Seeking',
        avatarText: 'QP',
        avatarColor: '#10b981',
        linkedinUrl: 'https://linkedin.com',
        sharedConnections: 5,
        fitScore: 97
      } : {
        id: `lead-prospect-2-${Date.now()}`,
        name: 'Robel Gugsa',
        title: 'Global Transportation Director',
        company: 'Vanguard Cargo Group',
        category: 'seeking',
        categoryLabel: 'Actively Seeking',
        avatarText: 'RG',
        avatarColor: '#e5ac24',
        linkedinUrl: 'https://linkedin.com',
        sharedConnections: 2,
        fitScore: 93
      };

      // Add to feed data so it appears in the Leads Tab live too!
      const newFeedItem: LeadsFeedItem = {
        id: `feed-new-${Date.now()}`,
        name: newProspect.name,
        avatarText: newProspect.avatarText,
        avatarColor: newProspect.avatarColor,
        timeLabel: 'Just now',
        category: 'owner',
        categoryLabel: 'Problem Owner',
        postQuote: newProspect.title === 'Strategic Logistics Manager' 
          ? "Logistics bottlenecks are messy. Sourcing forwarders takes 80% of our time."
          : "Logistics ranking is messy. Need automated coordinate compilation.",
        flameSignal: "The author is actively seeking logistics solutions.",
        position: 'director',
        positionLabel: newProspect.title,
        location: 'london',
        locationLabel: 'London, UK',
        platform: 'linkedin',
        fitScore: newProspect.fitScore,
        timestamp: Date.now()
      };

      setLeadsFeed(prev => [newFeedItem, ...prev]);
      
      setScans(prev => prev.map((s, idx) => idx === targetIndex ? {
        ...s,
        status: 'completed',
        leadsFound: currentLeads > 0 ? currentLeads : 2,
        timeLabel: 'JUST NOW • COMPLETED'
      } : s));
      
      setHotLeads(prev => [newProspect, ...prev]);
      setIsScanning(false);
      
      alert(`Outbound scan complete! Discovered ${currentLeads > 0 ? currentLeads : 2} intent matches. Found high-intent lead (${newProspect.name}) and loaded to Action Queue.`);
    }, 3300);
  };





  // Toggle favorite lead status (Heart icon)
  const [favoritedLeads, setFavoritedLeads] = useState<string[]>([]);
  const toggleFavoriteLead = (leadId: string) => {
    setFavoritedLeads(prev => 
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  // Toggle save for later lead status (Bookmark icon)
  const [savedLeads, setSavedLeads] = useState<string[]>([]);
  const toggleSaveLead = (leadId: string) => {
    setSavedLeads(prev => 
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  // Set lead ratings state out of 5 stars
  const [leadsRatings, setLeadsRatings] = useState<Record<string, number>>({});
  const setLeadRating = (leadId: string, rating: number) => {
    setLeadsRatings(prev => ({ ...prev, [leadId]: prev[leadId] === rating ? 0 : rating }));
  };

  // Get leads matching status by sidebar activeTab
  const getLeadsByTab = (tab: string) => {
    return leadsFeed.filter(item => {
      if (tab === 'leads') {
        return item.status !== 'contacted' && item.status !== 'archived';
      }
      if (tab === 'archived') {
        return item.status === 'archived';
      }
      return true;
    });
  };

  // Dynamic AI Persona Intent Tag analyzer (Problem Owner vs Solution Seeker)
  const getLeadPersona = (item: LeadsFeedItem): { type: 'owner' | 'seeker'; label: string; sub: string } => {
    if (item.category === 'seeker' || item.categoryLabel?.toLowerCase().includes('seeker')) {
      return {
        type: 'seeker',
        label: 'Solution Seeker',
        sub: 'Actively sourcing software, alternatives, or agency partners'
      };
    }
    if (item.category === 'owner' || item.categoryLabel?.toLowerCase().includes('owner')) {
      return {
        type: 'owner',
        label: 'Problem Owner',
        sub: 'Experiencing acute workflow friction or operational bottlenecks'
      };
    }
    const combined = `${item.postQuote} ${item.flameSignal}`.toLowerCase();
    if (combined.includes('seeking') || combined.includes('looking') || combined.includes('evaluat') || combined.includes('need') || combined.includes('source') || combined.includes('tool')) {
      return {
        type: 'seeker',
        label: 'Solution Seeker',
        sub: 'Actively sourcing software, alternatives, or agency partners'
      };
    }
    return {
      type: 'owner',
      label: 'Problem Owner',
      sub: 'Experiencing acute workflow friction or operational bottlenecks'
    };
  };

  // Toast for unarchive confirmation
  const [unarchiveToast, setUnarchiveToast] = useState<{ show: boolean; name: string }>({ show: false, name: '' });

  // Unarchive lead and return back to Leads Feed
  const handleUnarchiveLead = (leadId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const lead = leadsFeed.find(l => l.id === leadId);
    const leadName = lead ? lead.name : 'Lead';

    setLeadsFeed(prev => {
      const updated = prev.map(l => 
        l.id === leadId ? { ...l, status: 'new' as const } : l
      );
      localStorage.setItem('rixly_leads_feed', JSON.stringify(updated));
      return updated;
    });

    setUnarchiveToast({ show: true, name: leadName });
    setTimeout(() => setUnarchiveToast({ show: false, name: '' }), 2600);
  };

  // Toggle/Set lead CRM statuses
  const handleUpdateLeadStatus = (leadId: string, newStatus: 'contacted' | 'archived') => {
    if (newStatus === 'contacted') {
      const leadToMove = leadsFeed.find(l => l.id === leadId) || activeFeedLead;
      if (leadToMove) {
        addLeadToCRM(leadToMove);
        setLeadsFeed(prev => {
          const updated = prev.filter(l => l.id !== leadId && l.id !== leadToMove.id);
          localStorage.setItem('rixly_leads_feed', JSON.stringify(updated));
          return updated;
        });
        setSelectedFeedLeadId(null);
        setAnimatingLeadId(null);
        setActiveTab('crm');
      }
    } else {
      setLeadsFeed(prev => {
        const updated = prev.map(lead => 
          lead.id === leadId 
            ? { ...lead, status: (lead.status === newStatus ? 'new' : newStatus) as any } 
            : lead
        );
        localStorage.setItem('rixly_leads_feed', JSON.stringify(updated));
        return updated;
      });
      setSelectedFeedLeadId(null);
    }
  };

  // Trigger drawer overlay converting feed item format to lead parameters
  const handleEngageFeedLead = (feedItem: LeadsFeedItem) => {
    const convertedLead: Lead = {
      id: feedItem.id,
      name: feedItem.name,
      title: feedItem.positionLabel,
      company: feedItem.postQuote.includes('OrbitFlow') ? 'OrbitFlow Inc' : 'Vanguard Cargo Group',
      category: feedItem.category === 'owner' ? 'aware' : 'seeking',
      categoryLabel: feedItem.categoryLabel,
      avatarText: feedItem.avatarText,
      avatarColor: feedItem.avatarColor,
      linkedinUrl: 'https://linkedin.com',
      sharedConnections: 3,
      fitScore: feedItem.fitScore
    };
    setSelectedLead(convertedLead);
  };

  // Filter and sort logic for Leads tab feeds
  const filteredFeedLeads = getLeadsByTab(activeTab)
    .filter(item => {
      // Platform
      if (item.platform !== platformTab) return false;
      
      // Search query
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchSearch = item.name.toLowerCase().includes(query) || 
                            item.postQuote.toLowerCase().includes(query) || 
                            item.flameSignal.toLowerCase().includes(query) ||
                            item.positionLabel.toLowerCase().includes(query);
        if (!matchSearch) return false;
      }
      
      // Match Reason
      if (filterReason !== 'all' && item.category !== filterReason) return false;
      
      // Position
      if (filterPosition !== 'all' && item.position !== filterPosition) return false;
      
      // Location
      if (filterLocation !== 'all' && item.location !== filterLocation) return false;
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      if (sortBy === 'rating-desc') {
        return b.fitScore - a.fitScore;
      }
      if (sortBy === 'rating-asc') {
        return a.fitScore - b.fitScore;
      }
      if (sortBy === 'date-desc') {
        return b.timestamp - a.timestamp;
      }
      if (sortBy === 'date-asc') {
        return a.timestamp - b.timestamp;
      }
      return 0;
    });

  // Calculate split active selection lead
  const activeFeedLead = filteredFeedLeads.find(l => l.id === selectedFeedLeadId) || filteredFeedLeads[0] || null;

  if (showCreateProjectPage || activeTab === 'create-project') {
    return (
      <CreateProjectPage
        onCancel={() => navigateBackFromCreateProject()}
        onProjectCreated={(newProj) => navigateBackFromCreateProject(newProj)}
        theme={theme}
        toggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
      />
    );
  }

  return (
    <div className={`lifestats-dashboard-panel ${theme}`}>
      {/* Floating Left Sidebar Navigation capsule */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        crmCount={crmLeads.length}
      />

      {/* Main Operations Canvas Area */}
      <div className="lifestats-content-workspace">
        {/* Top Header */}
        <Header 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          theme={theme}
          toggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenProfile={() => setShowProfileModal(true)}
          onOpenProjectSettings={() => setShowOnboardingModal(true)}
          onOpenCreateProject={navigateToCreateProject}
        />

        {/* Workspace routing switcher */}
        {activeTab === 'dashboard' ? (
          <div className="lifestats-grid-layout">
            
            {/* Left Pane: Campaign Launcher KPIs, Line Chart, Onboarding Checklist */}
            <div className="lifestats-left-pane">
              
              {/* Gojiberry Campaign Launcher & KPIs Row */}
              <h3 className="pane-section-title" style={{ marginBottom: 12, marginTop: 4 }}>Leads by category</h3>
              <div className="gojiberry-kpi-metrics-row" style={{ marginBottom: 24 }}>
                {/* Actively Seeking Card */}
                <div className="gojiberry-kpi-card actively-seeking">
                  <div className="kpi-content-box">
                    <span className="kpi-label">ACTIVELY SEEKING</span>
                    <span className="kpi-value">2</span>
                    <span className="kpi-desc">Explicitly evaluating tools or alternatives right now</span>
                  </div>
                </div>

                {/* Problem Aware Card */}
                <div className="gojiberry-kpi-card problem-aware">
                  <div className="kpi-content-box">
                    <span className="kpi-label">PROBLEM AWARE</span>
                    <span className="kpi-value">17</span>
                    <span className="kpi-desc">Has a pain point but not yet evaluating solutions</span>
                  </div>
                </div>

                {/* Passively Browsing Card */}
                <div className="gojiberry-kpi-card passively-browsing">
                  <div className="kpi-content-box">
                    <span className="kpi-label">PASSIVELY BROWSING</span>
                    <span className="kpi-value">2</span>
                    <span className="kpi-desc">Adjacent signal — in the space but no active need expressed</span>
                  </div>
                </div>

                {/* Profile Match Card */}
                <div className="gojiberry-kpi-card profile-match">
                  <div className="kpi-content-box">
                    <span className="kpi-label">PROFILE MATCH</span>
                    <span className="kpi-value">0</span>
                    <span className="kpi-desc">Matched on title and industry — no post signal detected</span>
                    <span className="kpi-desc-sub">LinkedIn profile leads • no category inferred</span>
                  </div>
                </div>
              </div>

              {/* Activity Overview: Scans & Leads Line Graph */}
              <div className="lifestats-activity-card line-chart-card">
                <div className="activity-chart-column">
                  <div className="chart-header-row">
                    <h3 className="pane-section-title">Activity Overview</h3>
                    <div className="chart-legend-labels">
                      <span className="legend-dot green"></span>
                      <span className="legend-txt">Leads Created</span>
                      <span className="legend-dot blue"></span>
                      <span className="legend-txt">Profiles Scanned</span>
                    </div>
                  </div>

                  <div className="thick-pillars-chart-wrapper">
                    <ResponsiveContainer width="100%" height={195}>
                      <AreaChart data={LEADS_GROWTH_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 8 }}>
                        <defs>
                          <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#e5ac24" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#e5ac24" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="name" 
                          stroke="var(--text-muted)" 
                          fontSize={11.5} 
                          tickLine={false} 
                          axisLine={false}
                          dy={6}
                          tick={{ fill: 'var(--text-muted)', fontSize: 11.5, fontWeight: 550 }}
                        />
                        <Tooltip contentStyle={{ background: 'rgba(26,29,38,0.95)', border: '1px solid rgba(255,255,255,0.08)' }} />
                        <Area type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" name="Leads Created" />
                        <Area type="monotone" dataKey="scans" stroke="#e5ac24" strokeWidth={2} fillOpacity={1} fill="url(#colorScans)" name="Profiles Scanned" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Project Setup Status Checklist */}
              <div className="lifestats-challenges-card onboarding-card">
                <div className="challenges-header-row">
                  <h3 className="pane-section-title">Setup & Target Criteria</h3>
                  <span className="challenge-status-badge complete" style={{ width: 'auto', padding: '2.5px 9px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <span className="active-green-pulse-dot" />
                    Active
                  </span>
                </div>

                <div className="challenges-list-feed">

                  {/* Step 1: Product & Market Basics */}
                  <div className="challenge-item-row" title="Target Locations & Industries">
                    <div className="challenge-icon-circle complete">
                      <CheckCircle size={11} />
                    </div>
                    <div className="challenge-title-cell">
                      <span>1. Product & Market Basics</span>
                    </div>
                    <div className="progress-bar-rail">
                      <div className="progress-bar-fill complete" style={{ width: '100%' }}></div>
                    </div>
                    <span className="progress-val">
                      {onboardingProfile?.locations?.length || 3} Locations • {onboardingProfile?.industries?.length || 2} Industries
                    </span>
                    <span className="challenge-status-badge complete">Configured</span>
                  </div>

                  {/* Step 2: AI Description, ICPs & Value Props */}
                  <div className="challenge-item-row" title="AI Description, ICPs & Value Props">
                    <div className="challenge-icon-circle complete">
                      <CheckCircle size={11} />
                    </div>
                    <div className="challenge-title-cell">
                      <span>2. AI Description & ICPs</span>
                    </div>
                    <div className="progress-bar-rail">
                      <div className="progress-bar-fill complete" style={{ width: '100%' }}></div>
                    </div>
                    <span className="progress-val">
                      {onboardingProfile?.icps?.length || 4} ICPs • {onboardingProfile?.valueProps?.length || 4} Value Props
                    </span>
                    <span className="challenge-status-badge complete">AI Synced</span>
                  </div>

                  {/* Step 3: LinkedIn Specific Targeting */}
                  <div className="challenge-item-row" title="Job Titles & Company Size">
                    <div className="challenge-icon-circle complete">
                      <CheckCircle size={11} />
                    </div>
                    <div className="challenge-title-cell">
                      <span>3. LinkedIn Targeting</span>
                    </div>
                    <div className="progress-bar-rail">
                      <div className="progress-bar-fill complete" style={{ width: '100%' }}></div>
                    </div>
                    <span className="progress-val">
                      {onboardingProfile?.jobTitles?.length || 5} Titles • {onboardingProfile?.companySize || '51-200'}
                    </span>
                    <span className="challenge-status-badge complete">Active</span>
                  </div>

                  {/* Step 4: Search Keywords */}
                  <div className="challenge-item-row" title="Derived Search Keywords">
                    <div className="challenge-icon-circle complete">
                      <CheckCircle size={11} />
                    </div>
                    <div className="challenge-title-cell">
                      <span>4. Social Search Keywords</span>
                    </div>
                    <div className="progress-bar-rail">
                      <div className="progress-bar-fill complete" style={{ width: '100%' }}></div>
                    </div>
                    <span className="progress-val">
                      {onboardingProfile?.keywords?.length || 5} Keywords active
                    </span>
                    <span className="challenge-status-badge complete">Active</span>
                  </div>

                  {/* Step 5: Setup Preview & Launch */}
                  <div className="challenge-item-row" title="Discovery Engine Status">
                    <div className="challenge-icon-circle complete">
                      <CheckCircle size={11} />
                    </div>
                    <div className="challenge-title-cell">
                      <span>5. Discovery Engine</span>
                    </div>
                    <div className="progress-bar-rail">
                      <div className="progress-bar-fill complete" style={{ width: '100%' }}></div>
                    </div>
                    <span className="progress-val">
                      {onboardingProfile?.completed ? 'Discovery engine live' : 'Ready to launch'}
                    </span>
                    <span className="challenge-status-badge complete">
                      {onboardingProfile?.completed ? 'Live' : 'Ready'}
                    </span>
                  </div>
                </div>

                {/* Relevant Bottom Context Footer */}
                <div className="onboarding-relevance-footer">
                  <div className="relevance-footer-header">
                    <span className="relevance-pulse-dot"></span>
                    <span className="relevance-footer-title">Autonomous Radar Targeting Active</span>
                  </div>
                  <p className="relevance-footer-desc">
                    These target parameters continuously feed real-time LinkedIn posts and Reddit discussions into your discovery feed with automated ICP scoring.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Pane: Donut breakdown, Leads feed tabs, Scan Activity Flow list */}
            <div className="lifestats-right-pane">
              
              {/* Donut chart overview breakdown */}
              <div className="lifestats-overview-card">
                <div className="overview-header-row">
                  <h3 className="pane-section-title">Intent Segment Overview</h3>
                  <span className="period-chip-select">Leads Category</span>
                </div>

                <div className="donut-chart-row-layout">
                  {/* Recharts Pie Donut Ring */}
                  <div className="donut-graphic-cell">
                    <ResponsiveContainer width={100} height={100}>
                      <PieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={34}
                          outerRadius={43}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {donutData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="donut-inner-percentage-labels">
                      <span className="pct-val">{hotLeads.length + replyLeads.length}</span>
                      <span className="pct-title">Total Leads</span>
                    </div>
                  </div>

                  {/* Donut Legend */}
                  <div className="donut-legends-list">
                    <div className="legend-row-item">
                      <span className="legend-dot-bullet yellow"></span>
                      <span className="legend-label-text">Actively Seeking</span>
                      <span className="legend-value-pct">12</span>
                    </div>
                    <div className="legend-row-item">
                      <span className="legend-dot-bullet blue"></span>
                      <span className="legend-label-text">Problem Aware</span>
                      <span className="legend-value-pct">18</span>
                    </div>
                    <div className="legend-row-item">
                      <span className="legend-dot-bullet white"></span>
                      <span className="legend-label-text">Passively Browsing</span>
                      <span className="legend-value-pct">10</span>
                    </div>
                    <div className="legend-row-item">
                      <span className="legend-dot-bullet purple"></span>
                      <span className="legend-label-text">Profile Match</span>
                      <span className="legend-value-pct">10</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Feed Tabs Selector (Latest Hot Leads vs Latest Replies) */}
              <div className="gojiberry-leads-hub-tabs">
                <div className="tabs-header-bar">
                  <button 
                    className={`tab-toggle-btn ${activeRightTab === 'hotLeads' ? 'active' : ''}`}
                    onClick={() => setActiveRightTab('hotLeads')}
                  >
                    Latest Leads
                  </button>
                  <button 
                    className={`tab-toggle-btn ${activeRightTab === 'replies' ? 'active' : ''}`}
                    onClick={() => setActiveRightTab('replies')}
                  >
                    Latest Replies
                  </button>
                </div>

                {/* List Container */}
                <div className="tabs-scrollable-feed">
                  {activeRightTab === 'hotLeads' ? (
                    hotLeads.map((lead) => (
                      <div 
                        key={lead.id} 
                        className="tab-lead-feed-row"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <div className="lead-avatar-col" style={{ backgroundColor: `${lead.avatarColor}15`, color: lead.avatarColor, border: `1px solid ${lead.avatarColor}30` }}>
                          {lead.profilePic ? (
                            <img src={lead.profilePic} alt={lead.name} className="avatar-img-circle" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <span>{lead.avatarText}</span>
                          )}
                        </div>
                        <div className="lead-meta-details">
                          <span className="lead-row-name">{lead.name}</span>
                          <span className="lead-row-company">{lead.company} • {lead.title}</span>
                        </div>
                        <div className="lead-row-center-intent">
                          <span className="row-intent-header">Intent</span>
                          <span className="compact-intent-tag dashboard-intent match">{lead.intent || 'High Fit Outbound Match'}</span>
                        </div>
                        <div className="lead-action-cta-col">
                          <span className="fit-score-ticker"><Star size={10} fill="var(--rixly-amber)" stroke="var(--rixly-amber)" style={{ marginRight: 2 }} />{Math.round(lead.fitScore / 10)}</span>
                          <button className="personalize-btn-trigger">Personalize</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    replyLeads.map((lead) => (
                      <div 
                        key={lead.id} 
                        className="tab-lead-feed-row"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <div className="lead-avatar-col" style={{ backgroundColor: `${lead.avatarColor}15`, color: lead.avatarColor, border: `1px solid ${lead.avatarColor}30` }}>
                          {lead.profilePic ? (
                            <img src={lead.profilePic} alt={lead.name} className="avatar-img-circle" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                          ) : (
                            <span>{lead.avatarText}</span>
                          )}
                        </div>
                        <div className="lead-meta-details">
                          <span className="lead-row-name">{lead.name}</span>
                          <span className="lead-row-company">{lead.company} • {lead.title}</span>
                        </div>
                        <div className="lead-row-center-intent">
                          <span className="row-intent-header">Intent</span>
                          <span className="compact-intent-tag dashboard-intent seeking">{lead.intent || 'Replied with Interest'}</span>
                        </div>
                        <div className="lead-action-cta-col">
                          <span className="fit-score-ticker replied">Reply Captured</span>
                          <button className="personalize-btn-trigger">Respond</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Scan Activity Flow simulator card (Screenshot 6 Revamp) */}
              <div className="lifestats-challenges-card scan-activity-hub">
                <div className="challenges-header-row">
                  <div>
                    <h3 className="pane-section-title">Scan Activity Radar</h3>
                    <span className="guide-pct-info">Targeting: Logistics & Supply Chain</span>
                  </div>
                  <button className="run-survey-trigger-btn" onClick={handleRunScan} disabled={isScanning}>
                    {isScanning ? 'Scanner Active' : '+ Run Scan'}
                  </button>
                </div>

                {isScanning ? (
                  /* Visual Radar Console in scan mode */
                  <div className="scan-radar-active-console">
                    <div className="radar-visual-indicator-container">
                      <div className="radar-outer-ring">
                        <div className="radar-inner-ring">
                          <div className="radar-sweep-hand"></div>
                          <div className="radar-center-pulse">
                            <span className="radar-progress-pct">{scanProgress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="radar-live-terminal-panel">
                      <div className="terminal-header">
                        <span className="terminal-dot red"></span>
                        <span className="terminal-dot yellow"></span>
                        <span className="terminal-dot green"></span>
                        <span className="terminal-title">crawling-logs://rixly.engine</span>
                      </div>
                      <div className="terminal-logs-scroll">
                        {scanLog.map((log, index) => (
                          <div key={index} className="terminal-log-line">
                            <span className="log-prefix">&gt;</span>
                            <span className="log-msg">{log}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Chronological Timeline feed when idle */
                  <div className="scan-radar-idle-timeline">
                    <div className="timeline-grid-wrapper">
                      {scans.map((scan) => (
                        <div key={scan.id} className={`timeline-activity-row ${scan.status}`}>
                          <div className="timeline-bullet-connector">
                            <span className={`timeline-status-dot ${scan.status}`}></span>
                            <span className="timeline-rail-line"></span>
                          </div>
                          
                          <div className="timeline-card-content">
                            <div className="timeline-header-meta">
                              <span className="scan-item-name">{scan.name}</span>
                              <span className={`scan-time-badge ${scan.status}`}>{scan.timeLabel}</span>
                            </div>
                            <div className="timeline-stats-row">
                              <span className="scan-leads-count">{scan.leadsFound} leads found</span>
                              <span className="scan-status-pill">{scan.status.toUpperCase()}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        ) : (activeTab === 'leads' || activeTab === 'archived') ? (
          /* Split CRM Workspace Layout */
          <div className={`rixly-leads-split-workspace platform-theme-${platformTab}`}>
            {/* Left Column: Platform switchers, filters panel, and search results */}
            <div className="leads-split-left-pane">
              {/* Top Switcher: Platform Pill Row & Filter Dropdown Toggle */}
              <div className="rixly-platform-header-row">
                <div className="rixly-platform-pill-row">
                  <button 
                    className={`platform-pill-btn ${platformTab === 'linkedin' ? 'active' : ''}`}
                    onClick={() => setPlatformTab('linkedin')}
                  >
                    LinkedIn ({getLeadsByTab(activeTab).filter(l => l.platform === 'linkedin').length})
                  </button>
                  <button 
                    className={`platform-pill-btn ${platformTab === 'reddit' ? 'active' : ''}`}
                    onClick={() => setPlatformTab('reddit')}
                  >
                    Reddit ({getLeadsByTab(activeTab).filter(l => l.platform === 'reddit').length})
                  </button>
                </div>
                
                <div className="workspace-controls-group">
                  {/* Filters Dropdown Wrapper */}
                  <div className="filters-dropdown-wrapper">
                    <button 
                      className={`filter-toggle-icon-btn ${showFilterDropdown ? 'active' : ''} ${(filterReason !== 'all' || filterPosition !== 'all' || filterLocation !== 'all') ? 'has-active-filters' : ''}`}
                      onClick={() => {
                        setShowFilterDropdown(!showFilterDropdown);
                        setShowSortDropdown(false);
                      }}
                    >
                      <Filter size={16} />
                      {(filterReason !== 'all' || filterPosition !== 'all' || filterLocation !== 'all') && (
                        <span className="filter-active-indicator-dot"></span>
                      )}
                    </button>
                    
                    {/* Customized HTML/CSS Tooltip */}
                    <div className="filter-button-custom-tooltip">
                      <span className="tooltip-title">Filter Leads</span>
                      <span className="tooltip-desc">
                        {(filterReason !== 'all' || filterPosition !== 'all' || filterLocation !== 'all')
                          ? `Active: ${[
                              filterReason !== 'all' ? 'Reason' : null,
                              filterPosition !== 'all' ? 'Position' : null,
                              filterLocation !== 'all' ? 'Location' : null
                            ].filter(Boolean).join(', ')}`
                          : 'No active filters applied'}
                      </span>
                    </div>
                    
                    {showFilterDropdown && (
                      <div className="filters-dropdown-card">
                        <div className="filters-dropdown-header">
                          <span className="filters-dropdown-title">FILTER LEADS</span>
                          <span className="filters-dropdown-count">Showing {filteredFeedLeads.length} leads</span>
                        </div>
                        
                        <div className="filters-selectors-column">
                          {/* Selector 1: Match Reason */}
                          <div className="selector-group">
                            <label className="selector-label">MATCH REASON</label>
                            <select 
                              value={filterReason} 
                              onChange={(e) => setFilterReason(e.target.value)}
                              className="rixly-filter-select"
                            >
                              <option value="all">All Reasons</option>
                              <option value="owner">Problem Owner</option>
                              <option value="seeker">Solution Seeker</option>
                            </select>
                          </div>

                          {/* Selector 2: Position */}
                          <div className="selector-group">
                            <label className="selector-label">POSITION</label>
                            <select 
                              value={filterPosition} 
                              onChange={(e) => setFilterPosition(e.target.value)}
                              className="rixly-filter-select"
                            >
                              <option value="all">All Positions</option>
                              <option value="vp">Vice President</option>
                              <option value="director">Director</option>
                              <option value="founder">Co-Founder</option>
                              <option value="manager">Manager</option>
                            </select>
                          </div>

                          {/* Selector 3: Location */}
                          <div className="selector-group">
                            <label className="selector-label">LOCATION</label>
                            <select 
                              value={filterLocation} 
                              onChange={(e) => setFilterLocation(e.target.value)}
                              className="rixly-filter-select"
                            >
                              <option value="all">All Locations</option>
                              <option value="ny">New York, US</option>
                              <option value="sf">San Francisco, US</option>
                              <option value="london">London, UK</option>
                              <option value="chicago">Chicago, US</option>
                              <option value="toronto">Toronto, CA</option>
                            </select>
                          </div>
                        </div>
                        
                        <button 
                          className="save-filters-btn" 
                          onClick={() => setShowFilterDropdown(false)}
                        >
                          Save Filters
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Sorting Dropdown Wrapper */}
                  <div className="sorting-dropdown-wrapper">
                    <button 
                      className={`filter-toggle-icon-btn ${showSortDropdown ? 'active' : ''} ${sortBy !== 'default' ? 'has-active-filters' : ''}`}
                      onClick={() => {
                        setShowSortDropdown(!showSortDropdown);
                        setShowFilterDropdown(false);
                      }}
                    >
                      <ArrowUpDown size={16} />
                      {sortBy !== 'default' && (
                        <span className="filter-active-indicator-dot"></span>
                      )}
                    </button>
                    
                    {/* Tooltip */}
                    <div className="filter-button-custom-tooltip">
                      <span className="tooltip-title">Sort Leads</span>
                      <span className="tooltip-desc">
                        {sortBy === 'default' ? 'Default order' : `Sorted: ${sortBy}`}
                      </span>
                    </div>

                    {showSortDropdown && (
                      <div className="sort-dropdown-card">
                        <div className="sort-dropdown-header">
                          <span className="sort-dropdown-title">SORT LEADS</span>
                        </div>
                        
                        <div className="sort-options-list">
                          {[
                            { key: 'default', label: 'Default Sorter' },
                            { key: 'date-desc', label: 'Date: Newest to Oldest' },
                            { key: 'date-asc', label: 'Date: Oldest to Newest' },
                            { key: 'name-asc', label: 'Alphabetical (A - Z)' },
                            { key: 'rating-desc', label: 'Rating: High to Low' },
                            { key: 'rating-asc', label: 'Rating: Low to High' }
                          ].map(opt => (
                            <button 
                              key={opt.key}
                              className={`sort-option-btn ${sortBy === opt.key ? 'active' : ''}`}
                              onClick={() => {
                                setSortBy(opt.key as any);
                                setShowSortDropdown(false);
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>



              {/* Master List of Leads */}
              <div className="rixly-leads-compact-list" style={{ position: 'relative' }}>
                <AnimatePresence>
                  {filteredFeedLeads.length > 0 ? (
                    filteredFeedLeads.map((item) => {
                      const persona = getLeadPersona(item);
                      const isArchived = item.status === 'archived' || activeTab === 'archived';

                      return (
                        <motion.div 
                          layout
                          initial={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9, x: -60, height: 0, marginBottom: 0, padding: 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                          key={item.id} 
                          className={`rixly-lead-compact-row ${persona.type} ${activeFeedLead?.id === item.id ? 'active-selection' : ''} ${animatingLeadId === item.id ? 'animating-away' : ''}`}
                          onClick={() => setSelectedFeedLeadId(item.id)}
                          style={{ overflow: 'hidden', flexShrink: 0, height: 72, minHeight: 72 }}
                        >
                          <div className="profile-avatar-badge" style={{ backgroundColor: `${item.avatarColor}15`, color: item.avatarColor, border: `1px solid ${item.avatarColor}30` }}>
                            {item.profilePic ? (
                              <img src={item.profilePic} alt={item.name} className="avatar-img-circle" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <span>{item.avatarText}</span>
                            )}
                          </div>
                          
                          <div className="lead-compact-row-meta">
                            <span className="profile-full-name">{item.name}</span>
                            <span className="profile-position-label">{item.positionLabel}</span>
                          </div>

                          <div className="lead-compact-row-center-intent">
                            <span className="row-intent-header">Intent Signal</span>
                            <span className={`compact-intent-tag ${item.category}`}>{item.flameSignal || 'High Intent Match'}</span>
                          </div>

                          {/* Unarchive Quick Action (if archived) or Star Rating */}
                          {isArchived ? (
                            <button 
                              className="row-unarchive-action-btn"
                              onClick={(e) => handleUnarchiveLead(item.id, e)}
                              title="Unarchive lead and restore back to Leads Feed"
                            >
                              <RotateCcw size={11} style={{ marginRight: 4 }} />
                              <span>Unarchive</span>
                            </button>
                          ) : (
                            <div className="lead-compact-star-rating">
                              <Star size={10} fill="var(--rixly-amber)" stroke="var(--rixly-amber)" />
                              <span>{Math.round(item.fitScore / 10)}</span>
                            </div>
                          )}
                        </motion.div>
                      );
                    })
                  ) : activeTab === 'archived' ? (
                    <div className="no-filtered-leads-fallback compact">
                      <Archive size={22} className="no-results-icon" />
                      <h3>No archived profiles</h3>
                      <p>Profiles you archive will appear here. You can unarchive them at any time to restore them to the feed.</p>
                    </div>
                  ) : (
                    /* Clean & Friendly Social Intent Radar Live Scanning Animation UI */
                    <div className="clean-leads-empty-view">
                      <div className="clean-empty-radar-disc">
                        <div className="clean-radar-ping"></div>
                        <Sparkles size={22} className="clean-radar-sparkle" />
                      </div>

                      <div className="clean-radar-pill">
                        <span className="live-status-dot"></span>
                        <span>Scanning {platformTab === 'linkedin' ? 'LinkedIn' : 'Reddit'} in Real-Time</span>
                      </div>

                      <h3 className="clean-empty-title">All Caught Up!</h3>
                      <p className="clean-empty-desc">
                        Our AI is actively listening for discussions, pain points, and tool inquiries matching your keywords on {platformTab === 'linkedin' ? 'LinkedIn' : 'Reddit'}. New intent leads will appear here automatically.
                      </p>

                      <div className="clean-empty-actions">
                        <button 
                          className="clean-instant-scan-btn"
                          onClick={handleRunScan}
                          disabled={isScanning}
                        >
                          {isScanning ? (
                            <>
                              <Loader2 size={13} className="spin-loader" />
                              <span>Scanning now...</span>
                            </>
                          ) : (
                            <>
                              <Zap size={13} />
                              <span>Run Instant Scan</span>
                            </>
                          )}
                        </button>

                        <button 
                          className="clean-restore-btn"
                          onClick={() => {
                            setLeadsFeed(INITIAL_FEED_LEADS);
                            localStorage.setItem('rixly_leads_feed', JSON.stringify(INITIAL_FEED_LEADS));
                          }}
                          title="Restore all demo leads"
                        >
                          <RotateCcw size={12} style={{ marginRight: 5 }} />
                          Restore Leads
                        </button>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column: Detailed Profiling Console */}
            <div className="leads-split-right-pane">
              {activeFeedLead ? (
                (() => {
                  const isLeadArchived = (activeFeedLead.status as string) === 'archived' || activeTab === 'archived';
                  return (
                    <div className="leads-detail-profiling-console">
                      {/* Top Archived Banner Alert if lead is archived */}
                      {isLeadArchived && (
                        <div className="detail-archived-notice-banner">
                          <div className="archived-notice-left">
                            <Archive size={14} className="archived-banner-icon" />
                            <div>
                              <strong>Archived Profile</strong>
                              <p>This lead is currently in Archive. Unarchive to restore it back to your active discovery Leads Feed.</p>
                            </div>
                          </div>
                          <button 
                            className="unarchive-banner-btn"
                            onClick={() => handleUnarchiveLead(activeFeedLead.id)}
                          >
                            <RotateCcw size={12} style={{ marginRight: 5 }} />
                            Unarchive Lead
                          </button>
                        </div>
                      )}

                      {/* Header Details */}
                      <div className="detail-pane-header">
                        <div className="detail-avatar-container" style={{ backgroundColor: `${activeFeedLead.avatarColor}15`, color: activeFeedLead.avatarColor, border: `1px solid ${activeFeedLead.avatarColor}30` }}>
                            {activeFeedLead.profilePic ? (
                              <img src={activeFeedLead.profilePic} alt={activeFeedLead.name} className="avatar-img-circle" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            ) : (
                              <span>{activeFeedLead.avatarText}</span>
                            )}
                          </div>
                        <div className="detail-meta-stack">
                          <div className="detail-name-row">
                            <h2>{activeFeedLead.name}</h2>
                            
                            <div className="profile-detail-actions-tray">
                              {/* Heart (Favorite List) */}
                              <div className="action-tooltip-wrapper">
                                <button 
                                  className={`profile-action-tray-btn heart-btn ${favoritedLeads.includes(activeFeedLead.id) ? 'active' : ''}`}
                                  onClick={() => toggleFavoriteLead(activeFeedLead.id)}
                                >
                                  <Heart size={14} fill={favoritedLeads.includes(activeFeedLead.id) ? '#ef4444' : 'none'} stroke={favoritedLeads.includes(activeFeedLead.id) ? '#ef4444' : 'currentColor'} />
                                </button>
                                <span className="action-tooltip-text">Favorite list</span>
                              </div>

                              {/* Bookmark (Save for Later) */}
                              <div className="action-tooltip-wrapper">
                                <button 
                                  className={`profile-action-tray-btn save-btn ${savedLeads.includes(activeFeedLead.id) ? 'active' : ''}`}
                                  onClick={() => toggleSaveLead(activeFeedLead.id)}
                                >
                                  <Bookmark size={14} fill={savedLeads.includes(activeFeedLead.id) ? '#3b82f6' : 'none'} stroke={savedLeads.includes(activeFeedLead.id) ? '#3b82f6' : 'currentColor'} />
                                </button>
                                <span className="action-tooltip-text">Save for later</span>
                              </div>

                              {/* Rate (All 5 Stars Visible with Subheading) */}
                              <div className="profile-rating-match-container">
                                <span className="profile-rating-subheading">Rate this match</span>
                                <div className="profile-5star-rating-row">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button 
                                      key={star} 
                                      className="profile-action-tray-star-btn"
                                      onClick={() => setLeadRating(activeFeedLead.id, star)}
                                      title={`Rate ${star} Star`}
                                    >
                                      <Star 
                                        size={13} 
                                        fill={star <= (leadsRatings[activeFeedLead.id] || 0) ? 'var(--rixly-amber)' : 'none'} 
                                        stroke={star <= (leadsRatings[activeFeedLead.id] || 0) ? 'var(--rixly-amber)' : 'currentColor'} 
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className="detail-position-lbl">{activeFeedLead.positionLabel}</span>
                          <span className="detail-location-lbl">{activeFeedLead.locationLabel} • {activeFeedLead.timeLabel}</span>
                        </div>
                      </div>

                      {/* Stats Pill Badges Row */}
                      <div className="detail-badges-row">
                        {/* Persona Intent Tag Badge */}
                        <div className={`detail-persona-tag-pill ${getLeadPersona(activeFeedLead).type}`} title={getLeadPersona(activeFeedLead).sub}>
                          {getLeadPersona(activeFeedLead).type === 'owner' ? (
                            <AlertTriangle size={11} className="persona-badge-icon" />
                          ) : (
                            <Search size={11} className="persona-badge-icon" />
                          )}
                          <span>{getLeadPersona(activeFeedLead).label}</span>
                        </div>

                        <div className="fit-score-capsule-badge">
                          <Star size={12} fill="var(--rixly-amber)" stroke="var(--rixly-amber)" />
                          <span>{Math.round(activeFeedLead.fitScore / 10)} / 10 Rating</span>
                        </div>

                        <button 
                          className={`detail-workflow-btn contacted ${activeFeedLead.status === 'contacted' ? 'active' : ''}`}
                          onClick={() => handleUpdateLeadStatus(activeFeedLead.id, 'contacted')}
                          title="Shift lead to Contacted tab"
                        >
                          <UserCheck size={12} style={{ marginRight: 5 }} />
                          {activeFeedLead.status === 'contacted' ? 'Contacted' : 'Mark Contacted'}
                        </button>

                        {isLeadArchived ? (
                          <button 
                            className="detail-workflow-btn unarchive"
                            onClick={() => handleUnarchiveLead(activeFeedLead.id)}
                            title="Unarchive lead and restore back to Leads Feed"
                          >
                            <RotateCcw size={12} style={{ marginRight: 5 }} />
                            Unarchive Lead
                          </button>
                        ) : (
                          <button 
                            className="detail-workflow-btn archived"
                            onClick={() => handleUpdateLeadStatus(activeFeedLead.id, 'archived')}
                            title="Shift lead to Archived tab"
                          >
                            <Archive size={12} style={{ marginRight: 5 }} />
                            Archive
                          </button>
                        )}
                      </div>

                  {/* Section 1: Post Quote */}
                  <div className="detail-section quote-section">
                    <h3>SOCIAL POST DETECTED</h3>
                    <p className="detail-post-quote">"{activeFeedLead.postQuote}"</p>
                  </div>

                  {/* Section 2: AI Intent Flame Signal */}
                  <div className="detail-section ai-signal-section">
                    <div className="detail-section-header-with-icon">
                      <Sparkles size={12} className="section-header-icon-sparkle" />
                      <h3>WHY THIS PROFILE MATCHES</h3>
                    </div>
                    <div className="detail-ai-signal-highlight">
                      <Flame size={14} className="flame-icon-orange" fill="#f97316" />
                      <span className="ai-signal-label">
                        {activeFeedLead.flameSignal}
                      </span>
                    </div>
                  </div>



                  {/* Section 3: LinkedIn Connect/DM Quick Action block */}
                  <div className="detail-outreach-section">
                    <div className="outreach-header">
                      <Zap size={13} fill="currentColor" stroke="currentColor" />
                      <span>Outbound Outreach Recommendations</span>
                    </div>
                    <p className="outreach-body">
                      Generate message sequences and customize them using the copywriting Personalizer.
                    </p>
                    <button 
                      className="engage-post-cta-btn-large"
                      onClick={() => handleEngageFeedLead(activeFeedLead)}
                    >
                      Personalize & Engage
                    </button>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="no-lead-selected-fallback live-radar">
              <div className="listening-radar-icon-box">
                <div className="listening-pulse-ring"></div>
                <Sparkles size={24} className="listening-icon" />
              </div>
              <h3>Social Intent Radar Online</h3>
              <p>
                Currently listening on {platformTab === 'linkedin' ? 'LinkedIn' : 'Reddit'} for conversations, buying intent, and operational pain points matching your criteria.
              </p>
              <div className="listening-stats-pill">
                <span className="listening-dot"></span>
                <span>Ready to Personalize & Engage</span>
              </div>
            </div>
          )}
            </div>
          </div>
        ) : activeTab === 'crm' ? (
          <CRMLayout />
        ) : activeTab === 'playbook' ? (
          /* Asymmetrical Tactical Dashboard */
          <div className="rixly-playbook-asymmetric-workspace">
            {/* Playbook Header */}
            <header className="playbook-top-header">
              <div className="playbook-tag-badge">
                <Sparkles size={8} fill="var(--rixly-blue)" stroke="var(--rixly-blue)" style={{ marginRight: 4 }} />
                <span>THE RIXLY PLAYBOOK</span>
              </div>
              <h1 className="playbook-main-title">
                Mastering Your <span className="highlight-gold">Growth Engine</span>
              </h1>
              <p className="playbook-subtitle">
                A simple guide to find prospects and turn conversations into customers.
              </p>
            </header>

            {/* Balanced Flow Layout to prevent any empty vertical column spacing */}
            <div className="playbook-balanced-flow">
              
              {/* Row 1: Full-width Interactive Sandbox */}
              <div className="playbook-row-full">
                {/* INTERACTIVE KEYWORD SIMULATOR SANDBOX */}
                <div className="radar-interactive-browser-mockup">
                  <div className="browser-header-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  
                  <div className="browser-input-row">
                    <Search size={10} className="search-icon" />
                    <input 
                      type="text" 
                      value={sandboxKeyword}
                      onChange={(e) => handleSandboxKeywordChange(e.target.value)}
                      placeholder="Enter keywords..."
                      className="browser-url-input"
                    />
                  </div>

                  <div className="browser-body-content">
                    <span className="sandbox-card-title">LinkedIn Keyword Search Sandbox</span>
                    
                    <div className="sandbox-keyword-pill-selector">
                      <button 
                        className={`pill-btn ${sandboxKeyword === 'lead' ? 'active' : ''}`}
                        onClick={() => handleSandboxKeywordChange('lead')}
                      >
                        Broad: "lead"
                      </button>
                      <button 
                        className={`pill-btn ${sandboxKeyword === 'linkedin outreach automation' ? 'active' : ''}`}
                        onClick={() => handleSandboxKeywordChange('linkedin outreach automation')}
                      >
                        Specific: "linkedin outreach automation"
                      </button>
                      <button 
                        className={`pill-btn ${sandboxKeyword === 'competitor alternatives' ? 'active' : ''}`}
                        onClick={() => handleSandboxKeywordChange('competitor alternatives')}
                      >
                        Competitor Match
                      </button>
                    </div>

                    <div className="sandbox-metrics-grid">
                      <div className="metric-box">
                        <span className="val">{sandboxQueryCount}</span>
                        <span className="lbl">Leads Found</span>
                      </div>
                      <div className="metric-box">
                        <span className="val">{sandboxNoiseRatio}</span>
                        <span className="lbl">Noise Ratio</span>
                      </div>
                      <div className="metric-box">
                        <span className="val">{sandboxConfidence}%</span>
                        <span className="lbl">Fit Index</span>
                      </div>
                    </div>

                    <div className="sandbox-sample-post-box">
                      <span className="sample-header">Simulated Active Post Snippet</span>
                      <p className="sample-text">"{sandboxSample}"</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Tuning Radar & Rixly Pro-Tips Side-by-Side */}
              <div className="playbook-row-split-two">
                {/* Tuning Radar Bulletins card */}
                <div className="playbook-radar-section-compact">
                  <div className="radar-header-inline">
                    <div className="radar-icon-decor">
                      <Compass size={14} />
                    </div>
                    <h2 className="radar-section-title">
                      Tuning Your <span className="highlight-gold">Radar</span>
                    </h2>
                  </div>
                  
                  <div className="radar-bullets-list">
                    <div className="bullet-row-item">
                      <div className="bullet-number">1</div>
                      <div className="bullet-content">
                        <h4>LinkedIn Keywords</h4>
                        <p>Broad B2B terms find MORE noise; specific intent filters find BETTER prospects.</p>
                      </div>
                    </div>

                    <div className="bullet-row-item">
                      <div className="bullet-number">2</div>
                      <div className="bullet-content">
                        <h4>Competitor Alerts</h4>
                        <p>Track LinkedIn mentions of competing products to pitch alternatives.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rixly Pro-Tips List */}
                <div className="playbook-protips-console-stack">
                  <h2 className="radar-section-title">Rixly Pro-Tips for Real Growth</h2>
                  
                  <div className="protips-vertical-list">
                    {/* Protip 1 */}
                    <div className="protip-card-item-horizontal">
                      <div className="protip-icon-badge">
                        <HelpCircle size={14} />
                      </div>
                      <div className="protip-content-text">
                        <h4>Value Over Pitch</h4>
                        <p>Add value to their LinkedIn post first. Avoid generic pitching.</p>
                      </div>
                    </div>

                    {/* Protip 2 */}
                    <div className="protip-card-item-horizontal">
                      <div className="protip-icon-badge">
                        <Users size={14} />
                      </div>
                      <div className="protip-content-text">
                        <h4>Keep it Human</h4>
                        <p>Customize outbound InMails to sound authentic and personal.</p>
                      </div>
                    </div>

                    {/* Protip 3 */}
                    <div className="protip-card-item-horizontal">
                      <div className="protip-icon-badge">
                        <CheckCircle size={14} />
                      </div>
                      <div className="protip-content-text">
                        <h4>Consistency Wins</h4>
                        <p>Follow up within 24 hours. LinkedIn prospects convert faster with quick replies.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: Hot Leads & Opportunities Strategies Side-by-Side */}
              <div className="playbook-row-split-two">
                {/* Direct Wins Card */}
                <div className="playbook-strategy-card">
                  <div className="strategy-card-header-row">
                    <div className="strategy-icon-box orange">
                      <Flame size={16} fill="#f97316" />
                    </div>
                    <h3 className="strategy-card-title">Leads (Direct Wins)</h3>
                  </div>
                  <p className="strategy-card-desc">
                    Direct buyers asking for a solution or sharing a specific pain point.
                  </p>
                  <div className="strategy-box-action bg-orange">
                    <div className="strategy-action-header">
                      <Zap size={12} fill="var(--rixly-blue)" stroke="var(--rixly-blue)" />
                      <span>Your Best Strategy: Send LinkedIn InMails/DMs</span>
                    </div>
                    <p className="strategy-action-body">
                      Generate custom LinkedIn message sequences and connect.
                    </p>
                  </div>
                </div>

                {/* Opportunities Awareness Card */}
                <div className="playbook-strategy-card">
                  <div className="strategy-card-header-row">
                    <div className="strategy-icon-box gold">
                      <Target size={16} />
                    </div>
                    <h3 className="strategy-card-title">Opportunities (Awareness)</h3>
                  </div>
                  <p className="strategy-card-desc">
                    Broader discussions or competitor mentions to build brand presence.
                  </p>
                  <div className="strategy-box-action bg-gold">
                    <div className="strategy-action-header">
                      <MessageSquare size={12} />
                      <span>Your Best Strategy: Comment publicly</span>
                    </div>
                    <p className="strategy-action-body">
                      Comment on their LinkedIn post to build trust, then request connection.
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom CTA Banner */}
            <div className="playbook-cta-banner">
              <h2>Ready to find your first client?</h2>
              <p>Start by checking your Leads. There's almost certainly someone looking for your product right now.</p>
              
              <button className="playbook-back-dashboard-btn" onClick={() => setActiveTab('dashboard')}>
                Back to Dashboard
              </button>
            </div>

          </div>
        ) : activeTab === 'notifications' ? (
          /* Notifications full workspace screen */
          <div className="rixly-notifications-workspace">
            <h1 className="notifications-main-title">Notifications</h1>
            
            <div className="notifications-filter-bar">
              <div className="notifications-filter-pill-container">
                <button 
                  className={`notif-filter-pill ${notifFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setNotifFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`notif-filter-pill ${notifFilter === 'unread' ? 'active' : ''}`}
                  onClick={() => setNotifFilter('unread')}
                >
                  Unread
                </button>
              </div>
            </div>

            <div className="notifications-empty-state-card">
              <div className="notif-bell-off-circle">
                <BellOff size={24} />
              </div>
              <h3 className="notif-empty-title">No notifications yet</h3>
              <p className="notif-empty-desc">
                New notifications from your lead monitoring will appear here.
              </p>
            </div>
          </div>

        ) : (
          // Placeholder views for non-dashboard tabs to maintain functional interface
          <div className="fallback-view-container">
            <h2 className="fallback-title">Studio Module: {activeTab.toUpperCase()}</h2>
            <p className="fallback-desc">
              This workspace coordinates asset allocations and playbooks for {activeTab}. 
              Switch back to the "Dashboard" tab in the left sidebar to access your main management board.
            </p>
          </div>
        )}
      </div>

      {/* Slide-out personalization drawer */}
      <ProspectDrawer 
        lead={selectedLead} 
        onClose={() => setSelectedLead(null)}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* 5-Step Interactive Onboarding Setup Wizard */}
      <OnboardingModal 
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onComplete={(p) => setOnboardingProfile(p)}
      />

      {/* Unified Profile Settings Pop-up Modal */}
      <ProfileSettings 
        isOpen={showProfileModal || activeTab === 'profile'}
        onClose={() => {
          setShowProfileModal(false);
          if (activeTab === 'profile') setActiveTab('dashboard');
        }}
      />

      {/* Global Profile Saved Toast */}
      {profileSavedToast && (
        <div className="profile-toast success">
          <CheckCircle size={14} className="toast-icon" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Unarchive Confirmation Toast */}
      {unarchiveToast.show && (
        <div className="profile-toast success">
          <RotateCcw size={14} className="toast-icon" />
          <span>{unarchiveToast.name} unarchived and restored to Leads Feed!</span>
        </div>
      )}




    </div>
  );
}

export default function AppWrapper() {
  return (
    <CRMProvider>
      <App />
    </CRMProvider>
  );
}
