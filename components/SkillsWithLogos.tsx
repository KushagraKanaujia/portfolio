"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

// Technology data with icon paths (using SVG or emoji)
const technologies = [
  { name: "Python", icon: "🐍", color: "#3776ab", category: "Backend" },
  { name: "JavaScript", icon: "⚡", color: "#f7df1e", category: "Frontend" },
  { name: "TypeScript", icon: "📘", color: "#3178c6", category: "Frontend" },
  { name: "React", icon: "⚛️", color: "#61dafb", category: "Frontend" },
  { name: "Next.js", icon: "▲", color: "#000000", category: "Frontend" },
  { name: "Node.js", icon: "🟢", color: "#339933", category: "Backend" },
  { name: "PyTorch", icon: "🔥", color: "#ee4c2c", category: "ML" },
  { name: "TensorFlow", icon: "🧠", color: "#ff6f00", category: "ML" },
  { name: "PostgreSQL", icon: "🐘", color: "#336791", category: "Database" },
  { name: "MongoDB", icon: "🍃", color: "#47a248", category: "Database" },
  { name: "Redis", icon: "💎", color: "#dc382d", category: "Database" },
  { name: "Docker", icon: "🐳", color: "#2496ed", category: "DevOps" },
  { name: "Kubernetes", icon: "☸️", color: "#326ce5", category: "DevOps" },
  { name: "AWS", icon: "☁️", color: "#ff9900", category: "Cloud" },
  { name: "Git", icon: "🌿", color: "#f05032", category: "Tools" },
  { name: "Java", icon: "☕", color: "#007396", category: "Backend" },
];

export default function SkillsWithLogos() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Floating animation for background icons
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const floatingIcons = document.querySelectorAll(".floating-icon");
    floatingIcons.forEach((icon, i) => {
      const duration = 3000 + Math.random() * 2000;
      const delay = i * 200;

      (icon as HTMLElement).style.animation = `float ${duration}ms ease-in-out ${delay}ms infinite`;
    });
  }, []);

  return (
    <section
      id="skills"
      className="section-100vh bg-gradient-to-b from-black via-neutral-950 to-black relative overflow-hidden"
      ref={containerRef}
    >
      {/* Floating Background Tech Icons */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {technologies.slice(0, 8).map((tech, i) => (
          <div
            key={i}
            className="floating-icon absolute text-6xl"
            style={{
              left: `${(i * 12) + 5}%`,
              top: `${(i % 3) * 30 + 10}%`,
            }}
          >
            {tech.icon}
          </div>
        ))}
      </div>

      <div className="wrap relative z-10">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl font-bold gradient-text-apple mb-6">
            Tech Arsenal
          </h2>
          <p className="text-xl md:text-2xl text-gray-400">
            Tools I wield to build exceptional software
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.05,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.15,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.3 },
              }}
              className="relative group"
            >
              {/* Glow Effect */}
              <div
                className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                style={{ background: tech.color }}
              />

              {/* Card */}
              <div className="relative glass-card rounded-2xl p-6 text-center border-2 border-white/10 group-hover:border-accent/50 transition-all duration-300">
                {/* Icon */}
                <motion.div
                  className="text-6xl mb-3"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {tech.icon}
                </motion.div>

                {/* Name */}
                <h3 className="text-base font-semibold text-white mb-1">
                  {tech.name}
                </h3>

                {/* Category Tag */}
                <span
                  className="inline-block px-2 py-1 text-xs rounded-full"
                  style={{
                    background: `${tech.color}20`,
                    color: tech.color,
                    border: `1px solid ${tech.color}40`,
                  }}
                >
                  {tech.category}
                </span>

                {/* Hover Pulse Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-accent opacity-0 group-hover:opacity-100 group-hover:animate-ping pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Animated Skill Proficiency Bars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <SkillBar skill="Machine Learning" proficiency={95} color="#00d9ff" />
          <SkillBar skill="Full-Stack Development" proficiency={90} color="#a855f7" />
          <SkillBar skill="System Architecture" proficiency={88} color="#ff6b35" />
          <SkillBar skill="Cloud & DevOps" proficiency={85} color="#10b981" />
        </motion.div>
      </div>

      {/* Add floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
          75% {
            transform: translateY(-15px) rotate(3deg);
          }
        }
      `}</style>
    </section>
  );
}

function SkillBar({
  skill,
  proficiency,
  color,
}: {
  skill: string;
  proficiency: number;
  color: string;
}) {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-3">
        <span className="text-lg font-semibold text-white">{skill}</span>
        <span
          className="text-2xl font-bold"
          style={{
            background: `linear-gradient(135deg, ${color}, ${color}80)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {proficiency}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}80)`,
          }}
        >
          {/* Animated Shine Effect */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `linear-gradient(90deg, transparent, white, transparent)`,
              animation: "shine 2s infinite",
            }}
          />
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  );
}
