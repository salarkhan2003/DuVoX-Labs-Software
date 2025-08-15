'use client';

import { useEffect, useState, useCallback } from 'react';

import { 
  detectWebGLCapabilities, 
  getDeviceInfo, 
  getOptimalQualitySettings,
  AdaptiveQualityManager,
  prefersReducedMotion,
  type WebGLCapabilities,
  type DeviceInfo
} from '@/lib/webgl-detection';

export interface WebGLPerformanceState {
  capabilities: WebGLCapabilities | null;
  deviceInfo: DeviceInfo | null;
  qualitySettings: any | null;
  currentQuality: 'low' | 'medium' | 'high';
  fps: number;
  isSupported: boolean;
  isLoading: boolean;
  reducedMotion: boolean;
}

export function useWebGLPerformance() {
  const [state, setState] = useState<WebGLPerformanceState>({
    capabilities: null,
    deviceInfo: null,
    qualitySettings: null,
    currentQuality: 'high',
    fps: 60,
    isSupported: false,
    isLoading: true,
    reducedMotion: false,
  });

  const [qualityManager, setQualityManager] = useState<AdaptiveQualityManager | null>(null);

  useEffect(() => {
    // Initialize WebGL detection and performance monitoring
    const initializeWebGL = async () => {
      try {
        const capabilities = detectWebGLCapabilities();
        const deviceInfo = getDeviceInfo();
        const reducedMotion = prefersReducedMotion();
        
        let initialQuality: 'low' | 'medium' | 'high' = 'high';
        
        // Determine initial quality based on device capabilities
        if (reducedMotion || !capabilities.supported) {
          initialQuality = 'low';
        } else if (deviceInfo.isMobile || deviceInfo.isLowEnd) {
          initialQuality = 'medium';
        } else {
          initialQuality = capabilities.performanceLevel;
        }

        const qualitySettings = getOptimalQualitySettings(capabilities, deviceInfo);
        
        setState(prev => ({
          ...prev,
          capabilities,
          deviceInfo,
          qualitySettings,
          currentQuality: initialQuality,
          isSupported: capabilities.supported,
          isLoading: false,
          reducedMotion,
        }));

        // Initialize adaptive quality manager if WebGL is supported
        if (capabilities.supported && !reducedMotion) {
          const manager = new AdaptiveQualityManager(initialQuality);
          setQualityManager(manager);

          // Listen for quality changes
          const unsubscribeQuality = manager.onQualityChange((quality) => {
            setState(prev => ({
              ...prev,
              currentQuality: quality,
            }));
          });

          // Update FPS periodically
          const fpsInterval = setInterval(() => {
            setState(prev => ({
              ...prev,
              fps: manager.getFPS(),
            }));
          }, 1000);

          // Cleanup function
          return () => {
            unsubscribeQuality();
            clearInterval(fpsInterval);
          };
        }
      } catch (error) {
        console.warn('WebGL initialization failed:', error);
        setState(prev => ({
          ...prev,
          isSupported: false,
          isLoading: false,
          currentQuality: 'low',
        }));
      }
    };

    initializeWebGL();
  }, []);

  const forceQuality = useCallback((quality: 'low' | 'medium' | 'high') => {
    setState(prev => ({
      ...prev,
      currentQuality: quality,
    }));
  }, []);

  const getQualitySettings = useCallback(() => {
    if (!state.qualitySettings) return null;

    const qualityMap = {
      low: {
        ...state.qualitySettings,
        pixelRatio: Math.min(window.devicePixelRatio, 1),
        antialias: false,
        shadows: false,
        particleCount: 50,
      },
      medium: {
        ...state.qualitySettings,
        pixelRatio: Math.min(window.devicePixelRatio, 1.5),
        antialias: true,
        shadows: false,
        particleCount: 100,
      },
      high: {
        ...state.qualitySettings,
        pixelRatio: Math.min(window.devicePixelRatio, 2),
        antialias: true,
        shadows: true,
        particleCount: 200,
      },
    };

    return qualityMap[state.currentQuality];
  }, [state.qualitySettings, state.currentQuality]);

  return {
    ...state,
    forceQuality,
    getQualitySettings,
    qualityManager,
  };
}

export function useAdaptiveRendering() {
  const webglPerformance = useWebGLPerformance();
  
  const shouldRender3D = webglPerformance.isSupported && 
                        !webglPerformance.reducedMotion && 
                        !webglPerformance.isLoading;

  const shouldUseComplexAnimations = webglPerformance.currentQuality !== 'low' && 
                                   !webglPerformance.reducedMotion;

  const shouldUseParticles = webglPerformance.currentQuality === 'high' && 
                           !webglPerformance.reducedMotion;

  const animationDuration = webglPerformance.currentQuality === 'low' ? 0.3 : 
                          webglPerformance.currentQuality === 'medium' ? 0.5 : 0.8;

  return {
    ...webglPerformance,
    shouldRender3D,
    shouldUseComplexAnimations,
    shouldUseParticles,
    animationDuration,
  };
}

export function useFrameRate() {
  const [fps, setFps] = useState(60);
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(performance.now());

  useEffect(() => {
    let animationId: number;

    const measureFPS = () => {
      setFrameCount(prev => prev + 1);
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const currentFPS = Math.round((frameCount * 1000) / (currentTime - lastTime));
        setFps(currentFPS);
        setFrameCount(0);
        setLastTime(currentTime);
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [frameCount, lastTime]);

  return fps;
}

export function usePerformanceOptimization() {
  const webglPerformance = useWebGLPerformance();
  const [isVisible, setIsVisible] = useState(true);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Pause animations when tab is not visible
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    // Pause animations when window loses focus
    const handleFocus = () => setIsActive(true);
    const handleBlur = () => setIsActive(false);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const shouldPauseAnimations = !isVisible || !isActive || webglPerformance.reducedMotion;
  const shouldReduceQuality = webglPerformance.fps < 30;

  return {
    ...webglPerformance,
    isVisible,
    isActive,
    shouldPauseAnimations,
    shouldReduceQuality,
  };
}