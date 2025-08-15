'use client';

import { useState, useEffect, useCallback } from 'react';
import { throttle } from '@/lib/utils';

interface ScrollSpyOptions {
  offset?: number;
  threshold?: number;
  rootMargin?: string;
}

export function useScrollSpy(
  sectionIds: string[],
  options: ScrollSpyOptions = {}
) {
  const [activeSection, setActiveSection] = useState<string>('');
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  
  const {
    offset = 100,
    threshold = 0.3,
    rootMargin = '-20% 0px -35% 0px'
  } = options;

  // Method 1: Intersection Observer for better performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisibleSections = new Set(visibleSections);
        
        entries.forEach((entry) => {
          const sectionId = entry.target.id;
          
          if (entry.isIntersecting) {
            newVisibleSections.add(sectionId);
          } else {
            newVisibleSections.delete(sectionId);
          }
        });
        
        setVisibleSections(newVisibleSections);
        
        // Set active section to the first visible section in order
        const firstVisibleSection = sectionIds.find(id => newVisibleSections.has(id));
        if (firstVisibleSection) {
          setActiveSection(firstVisibleSection);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    // Observe all sections
    sectionIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [sectionIds, threshold, rootMargin, visibleSections]);

  // Method 2: Fallback scroll-based detection
  const updateActiveSection = useCallback(
    throttle(() => {
      const scrollPosition = window.scrollY + offset;
      
      // Find the section that's currently in view
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const sectionId = sectionIds[i];
        if (sectionId) {
          const element = document.getElementById(sectionId);
          
          if (element) {
            const { offsetTop } = element;
            
            if (scrollPosition >= offsetTop) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      }
    }, 100),
    [sectionIds, offset]
  );

  // Use scroll-based detection as fallback
  useEffect(() => {
    // Check if Intersection Observer is supported
    if (!window.IntersectionObserver) {
      window.addEventListener('scroll', updateActiveSection);
      updateActiveSection(); // Initial check
      
      return () => window.removeEventListener('scroll', updateActiveSection);
    }
    return undefined;
  }, [updateActiveSection]);

  return {
    activeSection,
    visibleSections,
    isVisible: (sectionId: string) => visibleSections.has(sectionId)
  };
}