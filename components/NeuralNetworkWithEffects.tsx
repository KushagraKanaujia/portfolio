"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Text } from "@react-three/drei";
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

interface NodeProps {
  position: [number, number, number];
  label: string;
  color: string;
  onHover: (label: string | null) => void;
}

const Node = ({ position, label, color, onHover }: NodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1);

      if (hovered) {
        meshRef.current.scale.setScalar(1.3 + Math.sin(time * 3) * 0.15);
      }
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[0.15, 32, 32]}
        onPointerOver={() => {
          setHovered(true);
          onHover(label);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 3 : 1}
          toneMapped={false}
        />
      </Sphere>
      {hovered && (
        <Text
          position={[0, 0.4, 0]}
          fontSize={0.15}
          color="#00d9ff"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
};

interface ConnectionProps {
  start: [number, number, number];
  end: [number, number, number];
}

const Connection = ({ start, end }: ConnectionProps) => {
  const lineRef = useRef<THREE.Line>(null);

  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      const time = state.clock.getElapsedTime();
      material.opacity = 0.3 + Math.sin(time * 2) * 0.2;
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color="#00d9ff"
        transparent
        opacity={0.3}
        toneMapped={false}
      />
    </line>
  );
};

const DataParticle = ({ path, delay }: { path: [number, number, number][]; delay: number }) => {
  const particleRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (particleRef.current && path.length >= 2) {
      const time = (state.clock.getElapsedTime() + delay) % 2;
      const progress = time / 2;
      const segmentIndex = Math.floor(progress * (path.length - 1));
      const segmentProgress = (progress * (path.length - 1)) % 1;

      if (segmentIndex < path.length - 1) {
        const start = new THREE.Vector3(...path[segmentIndex]);
        const end = new THREE.Vector3(...path[segmentIndex + 1]);
        particleRef.current.position.lerpVectors(start, end, segmentProgress);
      }
    }
  });

  return (
    <Sphere ref={particleRef} args={[0.05, 16, 16]}>
      <meshBasicMaterial color="#ff6b35" emissive="#ff6b35" emissiveIntensity={2} toneMapped={false} />
    </Sphere>
  );
};

const NeuralNetworkScene = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  const inputLayer: Array<{ pos: [number, number, number]; label: string }> = [
    { pos: [-2, 1.5, 0], label: "Python" },
    { pos: [-2, 0.5, 0], label: "C++" },
    { pos: [-2, -0.5, 0], label: "TypeScript" },
    { pos: [-2, -1.5, 0], label: "ML/AI" },
  ];

  const hiddenLayer: Array<{ pos: [number, number, number]; label: string }> = [
    { pos: [0, 2, 0], label: "Systems" },
    { pos: [0, 0.7, 0], label: "Backend" },
    { pos: [0, -0.7, 0], label: "Frontend" },
    { pos: [0, -2, 0], label: "Cloud" },
  ];

  const outputLayer: Array<{ pos: [number, number, number]; label: string }> = [
    { pos: [2, 1, 0], label: "Dawdle" },
    { pos: [2, 0, 0], label: "ApexTrade" },
    { pos: [2, -1, 0], label: "BusTub" },
  ];

  useFrame((state) => {
    if (groupRef.current && !hoveredNode) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {inputLayer.map((input, i) =>
          hiddenLayer.map((hidden, j) => (
            <Connection
              key={`in-hidden-${i}-${j}`}
              start={input.pos}
              end={hidden.pos}
            />
          ))
        )}

        {hiddenLayer.map((hidden, i) =>
          outputLayer.map((output, j) => (
            <Connection
              key={`hidden-out-${i}-${j}`}
              start={hidden.pos}
              end={output.pos}
            />
          ))
        )}

        {[0, 1, 2, 3].map((i) => (
          <DataParticle
            key={`particle-${i}`}
            path={[
              inputLayer[i % inputLayer.length].pos,
              hiddenLayer[i % hiddenLayer.length].pos,
              outputLayer[i % outputLayer.length].pos,
            ]}
            delay={i * 0.5}
          />
        ))}

        {inputLayer.map((node) => (
          <Node
            key={node.label}
            position={node.pos}
            label={node.label}
            color="#00d9ff"
            onHover={setHoveredNode}
          />
        ))}

        {hiddenLayer.map((node) => (
          <Node
            key={node.label}
            position={node.pos}
            label={node.label}
            color="#0ea5e9"
            onHover={setHoveredNode}
          />
        ))}

        {outputLayer.map((node) => (
          <Node
            key={node.label}
            position={node.pos}
            label={node.label}
            color="#ff6b35"
            onHover={setHoveredNode}
          />
        ))}

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d9ff" />
      </group>

      {/* Post-processing effects */}
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0005, 0.0005]}
        />
        <Vignette
          offset={0.3}
          darkness={0.5}
          blendFunction={BlendFunction.NORMAL}
        />
      </EffectComposer>
    </>
  );
};

const NeuralNetworkWithEffects = () => {
  return (
    <div className="w-full h-[600px] md:h-[700px]">
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
        <color attach="background" args={["#0a0a0a"]} />
        <NeuralNetworkScene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default NeuralNetworkWithEffects;
