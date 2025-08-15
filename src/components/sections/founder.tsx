'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, Linkedin, Twitter } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function FounderSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50" id="founder">
      <div className="container mx-auto px-4">
        <motion.div
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          ref={ref}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            From Vision to Reality
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Meet the passionate founder driving innovation at DuVoX Labs
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="overflow-hidden shadow-2xl">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Founder Image & Info */}
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 lg:p-12 text-white">
                    <motion.div
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      className="text-center"
                      initial={{ opacity: 0, y: 30 }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                    >
                      <div className="w-32 h-32 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold">
                        PSK
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">
                        Patan Salar Khan
                      </h3>
                      <p className="text-xl mb-6 text-blue-100">
                        Founder & CEO
                      </p>
                      
                      <div className="flex items-center justify-center space-x-2 mb-6 text-blue-100">
                        <MapPin size={16} />
                        <span>Guntur, India</span>
                      </div>

                      <div className="flex justify-center space-x-4">
                        <Button className="text-white hover:bg-white/20" size="sm" variant="ghost">
                          <Mail size={16} />
                        </Button>
                        <Button className="text-white hover:bg-white/20" size="sm" variant="ghost">
                          <Linkedin size={16} />
                        </Button>
                        <Button className="text-white hover:bg-white/20" size="sm" variant="ghost">
                          <Twitter size={16} />
                        </Button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Founder Details */}
                  <div className="p-8 lg:p-12">
                    <motion.div
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      initial={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                    >
                      <blockquote className="text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-8 italic">
                        "I believe AI should enhance human potential, not replace it. Every product we build starts with a simple question: How can we make life better?"
                      </blockquote>

                      <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              B.Tech EEE
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                              Technical Foundation
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              Startup Enthusiastic
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                              Innovation & Entrepreneurship
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                              India-First
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400">
                              Global Impact
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
                          <Mail size={16} />
                          <span>psalarkhan22@gmail.com</span>
                        </div>
                        <Button className="w-full">
                          Connect with Patan
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vision Statement */}
          <motion.div
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-0">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  The Vision Behind DuVoX Labs
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
                  Born from a deep understanding of India's unique challenges and opportunities, 
                  DuVoX Labs represents a new generation of AI companies that prioritize accessibility, 
                  practicality, and human-centered design. Our mission is to bridge the gap between 
                  cutting-edge technology and real-world impact.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}