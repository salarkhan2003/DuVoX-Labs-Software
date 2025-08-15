// Site configuration
export const SITE_CONFIG = {
  name: 'DuVoX',
  description:
    'Futuristic technology startup specializing in AI and embedded systems',
  url: 'https://duvox.com',
  ogImage: '/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/duvox',
    github: 'https://github.com/duvox',
    linkedin: 'https://linkedin.com/company/duvox',
  },
} as const;

// Product information
export const PRODUCTS = {
  CRADAI: {
    name: 'DuVoX CradAI',
    description: 'Advanced AI-powered solutions for modern businesses',
    category: 'AI' as const,
  },
  MOBILITY: {
    name: 'DuVoX Mobility Co-Pilot',
    description: 'Intelligent mobility and transportation solutions',
    category: 'Mobility' as const,
  },
} as const;

// Animation configuration
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
  },
  easing: {
    easeIn: [0.4, 0, 1, 1],
    easeOut: [0, 0, 0.2, 1],
    easeInOut: [0.4, 0, 0.2, 1],
  },
} as const;

// Breakpoints (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;
