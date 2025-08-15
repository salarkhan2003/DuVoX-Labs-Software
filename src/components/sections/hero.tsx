'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { DynamicScene3D } from '@/components/3d/dynamic-scene';
import { KineticTypography, TypewriterEffect, GlitchText } from '@/components/animations/kinetic-typography';
import { PulsatingButton, MagneticButton } from '@/components/ui/cta-button';
import { AnimatedScrollDown } from '@/components/ui/scroll-indicator';
import { useAdaptiveRendering } from '@/hooks/use-webgl-performance';

export function HeroSection() {
  const {
    currentQuality,
    fps,
    shouldRender3D
  } = useAdaptiveRendering();



  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background with adaptive quality */}
      {shouldRender3D ? (
        <DynamicScene3D quality={currentQuality} />
      ) : (
        // Fallback for unsupported devices or reduced motion preference
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-transparent animate-pulse" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse delay-2000" />
        </div>
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Headline with Kinetic Typography */}
          <div className="mb-6">
            <KineticTypography
              text="Reimagining AI for the"
              className="text-hero font-black text-gradient block mb-2"
              variant="slide"
              delay={0.5}
              staggerDelay={0.1}
              splitBy="word"
            />
            <GlitchText
              text="Real World"
              className="text-hero font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              trigger="auto"
              intensity="medium"
            />
          </div>
          
          {/* Subtitle with Typewriter Effect */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <TypewriterEffect
              text="Building the future of intelligent systems that enhance human life through mobility and healthcare innovation."
              className="text-body-lg text-secondary max-w-3xl mx-auto"
              delay={1500}
              speed={30}
              cursor={false}
            />
          </motion.div>
          
          {/* Enhanced CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            <PulsatingButton
              size="lg"
              icon={<Sparkles size={20} />}
              iconPosition="left"
              className="text-lg px-8 py-4"
            >
              Join Waitlist
            </PulsatingButton>
            
            <MagneticButton
              variant="outline"
              size="lg"
              icon={<Zap size={20} />}
              iconPosition="right"
              className="text-lg px-8 py-4 border-2 border-gradient-to-r from-blue-500 to-purple-500"
            >
              Investor Preview
            </MagneticButton>
          </motion.div>

          {/* Enhanced Stats with Animations */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 3 }}
          >
            <motion.div 
              className="text-center group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors"
                animate={{ 
                  textShadow: [
                    '0 0 0px rgba(59, 130, 246, 0)',
                    '0 0 10px rgba(59, 130, 246, 0.5)',
                    '0 0 0px rgba(59, 130, 246, 0)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                2
              </motion.div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Products in Development
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-purple-400 mb-2 group-hover:text-purple-300 transition-colors"
                animate={{ 
                  textShadow: [
                    '0 0 0px rgba(139, 92, 246, 0)',
                    '0 0 10px rgba(139, 92, 246, 0.5)',
                    '0 0 0px rgba(139, 92, 246, 0)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                1
              </motion.div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Passionate Founder
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center group cursor-pointer"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="text-3xl md:text-4xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  textShadow: [
                    '0 0 0px rgba(16, 185, 129, 0)',
                    '0 0 10px rgba(16, 185, 129, 0.5)',
                    '0 0 0px rgba(16, 185, 129, 0)',
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                ∞
              </motion.div>
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Possibilities Ahead
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <AnimatedScrollDown 
          targetSection="#about" 
          className="text-white/60 hover:text-white"
        />
      </div>

      {/* Performance Indicator (Development only) */}
      {process.env.NODE_ENV === 'development' && fps > 0 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
          FPS: {fps} | Quality: {currentQuality}
        </div>
      )}
    </section>
  );
}