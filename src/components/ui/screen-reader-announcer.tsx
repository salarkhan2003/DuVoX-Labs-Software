'use client';

import { useEffect } from 'react';

interface ScreenReaderAnnouncerProps {
  message: string;
  priority?: 'polite' | 'assertive';
  delay?: number;
}

export function ScreenReaderAnnouncer({ 
  message, 
  priority = 'polite', 
  delay = 100 
}: ScreenReaderAnnouncerProps) {
  useEffect(() => {
    if (!message || typeof window === 'undefined') return;

    const timer = setTimeout(() => {
      // Create a temporary element for screen reader announcement
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', priority);
      announcement.setAttribute('aria-atomic', 'true');
      announcement.className = 'sr-only absolute -left-[10000px] w-[1px] h-[1px] overflow-hidden';
      announcement.textContent = message;
      
      document.body.appendChild(announcement);
      
      // Remove the element after announcement
      setTimeout(() => {
        if (document.body.contains(announcement)) {
          document.body.removeChild(announcement);
        }
      }, 1000);
    }, delay);

    return () => clearTimeout(timer);
  }, [message, priority, delay]);

  return null;
}

// Hook for managing announcements
export function useScreenReaderAnnouncement() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (typeof window === 'undefined') return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only absolute -left-[10000px] w-[1px] h-[1px] overflow-hidden';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  };

  return { announce };
}