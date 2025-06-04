"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';

export default function GlowingGlobe() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
        <BaseGlobe />
        <GlowingPoints />
      </Canvas>
    </div>
  );
}

// Base solid/transparent sphere
function BaseGlobe() {
  return (
    <Sphere args={[1, 64, 64]}>
      {/* Using a Standard material for better lighting interaction */}
      <meshStandardMaterial color="#1a202c" transparent opacity={0.5} roughness={0.7} metalness={0.2} />
    </Sphere>
  );
}

// Glowing points on the sphere's surface
function GlowingPoints() {
  const ref = useRef<any>();
  // Generate points directly on the sphere's surface
  const points = Array.from({ length: 2000 }, () => {
    const r = 1; // Sphere radius
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    return new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
  }).reduce((acc, v) => acc.concat(v.toArray()), [] as number[]);

  const float32Points = new Float32Array(points);

  // No separate rotation here, points rotate with the base sphere
  // useFrame(() => {
  //   if (ref.current) {
  //     ref.current.rotation.y += 0.0015
  //   }
  // })

  return (
    <Points ref={ref} positions={float32Points} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#00ffff"
        size={0.01}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending} // Additive blending for glow effect
      />
    </Points>
  );
}