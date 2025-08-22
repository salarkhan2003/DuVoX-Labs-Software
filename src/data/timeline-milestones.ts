import type { TimelineMilestone } from '@/components/ui/interactive-timeline';

export const timelineMilestones: TimelineMilestone[] = [
  {
    id: 'development-2025',
    year: '2025',
    title: 'Product Development',
    description: 'Intensive development phase for CradAI and Mobility Co-Pilot, focusing on embedded AI solutions that work at the edge.',
    details: 'Our engineering teams are working around the clock to bring revolutionary AI solutions to healthcare and mobility sectors, with a focus on edge computing and real-time processing.',
    icon: 'rocket',
    category: 'development',
    achievements: [
      'CradAI prototype development for infant monitoring',
      'Mobility Co-Pilot alpha version for autonomous navigation',
      'Edge AI optimization for real-time processing',
      'Clinical trials preparation and regulatory compliance',
      'Strategic partnerships with healthcare providers'
    ]
  },
  {
    id: 'launch-2026',
    year: '2026',
    title: 'Market Launch',
    description: 'First products launching to transform healthcare and mobility industries with practical AI solutions.',
    details: 'After extensive testing and validation, we are ready to bring our AI solutions to market, starting with healthcare applications and expanding to mobility solutions.',
    icon: 'users',
    category: 'launch',
    achievements: [
      'CradAI commercial launch in healthcare facilities',
      'Mobility Co-Pilot beta release for select partners',
      'FDA approval for medical device applications',
      'International expansion planning',
      'Customer success and support team establishment'
    ]
  },
  {
    id: 'growth-2027',
    year: '2027',
    title: 'Scale & Innovation',
    description: 'Expanding our AI solutions globally while continuing to innovate and develop next-generation technologies.',
    details: 'Building on our initial success, we are scaling our operations globally and investing in next-generation AI technologies that will shape the future of human-AI interaction.',
    icon: 'calendar',
    category: 'growth',
    achievements: [
      'Global market expansion across 15+ countries',
      'Next-generation AI models with improved accuracy',
      'Integration with major healthcare and mobility platforms',
      'Research partnerships with top universities',
      'Open-source contributions to AI community'
    ]
  }
];

// Content management functions
export function getMilestoneById(id: string): TimelineMilestone | undefined {
  return timelineMilestones.find(milestone => milestone.id === id);
}

export function getMilestonesByCategory(category: TimelineMilestone['category']): TimelineMilestone[] {
  return timelineMilestones.filter(milestone => milestone.category === category);
}

export function getMilestonesByYear(year: string): TimelineMilestone[] {
  return timelineMilestones.filter(milestone => milestone.year === year);
}

export function addMilestone(milestone: TimelineMilestone): TimelineMilestone[] {
  return [...timelineMilestones, milestone].sort((a, b) => parseInt(a.year) - parseInt(b.year));
}

export function updateMilestone(id: string, updates: Partial<TimelineMilestone>): TimelineMilestone[] {
  return timelineMilestones.map(milestone => 
    milestone.id === id ? { ...milestone, ...updates } : milestone
  );
}

export function deleteMilestone(id: string): TimelineMilestone[] {
  return timelineMilestones.filter(milestone => milestone.id !== id);
}