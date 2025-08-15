'use client';

import { useEffect, useState } from 'react';

interface FallbackScene3DProps {
  quality?: 'low' | 'medium' | 'high';
}

export function FallbackScene3D({ quality = 'high' }: FallbackScene3DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-transparent" />
      </div>
    );
  }

  const particleCount = quality === 'low' ? 20 : quality === 'medium' ? 40 : 60;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-transparent animate-pulse" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
      
      {/* Floating Particles */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <div
          className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
          key={i}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
      
      {/* Geometric Shapes */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 border-2 border-purple-400/30 rotate-45 animate-spin" 
           style={{ animationDuration: '8s' }} />
      <div className="absolute top-3/4 right-1/4 w-6 h-6 border-2 border-cyan-400/30 animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-4 h-4 bg-green-400/20 rounded-full animate-bounce" 
           style={{ animationDuration: '3s' }} />
      
      {/* Animated Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        {/* Animated connecting lines */}
        <line stroke="url(#lineGradient)" strokeWidth="1" x1="25%" x2="75%" y1="25%" y2="75%">
          <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0.1;0.5;0.1" />
        </line>
        <line stroke="url(#lineGradient)" strokeWidth="1" x1="75%" x2="25%" y1="25%" y2="75%">
          <animate attributeName="opacity" dur="4s" repeatCount="indefinite" values="0.5;0.1;0.5" />
        </line>
        <circle cx="50%" cy="50%" fill="none" r="100" stroke="url(#lineGradient)" strokeWidth="1">
          <animate attributeName="r" dur="6s" repeatCount="indefinite" values="50;150;50" />
          <animate attributeName="opacity" dur="6s" repeatCount="indefinite" values="0.3;0.1;0.3" />
        </circle>
      </svg>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse" />
          <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full animate-ping" 
               style={{ animationDuration: '3s' }} />
        </div>
      </div>
      
      {/* Glowing Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/5 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500/5 rounded-full blur-xl animate-pulse" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-1/2 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl animate-pulse" 
             style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
}