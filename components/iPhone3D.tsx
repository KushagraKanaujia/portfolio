"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import * as THREE from "three";

const iPhoneColors = {
  frame: "#1a1a1a",
  screen: "#000000",
  accent: "#00d9ff",
};

interface ScreenContentProps {
  currentSlide: number;
}

const ScreenContent = ({ currentSlide }: ScreenContentProps) => {
  const slides = [
    { title: "Dawdle", subtitle: "Connect spontaneously" },
    { title: "Real-time", subtitle: "Matching in <2s" },
    { title: "500+", subtitle: "Active users" },
  ];

  const slide = slides[currentSlide];

  return (
    <group position={[0, 0, 0.051]}>
      {/* Screen background */}
      <mesh>
        <planeGeometry args={[0.65, 1.35]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>

      {/* App content */}
      <Text
        position={[0, 0.3, 0.01]}
        fontSize={0.12}
        color={iPhoneColors.accent}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {slide.title}
      </Text>

      <Text
        position={[0, 0.1, 0.01]}
        fontSize={0.06}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {slide.subtitle}
      </Text>

      {/* Mock UI elements */}
      <mesh position={[0, -0.2, 0.01]}>
        <roundedRectangleGeometry args={[0.5, 0.12, 0.03]} />
        <meshBasicMaterial color={iPhoneColors.accent} />
      </mesh>

      <Text
        position={[0, -0.2, 0.02]}
        fontSize={0.05}
        color="#000000"
        anchorX="center"
        anchorY="middle"
      >
        Find Hangouts
      </Text>

      {/* Indicators */}
      <group position={[0, -0.5, 0.01]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[(i - 1) * 0.08, 0, 0]}>
            <circleGeometry args={[0.02, 32]} />
            <meshBasicMaterial
              color={i === currentSlide ? iPhoneColors.accent : "#333333"}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

const iPhone = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;

      // Auto-rotate slightly
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }

    // Auto-advance slides
    const slideTime = Math.floor(state.clock.getElapsedTime() / 3) % 3;
    setCurrentSlide(slideTime);
  });

  return (
    <group ref={groupRef}>
      {/* iPhone frame */}
      <RoundedBox args={[0.75, 1.5, 0.1]} radius={0.08} smoothness={4}>
        <meshStandardMaterial
          color={iPhoneColors.frame}
          metalness={0.8}
          roughness={0.2}
        />
      </RoundedBox>

      {/* Screen */}
      <ScreenContent currentSlide={currentSlide} />

      {/* Camera notch */}
      <mesh position={[0, 0.65, 0.051]}>
        <capsuleGeometry args={[0.02, 0.1, 4, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Side buttons */}
      <mesh position={[-0.38, 0.3, 0]}>
        <boxGeometry args={[0.02, 0.15, 0.02]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Glow effect around phone */}
      <pointLight
        position={[0, 0, 0.5]}
        intensity={0.5}
        distance={2}
        color={iPhoneColors.accent}
      />
    </group>
  );
};

const iPhone3D = () => {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden bg-gradient-to-b from-background to-card">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <color attach="background" args={["#0a0a0a"]} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, 0]} intensity={0.3} color="#00d9ff" />

        {/* iPhone model */}
        <iPhone />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false}
        />
      </Canvas>

      {/* Interaction hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm">
        Drag to rotate • Auto-cycling demo
      </div>
    </div>
  );
};

export default iPhone3D;
