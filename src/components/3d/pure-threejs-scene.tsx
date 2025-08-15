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

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 8, 25);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 8);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: quality !== 'low',
      powerPreference: 'high-performance'
    });
    
    const pixelRatio = quality === 'low' ? 1 : quality === 'medium' ? 1.5 : 2;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

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

    // Create floating orb
    const orbGeometry = new THREE.IcosahedronGeometry(1, 1);
    const orbMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x1e40af,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.8,
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    scene.add(orb);

    // Create geometric shapes
    const shapes: THREE.Mesh[] = [];

    // Tetrahedron
    const tetraGeometry = new THREE.TetrahedronGeometry(0.8);
    const tetraMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x5b21b6,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.7,
      wireframe: true,
    });
    const tetra = new THREE.Mesh(tetraGeometry, tetraMaterial);
    tetra.position.set(-3, 2, -2);
    scene.add(tetra);
    shapes.push(tetra);

    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(0.6);
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

    // Dodecahedron
    const dodecaGeometry = new THREE.DodecahedronGeometry(0.5);
    const dodecaMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.6,
      wireframe: true,
    });
    const dodeca = new THREE.Mesh(dodecaGeometry, dodecaMaterial);
    dodeca.position.set(0, -2, -3);
    scene.add(dodeca);
    shapes.push(dodeca);

    // Create particles
    const particleCount = quality === 'low' ? 50 : quality === 'medium' ? 100 : 200;
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

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Animate orb
      orb.rotation.x = Math.sin(elapsedTime) * 0.2;
      orb.rotation.y = elapsedTime * 0.5;
      orb.position.y = Math.sin(elapsedTime * 0.8) * 0.3;
      
      if (orbMaterial.emissiveIntensity !== undefined) {
        orbMaterial.emissiveIntensity = 0.5 + Math.sin(elapsedTime * 2) * 0.2;
      }

      // Animate shapes
      shapes.forEach((shape, index) => {
        shape.rotation.x += 0.01 * (index + 1);
        shape.rotation.y += 0.005 * (index + 1);
      });

      // Animate particles
      particles.rotation.y = elapsedTime * 0.05;
      particles.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1;

      renderer.render(scene, camera);
      animationIdRef.current = requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Start animation
    animate();
    setIsInitialized(true);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose of Three.js objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
    };
  }, [quality]);

  return (
    <div 
      className="absolute inset-0 -z-10" 
      ref={mountRef}
      style={{ 
        opacity: isInitialized ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}
    />
  );
}