'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { ScrollIndicator, SectionProgress, AnimatedScrollDown } from '@/components/ui/scroll-indicator';
import { ScrollReveal, FadeInUp, StaggeredReveal } from '@/components/animations/scroll-reveal';

const testSections = [
  { id: 'section1', name: 'Section 1', color: 'bg-blue-500' },
  { id: 'section2', name: 'Section 2', color: 'bg-green-500' },
  { id: 'section3', name: 'Section 3', color: 'bg-purple-500' },
  { id: 'section4', name: 'Section 4', color: 'bg-red-500' },
  { id: 'section5', name: 'Section 5', color: 'bg-yellow-500' },
];

export function NavigationTest() {
  const { scrollToElement, scrollToTop } = useSmoothScroll();
  const sectionIds = testSections.map(section => section.id);
  const { activeSection, visibleSections } = useScrollSpy(sectionIds);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testSmoothScroll = (targetId: string) => {
    addTestResult(`Testing smooth scroll to ${targetId}`);
    scrollToElement(`#${targetId}`, {
      duration: 1000,
      offset: 100
    });
  };

  const testScrollToTop = () => {
    addTestResult('Testing scroll to top');
    scrollToTop({ duration: 800 });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Scroll Indicators */}
      <ScrollIndicator showProgress={true} showScrollToTop={true} />
      <SectionProgress sections={testSections} activeSection={activeSection} />
      
      {/* Test Controls */}
      <div className="fixed top-4 left-4 z-50 max-w-sm">
        <Card className="p-4">
          <CardHeader className="p-0 mb-4">
            <CardTitle className="text-lg">Navigation Test Controls</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Active Section: {activeSection || 'None'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Visible: {Array.from(visibleSections).join(', ') || 'None'}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">Quick Navigation:</p>
              {testSections.map(section => (
                <Button
                  key={section.id}
                  size="sm"
                  variant={activeSection === section.id ? "primary" : "outline"}
                  onClick={() => testSmoothScroll(section.id)}
                  className="w-full text-left justify-start"
                >
                  {section.name}
                </Button>
              ))}
              <Button
                size="sm"
                variant="secondary"
                onClick={testScrollToTop}
                className="w-full"
              >
                Scroll to Top
              </Button>
            </div>
            
            <div className="max-h-32 overflow-y-auto">
              <p className="text-sm font-medium mb-2">Test Results:</p>
              <div className="text-xs space-y-1">
                {testResults.slice(-5).map((result, index) => (
                  <div key={index} className="text-gray-600 dark:text-gray-400">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Sections */}
      <div className="pt-20">
        {testSections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            className={`min-h-screen flex items-center justify-center ${section.color} text-white relative`}
          >
            <div className="text-center max-w-4xl mx-auto px-4">
              <ScrollReveal
                direction={index % 2 === 0 ? 'left' : 'right'}
                delay={0.2}
              >
                <h2 className="text-6xl font-bold mb-8">{section.name}</h2>
                <p className="text-xl mb-8">
                  This is a test section to verify smooth scrolling and scroll spy functionality.
                  Section ID: {section.id}
                </p>
              </ScrollReveal>

              <StaggeredReveal staggerDelay={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map(item => (
                  <Card key={item} className="bg-white/10 backdrop-blur-sm border-white/20">
                    <CardContent className="p-6 text-center">
                      <h3 className="text-2xl font-bold mb-4">Feature {item}</h3>
                      <p className="text-white/80">
                        This card demonstrates staggered reveal animations.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </StaggeredReveal>

              {index < testSections.length - 1 && testSections[index + 1] && (
                <AnimatedScrollDown 
                  targetSection={`#${testSections[index + 1].id}`}
                  className="text-white/80 hover:text-white"
                />
              )}
            </div>
          </section>
        ))}
      </div>

      {/* Performance Test Section */}
      <section className="min-h-screen bg-gray-800 text-white flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          <FadeInUp>
            <h2 className="text-6xl font-bold mb-8">Performance Test</h2>
            <p className="text-xl mb-8">
              This section tests the performance of scroll animations and indicators.
            </p>
          </FadeInUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 20 }, (_, i) => (
              <ScrollReveal
                key={i}
                delay={i * 0.05}
                direction={i % 4 === 0 ? 'up' : i % 4 === 1 ? 'down' : i % 4 === 2 ? 'left' : 'right'}
              >
                <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-2">{i + 1}</div>
                    <div className="text-sm text-white/80">Item {i + 1}</div>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}