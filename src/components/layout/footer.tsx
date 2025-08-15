'use client';

import { motion } from 'framer-motion';
import { Heart, Mail, MapPin, Linkedin, Twitter, Github, Instagram, Youtube } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Email',
      href: 'mailto:psalarkhan22@gmail.com',
      icon: Mail,
      hoverColor: 'hover:bg-blue-600',
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: Linkedin,
      hoverColor: 'hover:bg-blue-600',
    },
    {
      name: 'Twitter',
      href: '#',
      icon: Twitter,
      hoverColor: 'hover:bg-blue-400',
    },
    {
      name: 'GitHub',
      href: '#',
      icon: Github,
      hoverColor: 'hover:bg-gray-600',
    },
    {
      name: 'Instagram',
      href: '#',
      icon: Instagram,
      hoverColor: 'hover:bg-pink-600',
    },
    {
      name: 'YouTube',
      href: '#',
      icon: Youtube,
      hoverColor: 'hover:bg-red-600',
    },
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <motion.div
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              DuVoX Labs
            </motion.div>
            <motion.p
              className="text-gray-400 mb-6 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Reimagining AI for the Real World. Building intelligent systems that enhance human life 
              through mobility and healthcare innovation.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className={`w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center ${social.hoverColor} transition-colors duration-200 group`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    title={social.name}
                  >
                    <Icon size={18} className="group-hover:scale-110 transition-transform duration-200" />
                  </motion.a>
                );
              })}
            </motion.div>
          </div>

          {/* Products */}
          <div>
            <motion.h3
              className="text-lg font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Products
            </motion.h3>
            <motion.ul
              className="space-y-2 text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <li>
                <a href="#products" className="hover:text-white transition-colors duration-200">
                  DuVoX CradAI
                </a>
              </li>
              <li>
                <a href="#products" className="hover:text-white transition-colors duration-200">
                  Mobility Co-Pilot
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Beta Program
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  API Access
                </a>
              </li>
            </motion.ul>
          </div>

          {/* Company */}
          <div>
            <motion.h3
              className="text-lg font-semibold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Company
            </motion.h3>
            <motion.ul
              className="space-y-2 text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <li>
                <a href="#about" className="hover:text-white transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#founder" className="hover:text-white transition-colors duration-200">
                  Our Founder
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Careers
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors duration-200">
                  Contact
                </a>
              </li>
            </motion.ul>
          </div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-800 pt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-gray-400 text-sm text-center sm:text-left">
              <span>© {currentYear} DuVoX Labs. All rights reserved.</span>
              <div className="flex items-center space-x-4">
                <span className="hidden sm:inline">•</span>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
                <span>•</span>
                <a href="#" className="hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Built with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Heart size={16} className="text-red-500" />
              </motion.div>
              <span>in Guntur, India</span>
              <span className="hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center space-x-1">
                <MapPin size={16} />
                <span>Guntur, India</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}