'use client';

import dynamic from 'next/dynamic';
import React, { Suspense, useState, useEffect, useRef } from 'react';

import { FallbackScene3D } from './fallback-scene';
import { prefersReducedMotion } from '@/lib/webgl-detection';

// Expose a typed global for the throttle so the scene can read it (if implemented there)
declare global {
  interface Window {
    __DUVOX_CPU_THROTTLE__?: number;
  }
}

interface DynamicScene3DProps {
  quality?: 'low' | 'medium' | 'high';
}

// Fallback component for loading
const Scene3DFallback: React.FC<{ quality?: 'low' | 'medium' | 'high' }> = ({ quality = 'high' }) => (
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
  const [skipHeavy3D, setSkipHeavy3D] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [resolvedQuality, setResolvedQuality] = useState<'low' | 'medium' | 'high'>(quality);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [throttlePreset, setThrottlePreset] = useState<'off' | 'mid' | 'low'>('off');
  // throttlePreset is kept for auto-application and to publish a global multiplier,
  // but the UI overlay is intentionally not rendered on the public site.
  // const throttleMultiplier = throttlePreset === 'low' ? 5.6 : throttlePreset === 'mid' ? 1.9 : 1;

  useEffect(() => {
    setIsClient(true);

    // Early checks to decide whether to skip heavy 3D on this device
    // More aggressive thresholds to favor performance on a wide range of devices
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 1024; // treat tablets as constrained
    const hasCoarsePointer = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const isMobileUA = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    const deviceMemory = typeof (navigator as any) !== 'undefined' && typeof (navigator as any).deviceMemory === 'number' ? (navigator as any).deviceMemory : undefined;
    const lowMemory = typeof deviceMemory === 'number' && deviceMemory <= 4; // be conservative: <=4GB treat as low
    const hardwareConcurrency = typeof (navigator as any) !== 'undefined' && typeof (navigator as any).hardwareConcurrency === 'number' ? (navigator as any).hardwareConcurrency : undefined;
    const lowCPU = typeof hardwareConcurrency === 'number' && hardwareConcurrency <= 2;
    const prefersReduced = prefersReducedMotion();

    // Developer override: allow forcing 3D via query param or localStorage (useful for testing)
    let force3d = false;
    try {
      const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
      if (url && url.searchParams.get('force3d') === '1') force3d = true;
      if (typeof window !== 'undefined' && window.localStorage && window.localStorage.getItem('duvox_force3d') === '1') force3d = true;
    } catch (e) {
      // ignore
    }

    // Load throttle preset from localStorage if present, else auto-apply based on detection
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = window.localStorage.getItem('duvox_cpu_throttle');
        if (stored === 'low' || stored === 'mid' || stored === 'off') {
          setThrottlePreset(stored);
        } else {
          // auto-apply sensible preset when not explicitly set
          if (!force3d) {
            if (isSmallScreen || isMobileUA || lowMemory || lowCPU) setThrottlePreset('low');
            else if (typeof deviceMemory === 'number' && deviceMemory <= 8) setThrottlePreset('mid');
            else setThrottlePreset('off');
          }
        }
      }
    } catch (e) {
      // ignore
    }

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGLError(true);
        setSkipHeavy3D(true);
        return;
      }
    } catch (error) {
      console.warn('WebGL detection failed:', error);
      setHasWebGLError(true);
      setSkipHeavy3D(true);
      return;
    }

    // Decide to skip heavy 3D when on small/coarse/low-memory devices or when user prefers reduced motion
    if (!force3d && (isSmallScreen || hasCoarsePointer || isMobileUA || lowMemory || lowCPU || prefersReduced)) {
      console.debug('Skipping heavy 3D:', { isSmallScreen, hasCoarsePointer, isMobileUA, deviceMemory, hardwareConcurrency, prefersReduced });
      setSkipHeavy3D(true);
    }

    // Determine an appropriate quality level based on device characteristics
    if (!force3d) {
      if (isSmallScreen || isMobileUA || lowMemory || lowCPU) {
        setResolvedQuality('low');
      } else if (typeof deviceMemory === 'number' && deviceMemory <= 8) {
        setResolvedQuality('medium');
      } else {
        setResolvedQuality(quality);
      }
    }

    // Pause heavy rendering when page is hidden (tab background)
    const onVisibilityChange = () => {
      if (typeof document !== 'undefined') {
        if (document.hidden) {
          setSkipHeavy3D(true);
        } else {
          // only re-enable if device seems capable
          if (!isSmallScreen && !lowMemory && !lowCPU && !prefersReduced) {
            setSkipHeavy3D(false);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [quality]);

  // When throttlePreset changes, update global and dispatch event for the scene to respond
  useEffect(() => {
    // Use fractional multipliers (<=1) so the renderer can scale down work.
    // Lower value => more throttling (0.6 => ~40% slower effective work), 1 => no throttling.
    const mult = throttlePreset === 'low' ? 0.6 : throttlePreset === 'mid' ? 0.85 : 1;
    try {
      if (typeof window !== 'undefined') {
        window.__DUVOX_CPU_THROTTLE__ = mult;
        // notify listeners (pure-threejs-scene listens for this event)
        try {
          window.dispatchEvent(new CustomEvent('__DUVOX_THROTTLE_CHANGE', { detail: mult }));
        } catch (e) {
          // older browsers may not support CustomEvent constructor
          const evt = document.createEvent('Event');
          (evt as any).detail = mult;
          window.dispatchEvent(evt);
        }
        // persist chosen preset so subsequent loads keep the same behavior
        try {
          if (window.localStorage) window.localStorage.setItem('duvox_cpu_throttle', throttlePreset);
        } catch (e) {
          // ignore storage errors
        }
      }
    } catch (e) {
      // ignore
    }
  }, [throttlePreset]);

  // Lazy-load 3D only when hero/container is near viewport to save CPU on initial load
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      // fallback: mark visible
      setIsVisible(true);
      return;
    }

    let cancelled = false;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (cancelled) return;
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setIsVisible(true);
            // once visible, we don't need to observe further
            if (el) obs.unobserve(el);
          }
        });
      },
      { root: null, rootMargin: '300px', threshold: 0.05 }
    );

    obs.observe(el);

    return () => {
      cancelled = true;
      obs.disconnect();
    };
  }, []);

  // Don't render anything on server
  if (!isClient) {
    return <div ref={containerRef}><Scene3DFallback quality={quality} /></div>;
  }

  // Use fallback if WebGL is not supported or we decided to skip heavy 3D
  const renderFallback = (
    <div ref={containerRef}>
      <FallbackScene3D quality={resolvedQuality} />
    </div>
  );

  const renderScene = (
    <div ref={containerRef}>
      <Suspense fallback={<Scene3DFallback quality={resolvedQuality} />}>
        <ErrorBoundary fallback={<FallbackScene3D quality={resolvedQuality} />}>
          <PureThreeJSScene quality={resolvedQuality} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );

  // No visible throttle controls in the UI — overlay intentionally removed.
  const ThrottleControls = null;

  return (
    <>
      {hasWebGLError || skipHeavy3D || !isVisible ? renderFallback : renderScene}
      {ThrottleControls}
    </>
  );
}

// Simple, strongly-typed error boundary for the 3D scene
interface ErrorBoundaryProps {
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(_error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('3D Scene Error:', error, errorInfo);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }

    return this.props.children ?? null;
  }
}