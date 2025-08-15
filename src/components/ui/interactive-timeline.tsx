'use client';

import { motion, useInView } from 'framer-motion';
import { Calendar, Target, Rocket, Users } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

import { Card, CardContent } from '@/components/ui/card';

import { useScreenReaderAnnouncement } from './screen-reader-announcer';
import { categoryIconMap } from './timeline-icons';
import { TimelineNavigation } from './timeline-navigation';

export interface TimelineMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  details?: string;
  icon?: 'calendar' | 'target' | 'rocket' | 'users';
  category?: 'foundation' | 'development' | 'launch' | 'growth';
  achievements?: string[];
}

interface InteractiveTimelineProps {
  milestones: TimelineMilestone[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
}

const iconMap = {
  calendar: Calendar,
  target: Target,
  rocket: Rocket,
  users: Users,
};

const categoryColors = {
  foundation: 'from-blue-500 to-cyan-500',
  development: 'from-purple-500 to-pink-500',
  launch: 'from-green-500 to-emerald-500',
  growth: 'from-orange-500 to-red-500',
};

export function InteractiveTimeline({ 
  milestones, 
  className = '',
  autoPlay = false,
  autoPlayInterval = 5000,
  showNavigation = true
}: InteractiveTimelineProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timelineRef = useRef(null);
  const isInView = useInView(timelineRef, { once: true, margin: '-100px' });
  const { announce } = useScreenReaderAnnouncement();

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : milestones.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < milestones.length - 1 ? prev + 1 : 0));
  };

  const handleKeyDown = (event: React.KeyboardEvent, milestoneId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedMilestone(selectedMilestone === milestoneId ? null : milestoneId);
    }
  };

  const goToIndex = (index: number) => {
    if (index >= 0 && index < milestones.length) {
      setCurrentIndex(index);
    }
  };

  // Announce changes for screen readers
  useEffect(() => {
    if (milestones[currentIndex]) {
      const announcement = `Timeline milestone ${currentIndex + 1} of ${milestones.length}: ${milestones[currentIndex].title}, ${milestones[currentIndex].year}`;
      announce(announcement);
    }
  }, [currentIndex, milestones, announce]);

  return (
    <div 
      aria-label="Company timeline" 
      className={`relative ${className}`}
      ref={timelineRef}
      role="region"
    >
      {/* Skip link for keyboard users */}
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        href="#timeline-end"
      >
        Skip timeline
      </a>
      {/* Timeline Header */}
      <motion.div
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
      >
        <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Our Journey
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          From vision to reality - discover the key milestones that define our path forward
        </p>
      </motion.div>

      {/* Desktop Timeline */}
      <div className="hidden lg:block relative">
        {/* SVG Timeline Line */}
        <svg
          aria-hidden="true"
          className="absolute left-1/2 transform -translate-x-1/2 w-2 h-full"
          preserveAspectRatio="none"
          viewBox="0 0 8 100"
        >
          <motion.path
            animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
            d="M4 0 L4 100"
            fill="none"
            initial={{ pathLength: 0 }}
            stroke="url(#timelineGradient)"
            strokeWidth="2"
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="timelineGradient" x1="0%" x2="0%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Timeline Items */}
        <div className="space-y-16">
          {milestones.map((milestone, index) => {
            const Icon = iconMap[milestone.icon || 'calendar'];
            const isLeft = index % 2 === 0;
            const colorClass = categoryColors[milestone.category || 'foundation'];

            return (
              <motion.div
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -50 : 50 }}
                className={`flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                key={milestone.id}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                {/* Content */}
                <div className={`w-5/12 ${isLeft ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                  <Card 
                    aria-describedby={`milestone-${milestone.id}-details`}
                    aria-expanded={selectedMilestone === milestone.id}
                    className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      selectedMilestone === milestone.id ? 'ring-2 ring-blue-500 shadow-xl' : ''
                    }`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedMilestone(selectedMilestone === milestone.id ? null : milestone.id)}
                    onKeyDown={(e) => handleKeyDown(e, milestone.id)}
                  >
                    <CardContent className="p-0">
                      <div className={`text-2xl font-bold bg-gradient-to-r ${colorClass} bg-clip-text text-transparent mb-2`}>
                        {milestone.year}
                      </div>
                      <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                        {milestone.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {milestone.description}
                      </p>
                      
                      {/* Expanded Details */}
                      <motion.div
                        animate={
                          selectedMilestone === milestone.id
                            ? { height: 'auto', opacity: 1 }
                            : { height: 0, opacity: 0 }
                        }
                        className="overflow-hidden"
                        id={`milestone-${milestone.id}-details`}
                        initial={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {milestone.details && (
                          <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                            {milestone.details}
                          </p>
                        )}
                        {milestone.achievements && (
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {milestone.achievements.map((achievement, i) => (
                              <li className="flex items-center" key={i}>
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        )}
                      </motion.div>
                    </CardContent>
                  </Card>
                </div>

                {/* Timeline Node */}
                <motion.div
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  className={`relative z-10 w-12 h-12 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-lg`}
                  initial={{ scale: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.2 + 0.3 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {milestone.category && categoryIconMap[milestone.category] ? (
                    (() => {
                      const CustomIcon = categoryIconMap[milestone.category];
                      return <CustomIcon animate={isInView} className="w-6 h-6 text-white" />;
                    })()
                  ) : (
                    <Icon className="w-6 h-6 text-white" />
                  )}
                </motion.div>

                {/* Empty space */}
                <div className="w-5/12" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile Timeline */}
      <div className="lg:hidden">
        {/* Navigation Controls */}
        {showNavigation && (
          <div className="mb-6">
            <TimelineNavigation
              autoPlay={autoPlay}
              autoPlayInterval={autoPlayInterval}
              currentIndex={currentIndex}
              totalItems={milestones.length}
              onGoToIndex={goToIndex}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </div>
        )}

        {/* Current Milestone */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          initial={{ opacity: 0, x: 20 }}
          key={currentIndex}
          transition={{ duration: 0.3 }}
        >
          {milestones[currentIndex] && (
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${categoryColors[milestones[currentIndex].category || 'foundation']} rounded-full flex items-center justify-center mr-4`}>
                    {milestones[currentIndex].category && categoryIconMap[milestones[currentIndex].category] ? (
                      (() => {
                        const CustomIcon = categoryIconMap[milestones[currentIndex].category];
                        return <CustomIcon animate={true} className="w-6 h-6 text-white" />;
                      })()
                    ) : (
                      (() => {
                        const Icon = iconMap[milestones[currentIndex].icon || 'calendar'];
                        return <Icon className="w-6 h-6 text-white" />;
                      })()
                    )}
                  </div>
                  <div className={`text-2xl font-bold bg-gradient-to-r ${categoryColors[milestones[currentIndex].category || 'foundation']} bg-clip-text text-transparent`}>
                    {milestones[currentIndex].year}
                  </div>
                </div>
                
                <h4 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {milestones[currentIndex].title}
                </h4>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {milestones[currentIndex].description}
                </p>

                {milestones[currentIndex].details && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-3">
                    {milestones[currentIndex].details}
                  </p>
                )}

                {milestones[currentIndex].achievements && (
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    {milestones[currentIndex].achievements.map((achievement, i) => (
                      <li className="flex items-center" key={i}>
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Timeline end marker for skip link */}
      <div className="sr-only" id="timeline-end">End of timeline</div>
    </div>
  );
}