'use client';

import { motion } from 'framer-motion';

interface TimelineIconProps {
  className?: string;
  animate?: boolean;
}

export function FoundationIcon({ className = "w-6 h-6", animate = true }: TimelineIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.1"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.circle
        cx="12"
        cy="10"
        r="3"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        fillOpacity="0.3"
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
      />
    </svg>
  );
}

export function DevelopmentIcon({ className = "w-6 h-6", animate = true }: TimelineIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M14.7 6.3C15.1 5.9 15.1 5.3 14.7 4.9C14.3 4.5 13.7 4.5 13.3 4.9L8.7 9.5C8.3 9.9 8.3 10.5 8.7 10.9L13.3 15.5C13.7 15.9 14.3 15.9 14.7 15.5C15.1 15.1 15.1 14.5 14.7 14.1L11.4 10.8L14.7 7.5V6.3Z"
        fill="currentColor"
        initial={animate ? { x: -10, opacity: 0 } : {}}
        animate={animate ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      <motion.path
        d="M9.3 6.3C8.9 5.9 8.9 5.3 9.3 4.9C9.7 4.5 10.3 4.5 10.7 4.9L15.3 9.5C15.7 9.9 15.7 10.5 15.3 10.9L10.7 15.5C10.3 15.9 9.7 15.9 9.3 15.5C8.9 15.1 8.9 14.5 9.3 14.1L12.6 10.8L9.3 7.5V6.3Z"
        fill="currentColor"
        initial={animate ? { x: 10, opacity: 0 } : {}}
        animate={animate ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      />
      <motion.rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </svg>
  );
}

export function LaunchIcon({ className = "w-6 h-6", animate = true }: TimelineIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M4.5 16.5C4.5 16.5 5.5 15.5 8 15.5C10.5 15.5 11.5 16.5 11.5 16.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1, ease: "easeOut" }}
      />
      <motion.path
        d="M12.5 7.5C12.5 7.5 13.5 6.5 16 6.5C18.5 6.5 19.5 7.5 19.5 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }}
      />
      <motion.path
        d="M9 21C9 21 13 20 13 13C13 6 9 5 9 5C9 5 5 6 5 13C5 20 9 21 9 21Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.1"
        initial={animate ? { pathLength: 0, opacity: 0, y: 10 } : {}}
        animate={animate ? { pathLength: 1, opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
      <motion.circle
        cx="9"
        cy="9"
        r="2"
        fill="currentColor"
        initial={animate ? { scale: 0, opacity: 0 } : {}}
        animate={animate ? { scale: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

export function GrowthIcon({ className = "w-6 h-6", animate = true }: TimelineIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M3 3V21H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      <motion.path
        d="M7 16L12 11L16 15L21 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
      />
      <motion.path
        d="M18 10H21V13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : {}}
        animate={animate ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
      />
      {/* Animated dots for data points */}
      {[7, 12, 16, 21].map((x, index) => {
        const y = [16, 11, 15, 10][index];
        return (
          <motion.circle
            key={index}
            cx={x}
            cy={y}
            r="2"
            fill="currentColor"
            initial={animate ? { scale: 0, opacity: 0 } : {}}
            animate={animate ? { scale: 1, opacity: 1 } : {}}
            transition={{ 
              duration: 0.4, 
              delay: 0.5 + index * 0.1, 
              ease: "easeOut" 
            }}
          />
        );
      })}
    </svg>
  );
}

// Map category to custom icon
export const categoryIconMap = {
  foundation: FoundationIcon,
  development: DevelopmentIcon,
  launch: LaunchIcon,
  growth: GrowthIcon,
};