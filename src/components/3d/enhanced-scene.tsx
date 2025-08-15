'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';

interface EnhancedScene3DProps {
  quality?: 'low' | 'medium' | 'high';
}

function FloatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
    
    if (materialRef.current) {
      materialRef.current.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#3b82f6"
        emissive="#1e40af"
        emissiveIntensity={0.5}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

function GeometricShapes() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Floating Tetrahedron */}
      <mesh position={[-3, 2, -2]}>
        <tetrahedronGeometry args={[0.8]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#5b21b6"
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
          wireframe
        />
      </mesh>
      
      {/* Rotating Octahedron */}
      <mesh position={[3, -1, -1]}>
        <octahedronGeometry args={[0.6]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.4}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Dodecahedron */}
      <mesh position={[0, -2, -3]}>
        <dodecahedronGeometry args={[0.5]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#059669"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
          wireframe
        />
      </mesh>
    </group>
  );
}

function ParticleField({ quality }: { quality: 'low' | 'medium' | 'high' }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const particleCount = quality === 'low' ? 50 : quality === 'medium' ? 100 : 200;
  
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      // Create a more structured particle distribution
      const radius = Math.random() * 8 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Assign colors based on position
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 0.23; // Blue
        colors[i * 3 + 1] = 0.51;
        colors[i * 3 + 2] = 0.96;
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.55; // Purple
        colors[i * 3 + 1] = 0.36;
        colors[i * 3 + 2] = 0.96;
      } else {
        colors[i * 3] = 0.02; // Cyan
        colors[i * 3 + 1] = 0.71;
        colors[i * 3 + 2] = 0.83;
      }
    }
    
    return { positions, colors };
  }, [particleCount]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ConnectedNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const lineRef = useRef<THREE.LineSegments>(null);
  
  const nodePositions = useMemo(() => [
    [-2, 1, 0],
    [2, 1, 0],
    [0, -1, 1],
    [-1, 0, -1],
    [1, 0, -1],
  ], []);

  const { linePositions } = useMemo(() => {
    const positions: number[] = [];
    
    // Connect nodes with lines
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (Math.random() > 0.4) { // Only connect some nodes
          positions.push(...nodePositions[i], ...nodePositions[j]);
        }
      }
    }
    
    return { linePositions: new Float32Array(positions) };
  }, [nodePositions]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.08;
    }
    
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      material.opacity = 0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connection lines */}
      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.3}
        />
      </lineSegments>
      
      {/* Nodes */}
      {nodePositions.map((position, index) => (
        <mesh key={index} position={position as [number, number, number]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial
            color="#60a5fa"
            emissive="#3b82f6"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}

export function EnhancedScene3D({ quality = 'high' }: EnhancedScene3DProps) {
  const qualitySettings = {
    low: {
      antialias: false,
      shadows: false,
      pixelRatio: Math.min(window.devicePixelRatio, 1),
    },
    medium: {
      antialias: true,
      shadows: false,
      pixelRatio: Math.min(window.devicePixelRatio, 1.5),
    },
    high: {
      antialias: true,
      shadows: true,
      pixelRatio: Math.min(window.devicePixelRatio, 2),
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
        frameloop="demand"
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
          <ParticleField quality={quality} />
          <ConnectedNodes />
          
          {/* Fog for depth */}
          <fog attach="fog" args={['#000000', 8, 25]} />
        </Suspense>
      </Canvas>
    </div>
  );
}