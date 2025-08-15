'use client';

import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useEffect, useState } from 'react';

interface TimelineNavigationProps {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToIndex: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
}

export function TimelineNavigation({
  currentIndex,
  totalItems,
  onPrevious,
  onNext,
  onGoToIndex,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = ''
}: TimelineNavigationProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!isPlaying || totalItems <= 1) return;

    const interval = setInterval(() => {
      onNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, onNext, autoPlayInterval, totalItems]);

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        onPrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        onNext();
        break;
      case ' ':
        event.preventDefault();
        toggleAutoPlay();
        break;
    }
  };

  return (
    <div 
      className={`flex items-center justify-between ${className}`}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="navigation"
      aria-label="Timeline navigation"
    >
      {/* Previous Button */}
      <button
        onClick={onPrevious}
        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Previous milestone"
        disabled={totalItems <= 1}
      >
        <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>

      {/* Progress Indicators */}
      <div className="flex items-center space-x-3">
        {/* Dots */}
        <div className="flex space-x-2">
          {Array.from({ length: totalItems }, (_, index) => (
            <button
              key={index}
              onClick={() => onGoToIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                index === currentIndex
                  ? 'bg-blue-500 scale-125'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
              }`}
              aria-label={`Go to milestone ${index + 1}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-24 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / totalItems) * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>

        {/* Counter */}
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[3rem] text-center">
          {currentIndex + 1} / {totalItems}
        </span>

        {/* Auto-play Toggle */}
        {totalItems > 1 && (
          <button
            onClick={toggleAutoPlay}
            className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            ) : (
              <Play className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Next milestone"
        disabled={totalItems <= 1}
      >
        <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>
    </div>
  );
}