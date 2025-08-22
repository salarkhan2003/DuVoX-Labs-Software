'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface PureThreeJSSceneProps {
  quality?: 'low' | 'medium' | 'high';
}

export function PureThreeJSScene({ quality = 'high' }: PureThreeJSSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Detect basic mobile/touch devices to reduce defaults
    const isMobile =
      (typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent)) ||
      (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches);

    // Read global throttle multiplier (dev overlay sets window.__DUVOX_CPU_THROTTLE__)
    const getThrottleMultiplier = () => {
      try {
        const w = typeof window !== 'undefined' ? (window as any) : undefined;
        let t = w && typeof w.__DUVOX_CPU_THROTTLE__ === 'number' ? w.__DUVOX_CPU_THROTTLE__ : 1;
        // Clamp to a sensible range (25% - 1.0). Prevent accidental zero or overspec.
        t = Math.max(0.25, Math.min(1, t));
        return t;
      } catch (e) {
        return 1;
      }
    };

    // Helper to compute quality-driven settings based on container size
    const computeSettings = (width: number, _height: number) => {
      const throttle = getThrottleMultiplier();

      // Detect extra low-end conditions
      const lowEndDevice =
        isMobile ||
        (typeof (navigator as any) !== 'undefined' && typeof (navigator as any).deviceMemory === 'number' && (navigator as any).deviceMemory <= 2);

      // Pixel ratio caps (force 1 on low-end/mobile for best performance)
      const basePixelRatio = quality === 'low' ? 1 : quality === 'medium' ? 1.5 : 2;
      const devicePR = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      // apply throttle multiplier to pixel ratio to reduce GPU cost when throttled
      const pixelRatio = Math.max(1, Math.min(devicePR, lowEndDevice ? 1 : basePixelRatio) * throttle);

      // Particle count scales with width but much lower on mobile/low-end and when throttled
      const particleBase = quality === 'low' ? 20 : quality === 'medium' ? 60 : 120;
      // further clamp for very small widths
      const scaled = Math.floor(width / 12);
      const baseCount = Math.max(8, Math.min(particleBase, scaled));
      const particleCount = Math.max(6, Math.floor(baseCount * throttle));

      // Geometry detail level (lower on mobile/low-end or when heavily throttled)
      const orbDetail = quality === 'low' || isMobile || lowEndDevice || throttle < 0.6 ? 0 : 1;

      // Target FPS: 30 for low-end/mobile, 45 for medium, 60 for high. Apply throttle to target FPS too.
      const baseTargetFPS = lowEndDevice ? 30 : quality === 'low' ? 30 : quality === 'medium' ? 45 : 60;
      const targetFPS = Math.max(15, Math.round(baseTargetFPS * throttle));

      return { pixelRatio, particleCount, orbDetail, targetFPS, throttle };
    };

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 8, 25);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
    camera.position.set(0, 0, 8);

    // Renderer setup with adaptive powerPreference for mobile
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: quality !== 'low' && !isMobile,
      powerPreference: isMobile ? 'low-power' : 'high-performance',
    });
    rendererRef.current = renderer;

    // Append canvas and ensure it fills the container
    const mountEl = mountRef.current as HTMLDivElement;
    mountEl.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x8b5cf6, 0.6, 20, 2);
    pointLight1.position.set(-10, -10, -10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 0.4, 15, 2);
    pointLight2.position.set(10, -10, 10);
    scene.add(pointLight2);

    // Placeholder references for dynamic objects
    let orb: THREE.Mesh | null = null;
    const shapes: THREE.Mesh[] = [];
    let particles: THREE.Points | null = null;

    // Create or update scene objects based on computed settings
    const buildScene = (width: number, height: number) => {
      // Dispose previous heavy objects if rebuilding
      if (orb) {
        if (orb.geometry) orb.geometry.dispose();
        if (Array.isArray((orb.material as any))) {
          (orb.material as any).forEach((m: THREE.Material) => m.dispose());
        } else if (orb.material) {
          (orb.material as any).dispose();
        }
        scene.remove(orb);
        orb = null;
      }

      shapes.forEach((s: THREE.Mesh) => {
        if (s.geometry) s.geometry.dispose();
        if (Array.isArray(s.material)) (s.material as THREE.Material[]).forEach((m) => (m as THREE.Material).dispose());
        else if (s.material) (s.material as THREE.Material).dispose();
        scene.remove(s);
      });
      shapes.length = 0;

      if (particles) {
        if (particles.geometry) particles.geometry.dispose();
        if (Array.isArray(particles.material)) (particles.material as THREE.Material[]).forEach((m) => (m as THREE.Material).dispose());
        else if (particles.material) (particles.material as THREE.Material).dispose();
        scene.remove(particles);
        particles = null;
      }

      const { pixelRatio, particleCount, orbDetail, targetFPS, throttle } = computeSettings(width, height);

      try {
        // Orb
        const orbGeometry = new THREE.IcosahedronGeometry(1, orbDetail);

        // Choose a cheaper material when throttled to reduce shader cost
        let orbMaterial: THREE.Material;
        if (throttle < 0.6) {
          orbMaterial = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.85,
          });
        } else {
          orbMaterial = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            emissive: 0x1e40af,
            emissiveIntensity: 0.4,
            roughness: 0.4,
            metalness: 0.1,
            transparent: true,
            opacity: 0.85,
          });
        }

        orb = new THREE.Mesh(orbGeometry, orbMaterial);
        scene.add(orb);

        // Geometric shapes with minimal detail on small screens or when throttled
        const tetraGeometry = new THREE.TetrahedronGeometry(isMobile ? 0.6 : 0.8);
        const tetraMaterial = new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          emissive: 0x5b21b6,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.7,
          wireframe: isMobile || throttle < 0.6 ? false : true,
        });
        const tetra = new THREE.Mesh(tetraGeometry, tetraMaterial);
        tetra.position.set(-3, 2, -2);
        scene.add(tetra);
        shapes.push(tetra);

        const octaGeometry = new THREE.OctahedronGeometry(isMobile ? 0.5 : 0.6);
        const octaMaterial = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          emissive: 0x0891b2,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.8,
        });
        const octa = new THREE.Mesh(octaGeometry, octaMaterial);
        octa.position.set(3, -1, -1);
        scene.add(octa);
        shapes.push(octa);

        const dodecaGeometry = new THREE.DodecahedronGeometry(isMobile ? 0.4 : 0.5);
        const dodecaMaterial = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x059669,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.6,
          wireframe: isMobile || throttle < 0.6 ? false : true,
        });
        const dodeca = new THREE.Mesh(dodecaGeometry, dodecaMaterial);
        dodeca.position.set(0, -2, -3);
        scene.add(dodeca);
        shapes.push(dodeca);

        // Particles
        const particleGeometry = new THREE.BufferGeometry();
        const particlePositions = new Float32Array(particleCount * 3);
        const particleColors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
          const radius = Math.random() * 8 + 2;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * Math.PI;

          particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
          particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          particlePositions[i * 3 + 2] = radius * Math.cos(phi);

          const colorChoice = Math.random();
          if (colorChoice < 0.33) {
            particleColors[i * 3] = 0.23; // Blue
            particleColors[i * 3 + 1] = 0.51;
            particleColors[i * 3 + 2] = 0.96;
          } else if (colorChoice < 0.66) {
            particleColors[i * 3] = 0.55; // Purple
            particleColors[i * 3 + 1] = 0.36;
            particleColors[i * 3 + 2] = 0.96;
          } else {
            particleColors[i * 3] = 0.02; // Cyan
            particleColors[i * 3 + 1] = 0.71;
            particleColors[i * 3 + 2] = 0.83;
          }
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

        // Reduce particle shader cost when throttled
        const particleMaterialOptions: any = {
          size: throttle < 0.6 ? (isMobile ? 0.03 : 0.02) : isMobile ? 0.045 : 0.03,
          vertexColors: true,
          transparent: true,
          opacity: throttle < 0.6 ? 0.6 : 0.8,
          sizeAttenuation: throttle >= 0.6,
          blending: throttle < 0.6 ? THREE.NormalBlending : THREE.AdditiveBlending,
        };

        const particleMaterial = new THREE.PointsMaterial(particleMaterialOptions);

        particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // Apply pixel ratio and sizing
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(width, height, false);
        renderer.setClearColor(0x000000, 0);

        // Save target FPS for the animation loop via rendererRef
        (renderer as any).__targetFPS = targetFPS;
        // also store throttle on renderer for quick access in the loop
        (renderer as any).__throttle = throttle;
      } catch (err) {
        console.warn('Error building 3D scene:', err);
      }
    };

    // Animation loop with pause when not visible
    let paused = false;
    const clock = new THREE.Clock();
    let lastFrameTime = performance.now();

    const animate = () => {
      if (paused) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }

      const now = performance.now();
      const targetFPS = (renderer as any).__targetFPS || 60;
      const throttle = (renderer as any).__throttle || getThrottleMultiplier();
      const clampedTarget = Math.max(15, Math.min(60, targetFPS));
      // Apply throttle multiplier to effective FPS
      const effectiveFPS = Math.max(15, Math.round(clampedTarget * throttle));
      const minFrameInterval = 1000 / effectiveFPS;

      if (now - lastFrameTime < minFrameInterval) {
        // skip this frame to throttle rendering on low-end devices
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }

      lastFrameTime = now;
      const elapsedTime = clock.getElapsedTime();

      if (orb) {
        orb.rotation.x = Math.sin(elapsedTime) * 0.2;
        orb.rotation.y = elapsedTime * 0.5;
        orb.position.y = Math.sin(elapsedTime * 0.8) * 0.3;

        if ((orb.material as any).emissiveIntensity !== undefined) {
          (orb.material as any).emissiveIntensity = 0.5 + Math.sin(elapsedTime * 2) * 0.2;
        }
      }

      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01 * (index + 1);
        shape.rotation.y += 0.005 * (index + 1);
      });

      if (particles) {
        particles.rotation.y = elapsedTime * 0.05;
        particles.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;
      }

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Visibility handling to pause when not visible or when user prefers reduced motion
    const handleVisibility = () => {
      const hidden = typeof document !== 'undefined' ? document.hidden : false;
      paused = hidden;
    };

    document.addEventListener('visibilitychange', handleVisibility);

    // IntersectionObserver to pause animations when the canvas is offscreen (saves CPU on mobile)
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries && entries[0];
        const currentlyVisible = !!entry && entry.isIntersecting;
        paused = !currentlyVisible;
      },
      { threshold: 0.1 }
    );

    io.observe(mountEl);

    // Resize handling using ResizeObserver for container-based sizing (throttled)
    let resizeTicking = false;
    const resizeObserver = new ResizeObserver((entries) => {
      const rect = entries && entries[0] && entries[0].contentRect;
      if (!rect) return;

      if (!resizeTicking) {
        resizeTicking = true;
        requestAnimationFrame(() => {
          try {
            const width = Math.max(1, Math.floor(rect.width));
            const height = Math.max(1, Math.floor(rect.height));

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            // Rebuild scene objects when size changes significantly on mobile to reduce detail
            buildScene(width, height);

            resizeTicking = false;
          } catch (err) {
            console.warn('Resize handling error:', err);
            resizeTicking = false;
          }
        });
      }
    });

    // Initial build using mount size
    const initialRect = mountEl.getBoundingClientRect();
    const initialW = Math.max(1, Math.floor(initialRect.width));
    const initialH = Math.max(1, Math.floor(initialRect.height));

    buildScene(initialW, initialH);

    resizeObserver.observe(mountEl);

    // Start animation
    animationIdRef.current = requestAnimationFrame(animate);
    setIsInitialized(true);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      io.disconnect();
      resizeObserver.disconnect();

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (mountRef.current && renderer.domElement) {
        try {
          mountRef.current.removeChild(renderer.domElement);
        } catch (e) {
          // ignore
        }
      }

      // Dispose of Three.js objects
      scene.traverse((object: THREE.Object3D) => {
        try {
          if (object instanceof THREE.Mesh) {
            if ((object as THREE.Mesh).geometry) (object as THREE.Mesh).geometry.dispose();
            if (Array.isArray((object as THREE.Mesh).material)) {
              ((object as THREE.Mesh).material as THREE.Material[]).forEach((material) => material.dispose());
            } else if ((object as THREE.Mesh).material) {
              (((object as THREE.Mesh).material) as THREE.Material).dispose();
            }
          }
        } catch (e) {
          // ignore dispose errors
        }
      });

      if (renderer) renderer.dispose();
    };
  }, [quality]);

  return (
    <div 
      className={`absolute inset-0 -z-10 transition-opacity duration-500 ${isInitialized ? 'opacity-100' : 'opacity-0'}`} 
      ref={mountRef}
    />
  );
}