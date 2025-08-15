/**
 * Typography test component for development and testing
 * This component showcases all typography variants and font weights
 */

'use client';

import { useFontLoading, usePreloadFonts } from '@/hooks/use-font-loading';
import { 
  FONT_WEIGHTS, 
  TEXT_GRADIENTS,
  getTypographyVariant
} from '@/lib/typography';

export function TypographyTest() {
  const fontLoading = useFontLoading();
  const preloadStatus = usePreloadFonts();

  return (
    <div className="min-h-screen bg-background p-8 space-y-12">
      {/* Font Loading Status */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-primary">Font Loading Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold text-primary">Loading State</h3>
            <p className="text-secondary">
              {fontLoading.isLoading ? 'Loading...' : 'Complete'}
            </p>
            <p className="text-sm text-secondary">
              Loaded: {fontLoading.isLoaded ? 'Yes' : 'No'}
            </p>
            <p className="text-sm text-secondary">
              Error: {fontLoading.hasError ? 'Yes' : 'No'}
            </p>
          </div>
          
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold text-primary">Font Weights</h3>
            <p className="text-sm text-secondary">
              Loaded: {fontLoading.loadedWeights.join(', ')}
            </p>
            <p className="text-sm text-secondary">
              Failed: {fontLoading.failedWeights.join(', ') || 'None'}
            </p>
          </div>
          
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold text-primary">Preload Status</h3>
            <p className="text-sm text-secondary">
              Progress: {preloadStatus.preloadedCount}/{preloadStatus.totalCount}
            </p>
            <p className="text-sm text-secondary">
              Preloading: {preloadStatus.isPreloading ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </section>

      {/* Typography Scales */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Typography Scales</h2>
        <div className="space-y-4">
          <div className="p-6 border border-border rounded-lg">
            <h3 className={getTypographyVariant('heroTitle')}>
              Hero Title - The Future is Now
            </h3>
            <p className={getTypographyVariant('heroSubtitle')}>
              Hero subtitle with secondary text styling
            </p>
          </div>
          
          <div className="p-6 border border-border rounded-lg">
            <h3 className={getTypographyVariant('sectionTitle')}>
              Section Title
            </h3>
            <h4 className={getTypographyVariant('sectionSubtitle')}>
              Section Subtitle
            </h4>
            <p className={getTypographyVariant('sectionDescription')}>
              Section description with proper line height and text color for optimal readability.
            </p>
          </div>
          
          <div className="p-6 border border-border rounded-lg">
            <h4 className={getTypographyVariant('cardTitle')}>
              Card Title
            </h4>
            <h5 className={getTypographyVariant('cardSubtitle')}>
              Card Subtitle
            </h5>
            <p className={getTypographyVariant('cardDescription')}>
              Card description text that provides additional context and information.
            </p>
          </div>
        </div>
      </section>

      {/* Font Weights */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Font Weights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(FONT_WEIGHTS).map(([name, className]) => (
            <div className="p-4 border border-border rounded-lg" key={name}>
              <h4 className="text-sm font-medium text-secondary uppercase tracking-wide mb-2">
                {name} ({className})
              </h4>
              <p className={`text-lg text-primary ${className}`}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Text Gradients */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Text Gradients</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(TEXT_GRADIENTS).map(([name, className]) => (
            <div className="p-6 border border-border rounded-lg" key={name}>
              <h3 className={`text-3xl font-bold ${className} mb-2`}>
                {name.charAt(0).toUpperCase() + name.slice(1)} Gradient
              </h3>
              <p className="text-secondary">
                Gradient class: {className}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Typography */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Navigation Typography</h2>
        <div className="p-6 border border-border rounded-lg">
          <nav className="flex space-x-6">
            <a className={getTypographyVariant('navLink')} href="#">
              Home
            </a>
            <a className={getTypographyVariant('navLinkActive')} href="#">
              About (Active)
            </a>
            <a className={getTypographyVariant('navLink')} href="#">
              Products
            </a>
            <a className={getTypographyVariant('navLink')} href="#">
              Contact
            </a>
          </nav>
        </div>
      </section>

      {/* Button Typography */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Button Typography</h2>
        <div className="flex flex-wrap gap-4">
          <button className={`px-6 py-3 bg-primary text-white rounded-lg ${getTypographyVariant('buttonPrimary')}`}>
            Primary Button
          </button>
          <button className={`px-6 py-3 border border-primary rounded-lg ${getTypographyVariant('buttonSecondary')}`}>
            Secondary Button
          </button>
          <button className={`px-6 py-3 ${getTypographyVariant('buttonGhost')}`}>
            Ghost Button
          </button>
        </div>
      </section>

      {/* Form Typography */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Form Typography</h2>
        <div className="max-w-md space-y-4">
          <div>
            <label className={getTypographyVariant('formLabel')}>
              Email Address
            </label>
            <input
              className={`w-full mt-1 px-3 py-2 border border-border rounded-lg ${getTypographyVariant('formInput')}`}
              placeholder="Enter your email"
              type="email"
            />
            <p className={getTypographyVariant('formHelper')}>
              We'll never share your email with anyone else.
            </p>
          </div>
          
          <div>
            <label className={getTypographyVariant('formLabel')}>
              Password
            </label>
            <input
              className={`w-full mt-1 px-3 py-2 border border-red-300 rounded-lg ${getTypographyVariant('formInput')}`}
              placeholder="Enter your password"
              type="password"
            />
            <p className={getTypographyVariant('formError')}>
              Password must be at least 8 characters long.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Typography */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Footer Typography</h2>
        <div className="p-6 border border-border rounded-lg space-y-4">
          <h3 className={getTypographyVariant('footerTitle')}>
            Company
          </h3>
          <nav className="space-y-2">
            <a className={`block ${getTypographyVariant('footerLink')}`} href="#">
              About Us
            </a>
            <a className={`block ${getTypographyVariant('footerLink')}`} href="#">
              Careers
            </a>
            <a className={`block ${getTypographyVariant('footerLink')}`} href="#">
              Contact
            </a>
          </nav>
          <p className={getTypographyVariant('footerCopyright')}>
            © 2024 DuVoX. All rights reserved.
          </p>
        </div>
      </section>

      {/* Responsive Typography Test */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Responsive Typography</h2>
        <div className="p-6 border border-border rounded-lg">
          <h1 className="text-hero font-black text-gradient mb-4">
            Responsive Hero Text
          </h1>
          <p className="text-body-lg font-normal text-secondary">
            This text scales responsively using clamp() functions for optimal readability across all device sizes.
          </p>
        </div>
      </section>

      {/* Accessibility Features */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Accessibility Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Text Balance</h3>
            <p className="text-balance text-secondary">
              This text uses text-wrap: balance for better line distribution and improved readability.
            </p>
          </div>
          
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Text Pretty</h3>
            <p className="text-pretty text-secondary">
              This text uses text-wrap: pretty to avoid orphans and improve overall text appearance.
            </p>
          </div>
        </div>
      </section>

      {/* Font Feature Settings */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Font Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Default Features</h3>
            <p className="font-feature-default text-secondary">
              Kerning, ligatures, and contextual alternates: 123 fi fl
            </p>
          </div>
          
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Tabular Numbers</h3>
            <p className="font-feature-numbers text-secondary">
              Monospaced numbers: 123,456.78
            </p>
          </div>
          
          <div className="p-4 border border-border rounded-lg">
            <h3 className="font-semibold text-primary mb-2">Small Caps</h3>
            <p className="font-feature-small-caps text-secondary">
              Small Capitals Text
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TypographyTest;