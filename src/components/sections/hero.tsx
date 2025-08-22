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
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Main Headline with Kinetic Typography */}
          <div className="mb-6">
            <KineticTypography
              className="text-hero font-black text-gradient block mb-2"
              delay={0.5}
              splitBy="word"
              staggerDelay={0.1}
              text="Reimagining AI for the"
              variant="slide"
            />
            <GlitchText
              className="text-hero font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              intensity="medium"
              text="Real World"
              trigger="auto"
            />
          </div>
          
          {/* Subtitle with Typewriter Effect */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <TypewriterEffect
              className="text-body-lg text-secondary max-w-3xl mx-auto"
              cursor={false}
              delay={1500}
              speed={30}
              text="Building the future of intelligent systems that enhance human life through mobility and healthcare innovation."
            />
          </motion.div>
          
          {/* Enhanced CTA Buttons */}
          <motion.div 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 2.5 }}
          >
            <PulsatingButton
              className="text-lg px-8 py-4"
              icon={<Sparkles size={20} />}
              iconPosition="left"
              size="lg"
              onClick={() => {
                try { window.localStorage.setItem('duvox_prefill_type', 'beta'); } catch (e) { /* ignore */ }
                // navigate to contact section
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Join Waitlist
            </PulsatingButton>
            
            <MagneticButton
              className="text-lg px-8 py-4 border-2 border-gradient-to-r from-blue-500 to-purple-500"
              icon={<Zap size={20} />}
              iconPosition="right"
              size="lg"
              variant="outline"
              onClick={() => {
                try { window.localStorage.setItem('duvox_prefill_type', 'investor'); } catch (e) { /* ignore */ }
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Investor Preview
            </MagneticButton>
           </motion.div>

          {/* Enhanced Stats with Animations */}
          <motion.div 
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 3 }}
          >
            <motion.div 
              className="text-center group cursor-pointer"
              transition={{ type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                animate={{ 
                  textShadow: [
                    '0 0 0px rgba(59, 130, 246, 0)',
                    '0 0 10px rgba(59, 130, 246, 0.5)',
                    '0 0 0px rgba(59, 130, 246, 0)',
                  ]
                }}
                className="text-3xl md:text-4xl font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors"
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
              transition={{ type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* number removed per request; keep spacing */}
              <div className="mb-2 h-6" />
              <div className="text-gray-400 group-hover:text-gray-300 transition-colors">
                Core Engineering Team
              </div>
            </motion.div>
            
            <motion.div 
              className="text-center group cursor-pointer"
              transition={{ type: "spring", stiffness: 300 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  textShadow: [
                    '0 0 0px rgba(16, 185, 129, 0)',
                    '0 0 10px rgba(16, 185, 129, 0.5)',
                    '0 0 0px rgba(16, 185, 129, 0)',
                  ]
                }}
                className="text-3xl md:text-4xl font-bold text-green-400 mb-2 group-hover:text-green-300 transition-colors"
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
          className="text-white/60 hover:text-white" 
          targetSection="#about"
        />
      </div>

      {/* Performance Indicator removed for production and public site cleanliness */}
    </section>
  );
}