"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Text, Line } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

interface Skill {
  name: string;
  category: string;
  proficiency: number; // 0-1
  position: [number, number, number];
  color: string;
}

interface SkillNodeProps {
  skill: Skill;
  onHover: (skill: Skill | null) => void;
  isConnected: boolean;
}

const SkillNode = ({ skill, onHover, isConnected }: SkillNodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Orbit animation
      const orbitSpeed = 0.2;
      const angle = time * orbitSpeed + skill.proficiency * Math.PI * 2;
      const radius = 2 + skill.proficiency * 1.5;

      // Gentle pulsing
      const scale = skill.proficiency + Math.sin(time * 2 + skill.proficiency * 10) * 0.1;
      meshRef.current.scale.setScalar(hovered || isConnected ? scale * 1.5 : scale);
    }
  });

  return (
    <group position={skill.position}>
      <Sphere
        ref={meshRef}
        args={[0.1, 32, 32]}
        onPointerOver={() => {
          setHovered(true);
          onHover(skill);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <meshStandardMaterial
          color={skill.color}
          emissive={skill.color}
          emissiveIntensity={hovered || isConnected ? 2 : 0.5}
          metalness={0.8}
          roughness={0.2}
          toneMapped={false}
        />
      </Sphere>

      {(hovered || isConnected) && (
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.12}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {skill.name}
        </Text>
      )}

      {/* Glow ring */}
      {(hovered || isConnected) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.15, 0.2, 32]} />
          <meshBasicMaterial
            color={skill.color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}
    </group>
  );
};

const SkillConnection = ({
  start,
  end,
  active,
}: {
  start: [number, number, number];
  end: [number, number, number];
  active: boolean;
}) => {
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  return (
    <Line
      points={points}
      color={active ? "#00d9ff" : "#333333"}
      lineWidth={active ? 2 : 1}
      transparent
      opacity={active ? 0.6 : 0.2}
    />
  );
};

const GalaxyScene = () => {
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  const skills: Skill[] = useMemo(
    () => [
      // ML/AI Cluster
      { name: "PyTorch", category: "ml", proficiency: 0.95, position: [-2, 1, 0], color: "#ff6b35" },
      { name: "TensorFlow", category: "ml", proficiency: 0.9, position: [-1.5, 1.5, -0.5], color: "#ff6b35" },
      { name: "Scikit-learn", category: "ml", proficiency: 0.85, position: [-2.5, 0.5, 0.5], color: "#ff6b35" },

      // Backend Cluster
      { name: "Node.js", category: "backend", proficiency: 0.9, position: [0, 2, 0], color: "#00d9ff" },
      { name: "Python", category: "backend", proficiency: 0.95, position: [0.5, 1.5, -0.5], color: "#00d9ff" },
      { name: "FastAPI", category: "backend", proficiency: 0.85, position: [-0.5, 2.5, 0.5], color: "#00d9ff" },

      // Frontend Cluster
      { name: "React", category: "frontend", proficiency: 0.9, position: [2, 1, 0], color: "#0ea5e9" },
      { name: "Next.js", category: "frontend", proficiency: 0.95, position: [2.5, 0.5, -0.5], color: "#0ea5e9" },
      { name: "TypeScript", category: "frontend", proficiency: 0.9, position: [1.5, 1.5, 0.5], color: "#0ea5e9" },

      // Database Cluster
      { name: "PostgreSQL", category: "database", proficiency: 0.85, position: [0, -1.5, 0], color: "#a855f7" },
      { name: "Redis", category: "database", proficiency: 0.8, position: [0.5, -2, -0.5], color: "#a855f7" },
      { name: "MongoDB", category: "database", proficiency: 0.75, position: [-0.5, -1, 0.5], color: "#a855f7" },

      // Cloud/DevOps Cluster
      { name: "AWS", category: "cloud", proficiency: 0.85, position: [-1, -1, -1], color: "#f59e0b" },
      { name: "Docker", category: "cloud", proficiency: 0.9, position: [1, -1, 1], color: "#f59e0b" },
      { name: "Kubernetes", category: "cloud", proficiency: 0.75, position: [0, -0.5, -1.5], color: "#f59e0b" },

      // Systems Cluster
      { name: "C++", category: "systems", proficiency: 0.85, position: [1.5, 0, 1.5], color: "#22c55e" },
      { name: "Rust", category: "systems", proficiency: 0.7, position: [-1.5, 0, -1.5], color: "#22c55e" },
    ],
    []
  );

  // Generate connections between related skills
  const connections = useMemo(() => {
    const conns: Array<{
      start: [number, number, number];
      end: [number, number, number];
      active: boolean;
    }> = [];

    // Connect skills within same category
    skills.forEach((skill, i) => {
      skills.forEach((other, j) => {
        if (i < j && skill.category === other.category) {
          conns.push({
            start: skill.position,
            end: other.position,
            active: hoveredSkill?.category === skill.category,
          });
        }
      });
    });

    return conns;
  }, [skills, hoveredSkill]);

  // Auto-rotation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Connections */}
      {connections.map((conn, i) => (
        <SkillConnection key={`conn-${i}`} {...conn} />
      ))}

      {/* Skill nodes */}
      {skills.map((skill) => (
        <SkillNode
          key={skill.name}
          skill={skill}
          onHover={setHoveredSkill}
          isConnected={hoveredSkill?.category === skill.category}
        />
      ))}

      {/* Central core sphere */}
      <Sphere args={[0.3, 32, 32]}>
        <meshStandardMaterial
          color="#00d9ff"
          emissive="#00d9ff"
          emissiveIntensity={0.5}
          wireframe
          opacity={0.3}
          transparent
        />
      </Sphere>

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#00d9ff" />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#ff6b35" />
    </group>
  );
};

const SkillsGalaxy3D = () => {
  return (
    <div className="w-full h-[600px] md:h-[700px] rounded-lg overflow-hidden bg-gradient-to-b from-background to-card">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <color attach="background" args={["#0a0a0a"]} />
        <GalaxyScene />
        <OrbitControls
          enableZoom={true}
          minDistance={4}
          maxDistance={10}
          enablePan={false}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};

export default SkillsGalaxy3D;
