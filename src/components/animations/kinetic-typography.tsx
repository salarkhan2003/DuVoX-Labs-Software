'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface KineticTypographyProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  variant?: 'fade' | 'slide' | 'scale' | 'rotate' | 'glitch';
  gradient?: boolean;
  splitBy?: 'word' | 'character' | 'line';
}

export function KineticTypography({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
  staggerDelay = 0.1,
  variant = 'slide',
  gradient = false,
  splitBy = 'word',
}: KineticTypographyProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const controls = useAnimation();
  const [textParts, setTextParts] = useState<string[]>([]);

  useEffect(() => {
    // Split text based on splitBy prop
    let parts: string[] = [];
    
    switch (splitBy) {
      case 'character':
        parts = text.split('');
        break;
      case 'line':
        parts = text.split('\n');
        break;
      case 'word':
      default:
        parts = text.split(' ');
        break;
    }
    
    setTextParts(parts);
  }, [text, splitBy]);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  const getVariantAnimation = (variant: string) => {
    const animations = {
      fade: {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      },
      slide: {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      },
      scale: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
      },
      rotate: {
        hidden: { opacity: 0, rotateX: -90 },
        visible: { opacity: 1, rotateX: 0 },
      },
      glitch: {
        hidden: { 
          opacity: 0, 
          x: -10,
          filter: 'blur(4px)',
        },
        visible: { 
          opacity: 1, 
          x: 0,
          filter: 'blur(0px)',
        },
      },
    };
    
    return animations[variant as keyof typeof animations] || animations.slide;
  };

  const animation = getVariantAnimation(variant);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    ...animation,
    visible: {
      ...animation.visible,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`${className} ${gradient ? 'text-gradient' : ''}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {textParts.map((part, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block"
          style={{
            marginRight: splitBy === 'word' ? '0.25em' : '0',
            marginBottom: splitBy === 'line' ? '0.5em' : '0',
          }}
        >
          {part}
          {splitBy === 'line' && index < textParts.length - 1 && <br />}
        </motion.span>
      ))}
    </motion.div>
  );
}

interface TypewriterEffectProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  cursor?: boolean;
  onComplete?: () => void;
}

export function TypewriterEffect({
  text,
  className = '',
  delay = 0,
  speed = 50,
  cursor = true,
  onComplete,
}: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete?.();
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, delay, speed, onComplete]);

  useEffect(() => {
    if (cursor) {
      const cursorTimer = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);

      return () => clearInterval(cursorTimer);
    }
  }, [cursor]);

  return (
    <span className={className}>
      {displayText}
      {cursor && (
        <span className={`inline-block w-0.5 h-[1em] bg-current ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
      )}
    </span>
  );
}

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  trigger?: 'hover' | 'auto' | 'manual';
  isActive?: boolean;
}

export function GlitchText({
  text,
  className = '',
  intensity = 'medium',
  trigger = 'hover',
  isActive = false,
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  const intensitySettings = {
    low: { duration: 0.1, iterations: 2 },
    medium: { duration: 0.2, iterations: 3 },
    high: { duration: 0.3, iterations: 5 },
  };

  const settings = intensitySettings[intensity];

  useEffect(() => {
    if (trigger === 'auto') {
      const interval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), settings.duration * 1000);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [trigger, settings.duration]);

  useEffect(() => {
    if (trigger === 'manual') {
      setIsGlitching(isActive);
    }
  }, [trigger, isActive]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsGlitching(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsGlitching(false);
    }
  };

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={isGlitching ? {
        x: [0, -2, 2, -1, 1, 0],
        filter: [
          'hue-rotate(0deg)',
          'hue-rotate(90deg)',
          'hue-rotate(180deg)',
          'hue-rotate(270deg)',
          'hue-rotate(0deg)',
        ],
      } : {}}
      transition={{
        duration: settings.duration,
        repeat: isGlitching ? settings.iterations : 0,
        ease: 'easeInOut',
      }}
    >
      {text}
      {isGlitching && (
        <>
          <motion.span
            className="absolute inset-0 text-red-500 opacity-70"
            animate={{
              x: [-1, 1, -1],
              clipPath: [
                'inset(0 0 0 0)',
                'inset(20% 0 30% 0)',
                'inset(60% 0 10% 0)',
                'inset(0 0 0 0)',
              ],
            }}
            transition={{
              duration: settings.duration,
              repeat: settings.iterations,
              ease: 'linear',
            }}
          >
            {text}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-cyan-500 opacity-70"
            animate={{
              x: [1, -1, 1],
              clipPath: [
                'inset(0 0 0 0)',
                'inset(40% 0 20% 0)',
                'inset(10% 0 70% 0)',
                'inset(0 0 0 0)',
              ],
            }}
            transition={{
              duration: settings.duration,
              repeat: settings.iterations,
              ease: 'linear',
            }}
          >
            {text}
          </motion.span>
        </>
      )}
    </motion.span>
  );
}

interface FloatingTextProps {
  text: string;
  className?: string;
  amplitude?: number;
  frequency?: number;
  delay?: number;
}

export function FloatingText({
  text,
  className = '',
  amplitude = 10,
  frequency = 2,
  delay = 0,
}: FloatingTextProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [0, -amplitude, 0],
      }}
      transition={{
        duration: frequency,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {text}
    </motion.div>
  );
}