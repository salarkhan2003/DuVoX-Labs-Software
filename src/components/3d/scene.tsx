'use client';

import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import { FloatingOrb, ParticleField, GeometricShapes, ConnectedNodes } from './floating-orb';

interface Scene3DProps {
  quality?: 'low' | 'medium' | 'high';
  enableInteraction?: boolean;
}

export function Scene3D({ quality = 'high', enableInteraction = false }: Scene3DProps) {
  const [webglSupported, setWebglSupported] = useState(true);
  const [devicePixelRatio, setDevicePixelRatio] = useState(1);

  useEffect(() => {
    // WebGL capability detection
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setWebglSupported(false);
      return;
    }

    // Performance-based quality adjustment
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    
    if (isMobile || isLowEnd) {
      setDevicePixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } else {
      setDevicePixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }, []);

  // Fallback for unsupported devices
  if (!webglSupported) {
    return (
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent" />
      </div>
    );
  }

  const qualitySettings = {
    low: {
      antialias: false,
      shadows: false,
      toneMapping: false,
      pixelRatio: Math.min(devicePixelRatio, 1),
    },
    medium: {
      antialias: true,
      shadows: false,
      toneMapping: true,
      pixelRatio: Math.min(devicePixelRatio, 1.5),
    },
    high: {
      antialias: true,
      shadows: true,
      toneMapping: true,
      pixelRatio: devicePixelRatio,
    },
  };

  const settings = qualitySettings[quality];

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        dpr={settings.pixelRatio}
        gl={{
          antialias: settings.antialias,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        camera={{ position: [0, 0, 8], fov: 60 }}
        frameloop="demand" // Only render when needed
      >
        <Suspense fallback={null}>
          {/* Adaptive performance components */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={60} />
          
          {/* Lighting setup */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={0.8}
            color="#ffffff"
            castShadow={settings.shadows}
          />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.6}
            color="#8b5cf6"
            distance={20}
            decay={2}
          />
          <pointLight
            position={[10, -10, 10]}
            intensity={0.4}
            color="#06b6d4"
            distance={15}
            decay={2}
          />
          
          {/* 3D Objects */}
          <FloatingOrb />
          <GeometricShapes />
          <ParticleField />
          <ConnectedNodes />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#000000', 8, 25]} />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Re-export performance monitoring hook from the dedicated hook file
export { useWebGLPerformance as usePerformanceMonitor } from '@/hooks/use-webgl-performance';