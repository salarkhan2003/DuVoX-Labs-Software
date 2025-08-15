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
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
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
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
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
    <mesh ref={meshRef} position={position}>
      <GeometryComponent />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
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
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#8b5cf6" />
      <pointLight position={[10, -10, 10]} intensity={0.4} color="#06b6d4" />
      
      {/* 3D Objects */}
      <FloatingOrb />
      <SimpleParticles count={particleCount} />
      
      {/* Geometric Shapes */}
      <GeometricShape 
        position={[-3, 2, -2]} 
        geometry="tetrahedron" 
        color="#8b5cf6" 
      />
      <GeometricShape 
        position={[3, -1, -1]} 
        geometry="octahedron" 
        color="#06b6d4" 
      />
      <GeometricShape 
        position={[0, -2, -3]} 
        geometry="dodecahedron" 
        color="#10b981" 
      />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#000000', 8, 25]} />
    </>
  );
}

export function CompatibleScene3D({ quality = 'high' }: CompatibleScene3DProps) {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ 
          alpha: true, 
          antialias: quality !== 'low',
          powerPreference: 'high-performance'
        }}
        dpr={quality === 'low' ? 1 : quality === 'medium' ? 1.5 : 2}
        frameloop="demand"
      >
        <SceneContent quality={quality} />
      </Canvas>
    </div>
  );
}