export type ClientType = 'all' | 'business' | 'individual';

export interface ServiceItem {
  id: string;
  title: string;
  category: 'business' | 'individual';
  shortDesc: string;
  fullDesc: string;
  deliverables: string[];
  estimatedDays: string;
  priceRange?: string;
  iconName: string;
  popular?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  clientName: string;
  clientType: 'business' | 'individual';
  category: 'personal_memoir' | 'corporate_legacy' | 'executive_biography' | 'editorial_editing';
  categoryLabel: string;
  coverImage?: string;
  shortSnippet: string;
  fullContentSnippet: string;
  strategyChallenge: string;
  solutionAndTone: string;
  metrics: {
    label: string;
    value: string;
  }[];
  tags: string[];
  year: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface WorkflowStage {
  stepNumber: number;
  roleTitle: string;
  roleSubtitle: string;
  iconName: string;
  tasks: string[];
  deliverable: string;
}

export interface ConsultationType {
  id: string;
  title: string;
  duration: string;
  targetAudience: string;
  description: string;
  badge: string;
  price?: string;
}

export interface BookingData {
  id: string;
  createdAt: string;
  consultationTypeId: string;
  consultationTitle: string;
  clientType: 'business' | 'individual';
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  date: string;
  timeSlot: string;
  projectBrief: string;
  status: 'confirmed' | 'pending';
  emailNotificationSent?: boolean;
  emailSentAt?: string;
}

export interface AIBriefRequest {
  topicOrIndustry: string;
  clientType: 'business' | 'individual';
  targetAudience?: string;
  goal?: string;
}

export interface AIBriefResponse {
  titleIdea: string;
  targetAudienceAnalysis: string;
  recommendedTone: string;
  contentStructure: string[];
  keyHighlights: string[];
  suggestedService: string;
  estimatedTimeline: string;
}
