/**
 * Typography utility library for the futuristic startup website
 * Provides type-safe typography classes and font loading utilities
 */

// Typography scale definitions
export const TYPOGRAPHY_SCALES = {
  hero: 'text-hero font-black',
  display: 'text-display font-extrabold',
  heading: 'text-heading font-bold',
  subheading: 'text-subheading font-semibold',
  'body-lg': 'text-body-lg font-normal',
  body: 'text-body font-normal',
  'body-sm': 'text-body-sm font-normal',
  caption: 'text-caption font-medium',
} as const;

// Font weight utilities
export const FONT_WEIGHTS = {
  light: 'font-light',
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
  black: 'font-black',
} as const;

// Typography variants for different use cases
export const TYPOGRAPHY_VARIANTS = {
  // Hero section typography
  heroTitle: 'text-hero font-black text-gradient text-balance',
  heroSubtitle: 'text-subheading font-medium text-secondary text-pretty',
  
  // Section headings
  sectionTitle: 'text-display font-extrabold text-primary text-balance',
  sectionSubtitle: 'text-heading font-bold text-primary text-balance',
  sectionDescription: 'text-body-lg font-normal text-secondary text-pretty',
  
  // Card typography
  cardTitle: 'text-heading font-bold text-primary text-balance',
  cardSubtitle: 'text-subheading font-semibold text-secondary text-balance',
  cardDescription: 'text-body font-normal text-secondary text-pretty',
  
  // Navigation typography
  navLink: 'text-body font-medium text-secondary hover:text-primary transition-colors',
  navLinkActive: 'text-body font-semibold text-primary',
  
  // Button typography
  buttonPrimary: 'text-body font-semibold text-white',
  buttonSecondary: 'text-body font-medium text-primary',
  buttonGhost: 'text-body font-medium text-secondary hover:text-primary',
  
  // Form typography
  formLabel: 'text-body-sm font-medium text-primary',
  formInput: 'text-body font-normal text-primary placeholder:text-secondary',
  formError: 'text-body-sm font-medium text-red-500',
  formHelper: 'text-body-sm font-normal text-secondary',
  
  // Footer typography
  footerTitle: 'text-subheading font-semibold text-primary',
  footerLink: 'text-body-sm font-normal text-secondary hover:text-primary transition-colors',
  footerCopyright: 'text-caption font-normal text-secondary',
} as const;

// Gradient text utilities
export const TEXT_GRADIENTS = {
  primary: 'text-gradient',
  blue: 'text-gradient-blue',
  purple: 'text-gradient-purple',
  cyan: 'text-gradient-cyan',
} as const;

// Font feature settings for different contexts
export const FONT_FEATURES = {
  default: 'font-feature-default',
  numbers: 'font-feature-numbers',
  smallCaps: 'font-feature-small-caps',
} as const;

// Text wrapping utilities
export const TEXT_WRAP = {
  balance: 'text-balance',
  pretty: 'text-pretty',
} as const;

// Type definitions
export type TypographyScale = keyof typeof TYPOGRAPHY_SCALES;
export type FontWeight = keyof typeof FONT_WEIGHTS;
export type TypographyVariant = keyof typeof TYPOGRAPHY_VARIANTS;
export type TextGradient = keyof typeof TEXT_GRADIENTS;
export type FontFeature = keyof typeof FONT_FEATURES;
export type TextWrap = keyof typeof TEXT_WRAP;

/**
 * Get typography classes for a specific scale
 */
export function getTypographyScale(scale: TypographyScale): string {
  return TYPOGRAPHY_SCALES[scale];
}

/**
 * Get font weight class
 */
export function getFontWeight(weight: FontWeight): string {
  return FONT_WEIGHTS[weight];
}

/**
 * Get typography variant classes
 */
export function getTypographyVariant(variant: TypographyVariant): string {
  return TYPOGRAPHY_VARIANTS[variant];
}

/**
 * Get text gradient classes
 */
export function getTextGradient(gradient: TextGradient): string {
  return TEXT_GRADIENTS[gradient];
}

/**
 * Combine typography classes with custom classes
 */
export function combineTypography(
  variant: TypographyVariant,
  customClasses?: string
): string {
  const baseClasses = getTypographyVariant(variant);
  return customClasses ? `${baseClasses} ${customClasses}` : baseClasses;
}

/**
 * Font loading configuration
 */
export const FONT_CONFIG = {
  family: 'Montserrat',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  weights: [300, 400, 500, 600, 700, 800, 900],
  subsets: ['latin', 'latin-ext'],
  display: 'swap' as const,
  variable: '--font-sans',
  preload: true,
  adjustFontFallback: true,
};

/**
 * Critical font weights for preloading
 */
export const CRITICAL_FONT_WEIGHTS = [400, 600, 700];

/**
 * Font loading URLs for preloading
 */
export const FONT_PRELOAD_URLS = [
  // Regular (400)
  'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2',
  // SemiBold (600)
  'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459W1hyyTh89Y.woff2',
  // Bold (700)
  'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459WRhyyTh89Y.woff2',
];

/**
 * Check if font is loaded
 */
export function isFontLoaded(fontFamily: string = 'Montserrat'): boolean {
  if (typeof document === 'undefined') return false;
  
  try {
    return document.fonts.check(`1rem ${fontFamily}`);
  } catch {
    return false;
  }
}

/**
 * Wait for font to load
 */
export async function waitForFont(
  fontFamily: string = 'Montserrat',
  timeout: number = 3000
): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  
  try {
    await document.fonts.load(`1rem ${fontFamily}`);
    return await Promise.race([
      document.fonts.ready.then(() => true),
      new Promise<boolean>((resolve) => setTimeout(() => resolve(false), timeout))
    ]);
  } catch {
    return false;
  }
}

/**
 * Get font loading status
 */
export function getFontLoadingStatus(): 'loading' | 'loaded' | 'error' {
  if (typeof document === 'undefined') return 'loading';
  
  try {
    if (document.fonts.status === 'loaded') return 'loaded';
    if (document.fonts.status === 'loading') return 'loading';
    return 'error';
  } catch {
    return 'error';
  }
}

/**
 * Typography responsive breakpoints
 */
export const TYPOGRAPHY_BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

/**
 * Generate responsive typography classes
 */
export function getResponsiveTypography(
  base: TypographyVariant,
  responsive?: Partial<Record<keyof typeof TYPOGRAPHY_BREAKPOINTS, TypographyVariant>>
): string {
  let classes = getTypographyVariant(base);
  
  if (responsive) {
    Object.entries(responsive).forEach(([breakpoint, variant]) => {
      if (variant) {
        const responsiveClass = getTypographyVariant(variant);
        classes += ` ${breakpoint}:${responsiveClass}`;
      }
    });
  }
  
  return classes;
}

/**
 * Typography accessibility helpers
 */
export const TYPOGRAPHY_A11Y = {
  // Minimum contrast ratios
  contrastRatios: {
    normal: 4.5,
    large: 3,
    enhanced: 7,
  },
  
  // Recommended line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Maximum line lengths for readability
  maxLineLength: {
    characters: 75,
    words: 12,
  },
} as const;

/**
 * Validate typography accessibility
 */
export function validateTypographyA11y(
  fontSize: number,
  lineHeight: number,
  contrast: number
): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check contrast ratio
  const isLargeText = fontSize >= 18 || (fontSize >= 14 && lineHeight >= 1.2);
  const minContrast = isLargeText ? TYPOGRAPHY_A11Y.contrastRatios.large : TYPOGRAPHY_A11Y.contrastRatios.normal;
  
  if (contrast < minContrast) {
    issues.push(`Contrast ratio ${contrast} is below minimum ${minContrast}`);
  }
  
  // Check line height
  if (lineHeight < TYPOGRAPHY_A11Y.lineHeights.normal) {
    issues.push(`Line height ${lineHeight} is below recommended ${TYPOGRAPHY_A11Y.lineHeights.normal}`);
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
}