/**
 * Font loading hook for optimized font loading and fallback handling
 */

import { useEffect, useState, useCallback } from 'react';

import { 
  isFontLoaded, 
  getFontLoadingStatus,
  FONT_CONFIG,
  CRITICAL_FONT_WEIGHTS 
} from '@/lib/typography';

export interface FontLoadingState {
  isLoaded: boolean;
  isLoading: boolean;
  hasError: boolean;
  loadedWeights: number[];
  failedWeights: number[];
}

export interface UseFontLoadingOptions {
  fontFamily?: string;
  weights?: number[];
  timeout?: number;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for managing font loading state and optimization
 */
export function useFontLoading(options: UseFontLoadingOptions = {}) {
  const {
    fontFamily = FONT_CONFIG.family,
    weights = CRITICAL_FONT_WEIGHTS,
    timeout = 3000,
    onLoad,
    onError,
  } = options;

  const [state, setState] = useState<FontLoadingState>({
    isLoaded: false,
    isLoading: true,
    hasError: false,
    loadedWeights: [],
    failedWeights: [],
  });

  const checkFontLoading = useCallback(async () => {
    if (typeof window === 'undefined') return;

    try {
      setState(prev => ({ ...prev, isLoading: true, hasError: false }));

      // Check if fonts are already loaded
      const alreadyLoaded = isFontLoaded(fontFamily);
      if (alreadyLoaded) {
        setState({
          isLoaded: true,
          isLoading: false,
          hasError: false,
          loadedWeights: weights,
          failedWeights: [],
        });
        onLoad?.();
        return;
      }

      // Load fonts with timeout
      const fontLoadPromises = weights.map(async (weight) => {
        try {
          const fontSpec = `${weight} 1rem ${fontFamily}`;
          await document.fonts.load(fontSpec);
          return { weight, success: true };
        } catch (error) {
          console.warn(`Failed to load font weight ${weight}:`, error);
          return { weight, success: false };
        }
      });

      // Wait for all fonts to load or timeout
      const results = await Promise.allSettled(
        fontLoadPromises.map(promise => 
          Promise.race([
            promise,
            new Promise<{ weight: number; success: boolean }>((_, reject) => 
              setTimeout(() => reject(new Error('Font loading timeout')), timeout)
            )
          ])
        )
      );

      const loadedWeights: number[] = [];
      const failedWeights: number[] = [];

      results.forEach((result, index) => {
        const weight = weights[index];
        if (weight !== undefined) {
          if (result.status === 'fulfilled' && result.value.success) {
            loadedWeights.push(weight);
          } else {
            failedWeights.push(weight);
          }
        }
      });

      const hasAnyLoaded = loadedWeights.length > 0;
      const hasAllLoaded = loadedWeights.length === weights.length;

      setState({
        isLoaded: hasAllLoaded,
        isLoading: false,
        hasError: !hasAnyLoaded,
        loadedWeights,
        failedWeights,
      });

      if (hasAnyLoaded) {
        onLoad?.();
      } else {
        const error = new Error(`Failed to load any font weights for ${fontFamily}`);
        onError?.(error);
      }

    } catch (error) {
      console.error('Font loading error:', error);
      setState({
        isLoaded: false,
        isLoading: false,
        hasError: true,
        loadedWeights: [],
        failedWeights: weights,
      });
      onError?.(error as Error);
    }
  }, [fontFamily, weights, timeout, onLoad, onError]);

  // Check font loading on mount and when document fonts are ready
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial check
    checkFontLoading();

    // Listen for font loading events
    const handleFontsReady = () => {
      const status = getFontLoadingStatus();
      if (status === 'loaded') {
        setState(prev => ({
          ...prev,
          isLoaded: true,
          isLoading: false,
          hasError: false,
        }));
        onLoad?.();
      }
    };

    document.fonts.addEventListener('loadingdone', handleFontsReady);
    document.fonts.addEventListener('loadingerror', () => {
      setState(prev => ({ ...prev, hasError: true, isLoading: false }));
    });

    return () => {
      document.fonts.removeEventListener('loadingdone', handleFontsReady);
      document.fonts.removeEventListener('loadingerror', handleFontsReady);
    };
  }, [checkFontLoading, onLoad]);

  // Retry font loading
  const retry = useCallback(() => {
    checkFontLoading();
  }, [checkFontLoading]);

  // Check if specific weight is loaded
  const isWeightLoaded = useCallback((weight: number) => {
    return state.loadedWeights.includes(weight);
  }, [state.loadedWeights]);

  // Get fallback font stack
  const getFallbackFontStack = useCallback(() => {
    return FONT_CONFIG.fallback.join(', ');
  }, []);

  return {
    ...state,
    retry,
    isWeightLoaded,
    getFallbackFontStack,
  };
}

/**
 * Hook for preloading critical fonts
 */
export function usePreloadFonts() {
  const [preloadStatus, setPreloadStatus] = useState<{
    isPreloading: boolean;
    preloadedCount: number;
    totalCount: number;
  }>({
    isPreloading: true,
    preloadedCount: 0,
    totalCount: CRITICAL_FONT_WEIGHTS.length,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preloadFonts = async () => {
      let preloadedCount = 0;

      for (const weight of CRITICAL_FONT_WEIGHTS) {
        try {
          const fontSpec = `${weight} 1rem ${FONT_CONFIG.family}`;
          await document.fonts.load(fontSpec);
          preloadedCount++;
          setPreloadStatus(prev => ({
            ...prev,
            preloadedCount,
          }));
        } catch (error) {
          console.warn(`Failed to preload font weight ${weight}:`, error);
        }
      }

      setPreloadStatus(prev => ({
        ...prev,
        isPreloading: false,
      }));
    };

    preloadFonts();
  }, []);

  return preloadStatus;
}

/**
 * Hook for font display optimization
 */
export function useFontDisplay() {
  const [shouldUseFallback, setShouldUseFallback] = useState(false);
  const { isLoaded, hasError } = useFontLoading();

  useEffect(() => {
    // Use fallback if fonts fail to load or take too long
    const fallbackTimer = setTimeout(() => {
      if (!isLoaded) {
        setShouldUseFallback(true);
      }
    }, 3000);

    if (isLoaded) {
      setShouldUseFallback(false);
      clearTimeout(fallbackTimer);
    }

    if (hasError) {
      setShouldUseFallback(true);
      clearTimeout(fallbackTimer);
    }

    return () => clearTimeout(fallbackTimer);
  }, [isLoaded, hasError]);

  return {
    shouldUseFallback,
    fontFamily: shouldUseFallback 
      ? FONT_CONFIG.fallback.join(', ')
      : `${FONT_CONFIG.family}, ${FONT_CONFIG.fallback.join(', ')}`,
  };
}

/**
 * Hook for responsive font loading
 */
export function useResponsiveFontLoading() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const fontLoading = useFontLoading({
    // Load fewer weights on mobile for performance
    weights: deviceType === 'mobile' ? [400, 600] : CRITICAL_FONT_WEIGHTS,
  });

  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1024) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };

    updateDeviceType();
    window.addEventListener('resize', updateDeviceType);

    return () => window.removeEventListener('resize', updateDeviceType);
  }, []);

  return {
    ...fontLoading,
    deviceType,
  };
}