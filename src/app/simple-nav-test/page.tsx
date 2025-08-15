'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { ScrollIndicator } from '@/components/ui/scroll-indicator';

const sections = [
  { id: 'section1', name: 'Section 1', color: 'bg-blue-500' },
  { id: 'section2', name: 'Section 2', color: 'bg-green-500' },
  { id: 'section3', name: 'Section 3', color: 'bg-purple-500' },
];

export default function SimpleNavTest() {
  const { scrollToElement, scrollToTop } = useSmoothScroll();
  const sectionIds = sections.map(section => section.id);
  const { activeSection } = useScrollSpy(sectionIds);
  const [testLog, setTestLog] = useState<string[]>([]);

  const addLog = (message: string) => {
    setTestLog(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testScroll = (sectionId: string) => {
    addLog(`Scrolling to ${sectionId}`);
    scrollToElement(`#${sectionId}`, { duration: 1000 });
  };

  return (
    <div className="min-h-screen">
      <ScrollIndicator />
      
      {/* Fixed Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50 p-4">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="text-xl font-bold">Navigation Test</div>
          <div className="flex space-x-2">
            {sections.map(section => (
              <Button
                key={section.id}
                size="sm"
                variant={activeSection === section.id ? "primary" : "outline"}
                onClick={() => testScroll(section.id)}
              >
                {section.name}
              </Button>
            ))}
            <Button size="sm" variant="secondary" onClick={() => scrollToTop()}>
              Top
            </Button>
          </div>
        </div>
        
        {/* Test Log */}
        <div className="mt-2 text-sm text-gray-600">
          <div>Active: {activeSection || 'None'}</div>
          <div className="max-h-16 overflow-y-auto">
            {testLog.map((log, i) => <div key={i}>{log}</div>)}
          </div>
        </div>
      </nav>

      {/* Test Sections */}
      <div className="pt-32">
        {sections.map(section => (
          <section
            key={section.id}
            id={section.id}
            className={`min-h-screen flex items-center justify-center ${section.color} text-white`}
          >
            <div className="text-center">
              <h2 className="text-6xl font-bold mb-4">{section.name}</h2>
              <p className="text-xl">
                This is {section.name.toLowerCase()}. 
                Active section: {activeSection}
              </p>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}