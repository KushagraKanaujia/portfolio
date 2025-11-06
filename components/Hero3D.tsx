"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo } from "react";

export function Hero3D() {
  const ref = useRef<THREE.Points>(null);
  const count = 5000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) arr[i] = (Math.random() - 0.5) * 8;
    return arr;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.0015;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 65 }} className="absolute inset-0">
      <color attach="background" args={["transparent"]} />
      <OrbitControls enableZoom={false} enablePan={false} />
      <Points ref={ref} positions={positions} stride={3}>
        <PointMaterial
          transparent
          color="#38bdf8"
          size={0.03}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </Canvas>
  );
}


