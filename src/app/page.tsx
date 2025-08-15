'use client';

import { Footer } from '@/components/layout/footer';
import { Navigation } from '@/components/layout/navigation';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AboutSection } from '@/components/sections/about';
import { ContactSection } from '@/components/sections/contact';
import { FounderSection } from '@/components/sections/founder';
import { HeroSection } from '@/components/sections/hero';
import { ProductsSection } from '@/components/sections/products';
import { ScrollIndicator, SectionProgress } from '@/components/ui/scroll-indicator';
import { useScrollSpy } from '@/hooks/use-scroll-spy';

const sections = [
  { id: 'hero', name: 'Home' },
  { id: 'about', name: 'About' },
  { id: 'products', name: 'Products' },
  { id: 'founder', name: 'Founder' },
  { id: 'contact', name: 'Contact' },
];

function HomeContent() {
  const sectionIds = sections.map(section => section.id);
  const { activeSection } = useScrollSpy(sectionIds, {
    offset: 100,
    threshold: 0.3,
    rootMargin: '-20% 0px -35% 0px'
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Navigation />
      <ScrollIndicator showProgress={true} showScrollToTop={true} />
      <SectionProgress activeSection={activeSection} sections={sections} />
      
      <main>
        <div id="hero">
          <HeroSection />
        </div>
        <AboutSection />
        <ProductsSection />
        <FounderSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
}
