'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Monitor } from 'lucide-react';
import { useState } from 'react';

import { useThemeContext } from '@/components/providers/theme-provider';
import { Button } from '@/components/ui/button';
import { useScroll } from '@/hooks/use-scroll';
import { useScrollSpy } from '@/hooks/use-scroll-spy';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

const navItems = [
  { name: 'About', href: '#about', id: 'about' },
  { name: 'Products', href: '#products', id: 'products' },
  { name: 'Founder', href: '#founder', id: 'founder' },
  { name: 'Contact', href: '#contact', id: 'contact' },
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, mounted } = useThemeContext();
  const { scrollY } = useScroll();
  const { scrollToElement } = useSmoothScroll();
  
  // Use scroll spy for better active section detection
  const sectionIds = navItems.map(item => item.id);
  const { activeSection } = useScrollSpy(sectionIds, {
    offset: 100,
    threshold: 0.3,
    rootMargin: '-20% 0px -35% 0px'
  });
  
  const isScrolled = scrollY > 50;

  const scrollToSection = (href: string) => {
    scrollToElement(href, {
      duration: 800,
      offset: 80
    });
    setIsMobileMenuOpen(false);
  };

  const getThemeIcon = () => {
    if (!mounted) return <Monitor size={18} />;
    switch (theme) {
      case 'light':
        return <Sun size={18} />;
      case 'dark':
        return <Moon size={18} />;
      default:
        return <Monitor size={18} />;
    }
  };

  return (
    <motion.nav
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-lg dark:bg-gray-900/80'
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            DuVoX Labs
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}
                  key={item.name}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  onClick={() => scrollToSection(item.href)}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                      initial={false}
                      layoutId="activeSection"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
            
            {/* Theme Toggle */}
            <motion.button
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
              title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
            >
              {getThemeIcon()}
            </motion.button>
            
            <Button className="ml-2" size="sm">Join Waitlist</Button>
          </div>

          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <motion.button
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
              title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} mode`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
            >
              {getThemeIcon()}
            </motion.button>
            
            <motion.button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-md dark:bg-gray-900/95 rounded-lg mt-2 p-4 shadow-lg"
              exit={{ opacity: 0, y: -20 }}
              initial={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <motion.button
                      className={`text-left px-3 py-2 rounded-lg transition-colors duration-200 ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                      key={item.name}
                      whileHover={{ x: 4 }}
                      whileTap={{ x: 0 }}
                      onClick={() => scrollToSection(item.href)}
                    >
                      {item.name}
                    </motion.button>
                  );
                })}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button className="w-full" size="sm">Join Waitlist</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}