"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Line } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// Neural Network Node
function NeuralNode({ position, color, size = 0.15 }: any) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(
        size + Math.sin(state.clock.elapsedTime * 2) * 0.05
      );
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[size, 32, 32]}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        toneMapped={false}
      />
    </Sphere>
  );
}

// Connection Line
function Connection({ start, end, color = "#00d9ff" }: any) {
  const points = useMemo(() => [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ], [start, end]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={1}
      transparent
      opacity={0.3}
    />
  );
}

// Data Particle flowing through network
function DataParticle({ path, speed = 1 }: any) {
  const particleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (particleRef.current && path.length >= 2) {
      const t = (Math.sin(state.clock.elapsedTime * speed) + 1) / 2;
      const startPos = new THREE.Vector3(...path[0]);
      const endPos = new THREE.Vector3(...path[1]);
      particleRef.current.position.lerpVectors(startPos, endPos, t);
    }
  });

  return (
    <Sphere ref={particleRef} args={[0.05, 16, 16]}>
      <meshStandardMaterial
        color="#00d9ff"
        emissive="#00d9ff"
        emissiveIntensity={2}
        toneMapped={false}
      />
    </Sphere>
  );
}

// Main Neural Network Scene
function NeuralNetworkScene() {
  const groupRef = useRef<THREE.Group>(null);

  // Layer positions
  const inputLayer = useMemo(() => [
    [-2, 1.5, 0],
    [-2, 0.5, 0],
    [-2, -0.5, 0],
    [-2, -1.5, 0],
  ], []);

  const hiddenLayer1 = useMemo(() => [
    [0, 2, 0],
    [0, 1, 0],
    [0, 0, 0],
    [0, -1, 0],
    [0, -2, 0],
  ], []);

  const hiddenLayer2 = useMemo(() => [
    [2, 1.5, 0],
    [2, 0.5, 0],
    [2, -0.5, 0],
    [2, -1.5, 0],
  ], []);

  const outputLayer = useMemo(() => [
    [4, 0.5, 0],
    [4, -0.5, 0],
  ], []);

  // Auto-rotate
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient Light */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d9ff" />

      {/* Input Layer */}
      {inputLayer.map((pos, idx) => (
        <NeuralNode key={`input-${idx}`} position={pos} color="#00d9ff" size={0.12} />
      ))}

      {/* Hidden Layer 1 */}
      {hiddenLayer1.map((pos, idx) => (
        <NeuralNode key={`hidden1-${idx}`} position={pos} color="#0066ff" size={0.15} />
      ))}

      {/* Hidden Layer 2 */}
      {hiddenLayer2.map((pos, idx) => (
        <NeuralNode key={`hidden2-${idx}`} position={pos} color="#0066ff" size={0.15} />
      ))}

      {/* Output Layer */}
      {outputLayer.map((pos, idx) => (
        <NeuralNode key={`output-${idx}`} position={pos} color="#a855f7" size={0.18} />
      ))}

      {/* Connections: Input to Hidden Layer 1 */}
      {inputLayer.map((startPos, i) =>
        hiddenLayer1.map((endPos, j) => (
          <Connection
            key={`conn-input-hidden1-${i}-${j}`}
            start={startPos}
            end={endPos}
            color="#00d9ff"
          />
        ))
      )}

      {/* Connections: Hidden Layer 1 to Hidden Layer 2 */}
      {hiddenLayer1.map((startPos, i) =>
        hiddenLayer2.map((endPos, j) => (
          <Connection
            key={`conn-hidden1-hidden2-${i}-${j}`}
            start={startPos}
            end={endPos}
            color="#0066ff"
          />
        ))
      )}

      {/* Connections: Hidden Layer 2 to Output */}
      {hiddenLayer2.map((startPos, i) =>
        outputLayer.map((endPos, j) => (
          <Connection
            key={`conn-hidden2-output-${i}-${j}`}
            start={startPos}
            end={endPos}
            color="#a855f7"
          />
        ))
      )}

      {/* Data Particles */}
      <DataParticle path={[inputLayer[0], hiddenLayer1[1]]} speed={0.8} />
      <DataParticle path={[inputLayer[2], hiddenLayer1[3]]} speed={1.2} />
      <DataParticle path={[hiddenLayer1[0], hiddenLayer2[1]]} speed={1} />
      <DataParticle path={[hiddenLayer1[4], hiddenLayer2[2]]} speed={0.9} />
      <DataParticle path={[hiddenLayer2[0], outputLayer[0]]} speed={1.1} />
      <DataParticle path={[hiddenLayer2[3], outputLayer[1]]} speed={0.85} />
    </group>
  );
}

export default function NeuralNetworkHero() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <NeuralNetworkScene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
