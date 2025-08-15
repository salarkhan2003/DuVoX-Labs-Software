/**
 * WebGL capability detection and performance utilities
 */

export interface WebGLCapabilities {
  supported: boolean;
  version: '1' | '2' | null;
  renderer: string;
  vendor: string;
  maxTextureSize: number;
  maxVertexUniforms: number;
  maxFragmentUniforms: number;
  extensions: string[];
  performanceLevel: 'low' | 'medium' | 'high';
}

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isLowEnd: boolean;
  hardwareConcurrency: number;
  deviceMemory?: number;
  connectionType?: string;
}

/**
 * Detect WebGL capabilities and performance characteristics
 */
export function detectWebGLCapabilities(): WebGLCapabilities {
  const canvas = document.createElement('canvas');
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
  let version: '1' | '2' | null = null;

  // Try WebGL 2 first, then fall back to WebGL 1
  gl = canvas.getContext('webgl2');
  if (gl) {
    version = '2';
  } else {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      version = '1';
    }
  }

  if (!gl) {
    return {
      supported: false,
      version: null,
      renderer: '',
      vendor: '',
      maxTextureSize: 0,
      maxVertexUniforms: 0,
      maxFragmentUniforms: 0,
      extensions: [],
      performanceLevel: 'low',
    };
  }

  // Get renderer and vendor info
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = debugInfo 
    ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) 
    : gl.getParameter(gl.RENDERER);
  const vendor = debugInfo 
    ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) 
    : gl.getParameter(gl.VENDOR);

  // Get capabilities
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const maxVertexUniforms = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
  const maxFragmentUniforms = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);

  // Get extensions
  const extensions = gl.getSupportedExtensions() || [];

  // Determine performance level based on capabilities
  const performanceLevel = determinePerformanceLevel({
    renderer,
    maxTextureSize,
    maxVertexUniforms,
    maxFragmentUniforms,
    extensions,
  });

  return {
    supported: true,
    version,
    renderer,
    vendor,
    maxTextureSize,
    maxVertexUniforms,
    maxFragmentUniforms,
    extensions,
    performanceLevel,
  };
}

/**
 * Get device information for performance optimization
 */
export function getDeviceInfo(): DeviceInfo {
  const userAgent = navigator.userAgent.toLowerCase();
  
  const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  
  // @ts-ignore - deviceMemory is experimental
  const deviceMemory = navigator.deviceMemory;
  
  // @ts-ignore - connection is experimental
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const connectionType = connection?.effectiveType;

  const isLowEnd = hardwareConcurrency <= 4 || deviceMemory <= 4 || isMobile;

  return {
    isMobile,
    isTablet,
    isLowEnd,
    hardwareConcurrency,
    deviceMemory,
    connectionType,
  };
}

/**
 * Determine performance level based on WebGL capabilities
 */
function determinePerformanceLevel(capabilities: {
  renderer: string;
  maxTextureSize: number;
  maxVertexUniforms: number;
  maxFragmentUniforms: number;
  extensions: string[];
}): 'low' | 'medium' | 'high' {
  const { renderer, maxTextureSize, maxVertexUniforms, extensions } = capabilities;
  const deviceInfo = getDeviceInfo();

  // Check for high-end GPU indicators
  const highEndGPUs = [
    'nvidia', 'geforce', 'quadro', 'tesla',
    'amd', 'radeon', 'rx ', 'vega', 'navi',
    'intel', 'iris', 'xe',
    'apple', 'm1', 'm2', 'm3'
  ];

  const isHighEndGPU = highEndGPUs.some(gpu => 
    renderer.toLowerCase().includes(gpu)
  );

  // Check for mobile/integrated graphics
  const lowEndIndicators = [
    'mali', 'adreno', 'powervr', 'videocore',
    'intel hd', 'intel uhd', 'integrated'
  ];

  const isLowEndGPU = lowEndIndicators.some(indicator => 
    renderer.toLowerCase().includes(indicator)
  );

  // Performance scoring
  let score = 0;

  // GPU quality
  if (isHighEndGPU) score += 3;
  else if (!isLowEndGPU) score += 2;
  else score += 1;

  // Texture capabilities
  if (maxTextureSize >= 8192) score += 2;
  else if (maxTextureSize >= 4096) score += 1;

  // Uniform capabilities
  if (maxVertexUniforms >= 256) score += 1;

  // Extensions support
  const importantExtensions = [
    'OES_texture_float',
    'OES_texture_half_float',
    'WEBGL_depth_texture',
    'EXT_texture_filter_anisotropic'
  ];
  
  const supportedImportantExtensions = importantExtensions.filter(ext => 
    extensions.includes(ext)
  ).length;
  
  score += supportedImportantExtensions;

  // Device characteristics
  if (deviceInfo.isMobile) score -= 2;
  if (deviceInfo.isLowEnd) score -= 1;
  if (deviceInfo.hardwareConcurrency >= 8) score += 1;
  if (deviceInfo.deviceMemory && deviceInfo.deviceMemory >= 8) score += 1;

  // Determine final performance level
  if (score >= 8) return 'high';
  if (score >= 5) return 'medium';
  return 'low';
}

/**
 * Get optimal quality settings based on device capabilities
 */
export function getOptimalQualitySettings(capabilities: WebGLCapabilities, deviceInfo: DeviceInfo) {
  const { performanceLevel } = capabilities;
  const { isMobile, isLowEnd } = deviceInfo;

  const qualitySettings = {
    low: {
      pixelRatio: Math.min(window.devicePixelRatio, 1),
      antialias: false,
      shadows: false,
      particleCount: 50,
      animationQuality: 'low',
      textureQuality: 'low',
      postProcessing: false,
    },
    medium: {
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
      antialias: true,
      shadows: false,
      particleCount: 100,
      animationQuality: 'medium',
      textureQuality: 'medium',
      postProcessing: false,
    },
    high: {
      pixelRatio: Math.min(window.devicePixelRatio, 2),
      antialias: true,
      shadows: true,
      particleCount: 200,
      animationQuality: 'high',
      textureQuality: 'high',
      postProcessing: true,
    },
  };

  let targetQuality = performanceLevel;

  // Override based on device characteristics
  if (isMobile || isLowEnd) {
    targetQuality = 'low';
  } else if (isMobile && performanceLevel === 'high') {
    targetQuality = 'medium';
  }

  return qualitySettings[targetQuality];
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private callbacks: Array<(fps: number) => void> = [];

  constructor() {
    this.measureFPS();
  }

  private measureFPS = () => {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      
      // Notify callbacks
      this.callbacks.forEach(callback => callback(this.fps));
      
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    requestAnimationFrame(this.measureFPS);
  };

  public getFPS(): number {
    return this.fps;
  }

  public onFPSChange(callback: (fps: number) => void): () => void {
    this.callbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  public getPerformanceLevel(): 'low' | 'medium' | 'high' {
    if (this.fps < 30) return 'low';
    if (this.fps < 45) return 'medium';
    return 'high';
  }
}

/**
 * Memory usage monitoring
 */
export function getMemoryUsage(): {
  used: number;
  total: number;
  percentage: number;
} | null {
  // @ts-ignore - memory is experimental
  const memory = (performance as any).memory;
  
  if (!memory) return null;

  return {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    percentage: (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100,
  };
}

/**
 * Adaptive quality manager
 */
export class AdaptiveQualityManager {
  private performanceMonitor: PerformanceMonitor;
  private currentQuality: 'low' | 'medium' | 'high' = 'high';
  private callbacks: Array<(quality: 'low' | 'medium' | 'high') => void> = [];

  constructor(initialQuality: 'low' | 'medium' | 'high' = 'high') {
    this.currentQuality = initialQuality;
    this.performanceMonitor = new PerformanceMonitor();
    
    // Monitor performance and adjust quality
    this.performanceMonitor.onFPSChange((fps) => {
      this.adjustQuality(fps);
    });
  }

  private adjustQuality(fps: number) {
    let newQuality = this.currentQuality;

    // Downgrade quality if performance is poor
    if (fps < 25 && this.currentQuality !== 'low') {
      newQuality = this.currentQuality === 'high' ? 'medium' : 'low';
    }
    // Upgrade quality if performance is good
    else if (fps > 50 && this.currentQuality !== 'high') {
      newQuality = this.currentQuality === 'low' ? 'medium' : 'high';
    }
    // Moderate adjustment
    else if (fps < 35 && this.currentQuality === 'high') {
      newQuality = 'medium';
    }

    if (newQuality !== this.currentQuality) {
      this.currentQuality = newQuality;
      this.callbacks.forEach(callback => callback(newQuality));
    }
  }

  public getCurrentQuality(): 'low' | 'medium' | 'high' {
    return this.currentQuality;
  }

  public onQualityChange(callback: (quality: 'low' | 'medium' | 'high') => void): () => void {
    this.callbacks.push(callback);
    
    return () => {
      const index = this.callbacks.indexOf(callback);
      if (index > -1) {
        this.callbacks.splice(index, 1);
      }
    };
  }

  public getFPS(): number {
    return this.performanceMonitor.getFPS();
  }
}

/**
 * Check if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get optimal frame rate based on device capabilities
 */
export function getOptimalFrameRate(): number {
  const deviceInfo = getDeviceInfo();
  
  if (deviceInfo.isMobile) return 30;
  if (deviceInfo.isLowEnd) return 45;
  return 60;
}