'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';
import { FallbackScene3D } from './fallback-scene';

interface DynamicScene3DProps {
  quality?: 'low' | 'medium' | 'high';
}

// Fallback component for loading
const Scene3DFallback = ({ quality = 'high' }: { quality?: 'low' | 'medium' | 'high' }) => (
  <FallbackScene3D quality={quality} />
);

// Dynamically import the pure Three.js scene to avoid SSR issues
const PureThreeJSScene = dynamic(
  () => import('./pure-threejs-scene').then((mod) => ({ default: mod.PureThreeJSScene })),
  {
    ssr: false,
    loading: () => <Scene3DFallback />,
  }
);

export function DynamicScene3D({ quality = 'high' }: DynamicScene3DProps) {
  const [hasWebGLError, setHasWebGLError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGLError(true);
      }
    } catch (error) {
      console.warn('WebGL detection failed:', error);
      setHasWebGLError(true);
    }
  }, []);

  // Don't render anything on server
  if (!isClient) {
    return <Scene3DFallback quality={quality} />;
  }

  // Use fallback if WebGL is not supported
  if (hasWebGLError) {
    return <FallbackScene3D quality={quality} />;
  }

  return (
    <Suspense fallback={<Scene3DFallback quality={quality} />}>
      <ErrorBoundary fallback={<FallbackScene3D quality={quality} />}>
        <PureThreeJSScene quality={quality} />
      </ErrorBoundary>
    </Suspense>
  );
}

// Simple error boundary for 3D scene
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('3D Scene Error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}