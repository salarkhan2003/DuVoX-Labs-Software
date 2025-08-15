'use client';

import { motion, useScroll, useSpring } from 'framer-motion';
import { ChevronDown, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

interface ScrollIndicatorProps {
  showProgress?: boolean;
  showScrollToTop?: boolean;
  className?: string;
}

export function ScrollIndicator({ 
  showProgress = true, 
  showScrollToTop = true,
  className = ''
}: ScrollIndicatorProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollToTop } = useSmoothScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setShowScrollTop(latest > 0.2);
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <>
      {/* Progress Bar */}
      {showProgress && (
        <motion.div
          className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 origin-left z-50 ${className}`}
          style={{ scaleX }}
        />
      )}

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <motion.button
          animate={{ 
            opacity: showScrollTop ? 1 : 0, 
            scale: showScrollTop ? 1 : 0 
          }}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => scrollToTop()}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </>
  );
}

interface AnimatedScrollDownProps {
  targetSection?: string;
  className?: string;
}

export function AnimatedScrollDown({ 
  targetSection = '#about',
  className = ''
}: AnimatedScrollDownProps) {
  const { scrollToElement } = useSmoothScroll();

  return (
    <motion.button
      animate={{ opacity: 1, y: 0 }}
      aria-label="Scroll down to next section"
      className={`flex flex-col items-center space-y-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 1, duration: 0.8 }}
      whileHover={{ y: -2 }}
      onClick={() => scrollToElement(targetSection)}
    >
      <span className="text-sm font-medium">Scroll Down</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </motion.button>
  );
}

interface SectionProgressProps {
  sections: Array<{ id: string; name: string }>;
  activeSection: string;
  className?: string;
}

export function SectionProgress({ 
  sections, 
  activeSection, 
  className = '' 
}: SectionProgressProps) {
  const { scrollToElement } = useSmoothScroll();

  return (
    <div className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block ${className}`}>
      <div className="flex flex-col space-y-4">
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;
          const isPassed = sections.findIndex(s => s.id === activeSection) > index;
          
          return (
            <motion.button
              aria-label={`Go to ${section.name} section`}
              className="group relative flex items-center"
              key={section.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scrollToElement(`#${section.id}`)}
            >
              <motion.div
                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-500 border-blue-500 scale-125'
                    : isPassed
                    ? 'bg-blue-500/50 border-blue-500/50'
                    : 'bg-transparent border-gray-400 dark:border-gray-600'
                }`}
                whileHover={{ scale: 1.2 }}
              />
              
              {/* Section name tooltip */}
              <motion.div
                className="absolute right-6 px-3 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap"
                initial={{ x: 10 }}
                whileHover={{ x: 0 }}
              >
                {section.name}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 dark:bg-gray-100 rotate-45" />
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}