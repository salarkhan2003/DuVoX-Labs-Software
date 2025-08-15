// Common types used throughout the application

export interface Product {
  id: string;
  name: string;
  description: string;
  features: string[];
  images: string[];
  category: 'AI' | 'Mobility';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  socialLinks: SocialLink[];
}

export interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'email';
  url: string;
}

export interface ContactForm {
  name: string;
  email: string;
  company?: string;
  message: string;
  interest: 'CradAI' | 'Mobility' | 'Partnership' | 'Other';
}

export interface CTAButton {
  text: string;
  href: string;
  variant: 'primary' | 'secondary' | 'outline';
  icon?: React.ReactNode;
}

export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: number[];
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  company?: string;
  message: string;
  interest: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sessionId: string;
}
