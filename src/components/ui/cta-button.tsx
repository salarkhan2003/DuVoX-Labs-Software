'use client';

import { motion } from 'framer-motion';
import { forwardRef, useState, useRef } from 'react';

import { cn } from '@/lib/utils';

interface CTAButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  glowEffect?: boolean;
  rippleEffect?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const CTAButton = forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    children, 
    glowEffect = true,
    rippleEffect = true,
    icon,
    iconPosition = 'right',
    onClick,
    ...props 
  }, ref) => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const rippleId = useRef(0);

    const baseClasses = 'relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group border-0';
    
    const variants = {
      primary: `
        bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 
        text-white shadow-lg hover:shadow-xl
        focus:ring-blue-500
        before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-400 before:to-purple-400 before:opacity-0 before:transition-opacity before:duration-300
        hover:before:opacity-20
      `,
      secondary: `
        bg-gradient-to-r from-gray-800 to-gray-900 
        text-white hover:from-gray-700 hover:to-gray-800
        focus:ring-gray-500 shadow-md hover:shadow-lg
      `,
      outline: `
        border-2 border-gradient-to-r from-blue-500 to-purple-500
        text-blue-600 dark:text-blue-400
        hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50
        dark:hover:from-blue-950 dark:hover:to-purple-950
        focus:ring-blue-500
      `,
      ghost: `
        text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-800
        focus:ring-gray-500
      `
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-lg gap-2',
      md: 'px-6 py-3 text-base rounded-xl gap-2',
      lg: 'px-8 py-4 text-lg rounded-xl gap-3',
      xl: 'px-10 py-5 text-xl rounded-2xl gap-3'
    };

    const glowClasses = glowEffect && variant === 'primary' 
      ? 'hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:shadow-blue-500/50' 
      : '';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (rippleEffect) {
        const button = buttonRef.current || e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const newRipple = {
          id: rippleId.current++,
          x,
          y,
        };
        
        setRipples(prev => [...prev, newRipple]);
        
        // Remove ripple after animation
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
        }, 600);
      }
      
      onClick?.(e);
    };

    return (
      <motion.button
        className={cn(
          baseClasses, 
          variants[variant], 
          sizes[size], 
          glowClasses,
          className
        )}
        ref={buttonRef}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        whileTap={{ 
          scale: 0.98,
          transition: { duration: 0.1 }
        }}
        onClick={handleClick}
        {...props}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 group-hover:animate-pulse" />
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {icon && iconPosition === 'left' && (
            <motion.span
              initial={{ x: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ x: -2 }}
            >
              {icon}
            </motion.span>
          )}
          
          {children}
          
          {icon && iconPosition === 'right' && (
            <motion.span
              initial={{ x: 0 }}
              transition={{ duration: 0.2 }}
              whileHover={{ x: 2 }}
            >
              {icon}
            </motion.span>
          )}
        </span>

        {/* Ripple effects */}
        {rippleEffect && ripples.map((ripple) => (
          <motion.span
            animate={{
              width: 300,
              height: 300,
              opacity: 0,
            }}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            initial={{
              width: 0,
              height: 0,
              x: '-50%',
              y: '-50%',
              opacity: 1,
            }}
            key={ripple.id}
            style={{
              left: ripple.x,
              top: ripple.y,
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Glow effect for primary variant */}
        {glowEffect && variant === 'primary' && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 -z-10" />
        )}
      </motion.button>
    );
  }
);

CTAButton.displayName = 'CTAButton';

export { CTAButton };

// Specialized button variants
export function PulsatingButton({ children, className, ...props }: CTAButtonProps) {
  return (
    <motion.div
      animate={{
        boxShadow: [
          '0 0 0 0 rgba(59, 130, 246, 0.7)',
          '0 0 0 10px rgba(59, 130, 246, 0)',
          '0 0 0 0 rgba(59, 130, 246, 0)',
        ],
      }}
      className="rounded-xl"
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <CTAButton className={className} {...props}>
        {children}
      </CTAButton>
    </motion.div>
  );
}

export function MagneticButton({ children, className, ...props }: CTAButtonProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    
    setMousePosition({ x: deltaX, y: deltaY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      animate={{
        x: isHovered ? mousePosition.x : 0,
        y: isHovered ? mousePosition.y : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      <CTAButton
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {children}
      </CTAButton>
    </motion.div>
  );
}

export function NeonButton({ children, className, ...props }: CTAButtonProps) {
  return (
    <CTAButton
      className={cn(
        'relative border-2 border-blue-500 bg-transparent text-blue-400',
        'hover:text-white hover:bg-blue-500/10',
        'before:absolute before:inset-0 before:bg-blue-500 before:opacity-0 before:transition-opacity before:duration-300',
        'hover:before:opacity-10',
        'shadow-[0_0_10px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.6)]',
        'animate-pulse',
        className
      )}
      glowEffect={false}
      {...props}
    >
      {children}
    </CTAButton>
  );
}