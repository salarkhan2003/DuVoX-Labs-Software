'use client';

import { motion, useInView } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useRef } from 'react';
import type { ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
  staggerChildren?: number;
  viewport?: {
    once?: boolean;
    margin?: string;
    amount?: number | 'some' | 'all';
  };
}

const getVariants = (direction: string, distance: number): Variants => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  };

  return {
    hidden: {
      opacity: 0,
      ...directions[direction as keyof typeof directions]
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0
    }
  };
};

export function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  staggerChildren,
  viewport
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: triggerOnce,
    margin: (viewport?.margin || '0px 0px -100px 0px') as any,
    amount: viewport?.amount || threshold
  });

  const variants = getVariants(direction, distance);

  const containerVariants: Variants = staggerChildren ? {
    hidden: {},
    visible: {
      transition: {
        staggerChildren,
        delayChildren: delay
      }
    }
  } : variants;

  const childVariants: Variants = staggerChildren ? variants : {};

  return (
    <motion.div
      animate={isInView ? "visible" : "hidden"}
      className={className}
      initial="hidden"
      ref={ref}
      transition={{
        duration,
        delay: staggerChildren ? 0 : delay,
        ease: [0.25, 0.25, 0.25, 0.75]
      }}
      variants={containerVariants}
    >
      {staggerChildren ? (
        Array.isArray(children) ? (
          children.map((child, index) => (
            <motion.div key={index} variants={childVariants}>
              {child}
            </motion.div>
          ))
        ) : (
          <motion.div variants={childVariants}>
            {children}
          </motion.div>
        )
      ) : (
        children
      )}
    </motion.div>
  );
}

// Specialized components for common use cases
export function FadeInUp({ children, ...props }: Omit<ScrollRevealProps, 'direction'>) {
  return (
    <ScrollReveal direction="up" {...props}>
      {children}
    </ScrollReveal>
  );
}

export function FadeInLeft({ children, ...props }: Omit<ScrollRevealProps, 'direction'>) {
  return (
    <ScrollReveal direction="left" {...props}>
      {children}
    </ScrollReveal>
  );
}

export function FadeInRight({ children, ...props }: Omit<ScrollRevealProps, 'direction'>) {
  return (
    <ScrollReveal direction="right" {...props}>
      {children}
    </ScrollReveal>
  );
}

export function StaggeredReveal({ 
  children, 
  staggerDelay = 0.1, 
  ...props 
}: ScrollRevealProps & { staggerDelay?: number }) {
  return (
    <ScrollReveal staggerChildren={staggerDelay} {...props}>
      {children}
    </ScrollReveal>
  );
}

// Parallax scroll effect component
interface ParallaxScrollProps {
  children: ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxScroll({ 
  children, 
  speed = 0.5, 
  className = '' 
}: ParallaxScrollProps) {
  const ref = useRef(null);
  
  return (
    <motion.div
      className={className}
      ref={ref}
      style={{
        y: useInView(ref) ? 0 : speed * 100
      }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}