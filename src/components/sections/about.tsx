'use client';

import { motion } from 'framer-motion';
import { Target, Users, Zap } from 'lucide-react';

import { ScrollReveal, FadeInUp, StaggeredReveal } from '@/components/animations/scroll-reveal';
import { Card, CardContent } from '@/components/ui/card';
import { InteractiveTimeline } from '@/components/ui/interactive-timeline';
import { timelineMilestones } from '@/data/timeline-milestones';

const features = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To democratize AI technology by creating practical, accessible solutions that make life safer, healthier, and more convenient for everyone.',
  },
  {
    icon: Users,
    title: 'Our Approach',
    description: 'We focus on embedded AI systems that work at the edge, bringing intelligence directly to devices where it\'s needed most.',
  },
  {
    icon: Zap,
    title: 'Our Impact',
    description: 'Building AI solutions that solve real-world problems, enhancing human capabilities rather than replacing them.',
  },
];

export function AboutSection() {

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50" id="about">
      <div className="container mx-auto px-4">
        <FadeInUp className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Building Tomorrow's Intelligence
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            DuVoX Labs is an independent innovation lab focused on creating AI solutions that solve real-world problems. 
            We believe technology should enhance human capabilities, not replace them.
          </p>
        </FadeInUp>

        <StaggeredReveal 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          staggerDelay={0.2}
        >
          {features.map((feature) => (
            <Card className="h-full p-8 text-center group hover:shadow-2xl transition-all duration-300" key={feature.title}>
              <CardContent className="p-0">
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center"
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </StaggeredReveal>

        {/* Interactive Timeline */}
        <ScrollReveal 
          className="mt-20"
          delay={0.8}
          duration={1}
        >
          <InteractiveTimeline 
            className="max-w-6xl mx-auto"
            milestones={timelineMilestones}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}