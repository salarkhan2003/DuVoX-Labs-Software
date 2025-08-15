'use client';

import { InteractiveTimeline } from '@/components/ui/interactive-timeline';
import { timelineMilestones } from '@/data/timeline-milestones';

export default function TimelineTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          Interactive Timeline Test
        </h1>
        
        {/* Test with all features */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-200">
            Full Featured Timeline
          </h2>
          <InteractiveTimeline 
            autoPlay={false}
            autoPlayInterval={3000}
            className="max-w-6xl mx-auto"
            milestones={timelineMilestones}
            showNavigation={true}
          />
        </div>

        {/* Test with auto-play */}
        <div className="mb-20">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-200">
            Auto-play Timeline (Mobile View)
          </h2>
          <div className="lg:hidden">
            <InteractiveTimeline 
              autoPlay={true}
              autoPlayInterval={4000}
              className="max-w-4xl mx-auto"
              milestones={timelineMilestones}
              showNavigation={true}
            />
          </div>
          <div className="hidden lg:block text-center text-gray-600 dark:text-gray-400">
            Switch to mobile view to see auto-play timeline
          </div>
        </div>

        {/* Test with minimal features */}
        <div>
          <h2 className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-200">
            Minimal Timeline (No Navigation)
          </h2>
          <InteractiveTimeline 
            className="max-w-4xl mx-auto"
            milestones={timelineMilestones.slice(0, 2)}
            showNavigation={false}
          />
        </div>
      </div>
    </div>
  );
}