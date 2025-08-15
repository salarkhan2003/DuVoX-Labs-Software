'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

interface CompatibleScene3DProps {
  quality?: 'low' | 'medium' | 'high';
}

function FloatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
    }
  });

  return (
    <mesh position={[0, 0, 0]} ref={meshRef}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        transparent
        color="#3b82f6"
        emissive="#1e40af"
        emissiveIntensity={0.5}
        metalness={0.8}
        opacity={0.8}
        roughness={0.1}
      />
    </mesh>
  );
}

function SimpleParticles({ count = 100 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          array={positions}
          attach="attributes-position"
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        sizeAttenuation
        transparent
        color="#8b5cf6"
        opacity={0.6}
        size={0.05}
      />
    </points>
  );
}

function GeometricShape({ position, geometry, color }: {
  position: [number, number, number];
  geometry: 'tetrahedron' | 'octahedron' | 'dodecahedron';
  color: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.005;
    }
  });

  const GeometryComponent = () => {
    switch (geometry) {
      case 'tetrahedron':
        return <tetrahedronGeometry args={[0.8]} />;
      case 'octahedron':
        return <octahedronGeometry args={[0.6]} />;
      case 'dodecahedron':
        return <dodecahedronGeometry args={[0.5]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <mesh position={position} ref={meshRef}>
      <GeometryComponent />
      <meshStandardMaterial
        transparent
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        opacity={0.7}
        wireframe={geometry === 'tetrahedron' || geometry === 'dodecahedron'}
      />
    </mesh>
  );
}

function SceneContent({ quality }: { quality: 'low' | 'medium' | 'high' }) {
  const { gl } = useThree();
  
  useEffect(() => {
    // Configure renderer based on quality
    if (quality === 'low') {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      gl.antialias = false;
    } else if (quality === 'medium') {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    } else {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
  }, [gl, quality]);

  const particleCount = quality === 'low' ? 50 : quality === 'medium' ? 100 : 150;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight intensity={0.8} position={[10, 10, 5]} />
      <pointLight color="#8b5cf6" intensity={0.6} position={[-10, -10, -10]} />
      <pointLight color="#06b6d4" intensity={0.4} position={[10, -10, 10]} />
      
      {/* 3D Objects */}
      <FloatingOrb />
      <SimpleParticles count={particleCount} />
      
      {/* Geometric Shapes */}
      <GeometricShape 
        color="#8b5cf6" 
        geometry="tetrahedron" 
        position={[-3, 2, -2]} 
      />
      <GeometricShape 
        color="#06b6d4" 
        geometry="octahedron" 
        position={[3, -1, -1]} 
      />
      <GeometricShape 
        color="#10b981" 
        geometry="dodecahedron" 
        position={[0, -2, -3]} 
      />
      
      {/* Fog for depth */}
      <fog args={['#000000', 8, 25]} attach="fog" />
    </>
  );
}

export function CompatibleScene3D({ quality = 'high' }: CompatibleScene3DProps) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={quality === 'low' ? 1 : quality === 'medium' ? 1.5 : 2}
        frameloop="demand"
        gl={{ 
          alpha: true, 
          antialias: quality !== 'low',
          powerPreference: 'high-performance'
        }}
      >
        <SceneContent quality={quality} />
      </Canvas>
    </div>
  );
}