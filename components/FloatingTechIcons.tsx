"use client";

import { motion } from "framer-motion";

const techIcons = [
  { emoji: "⚛️", label: "React", delay: 0 },
  { emoji: "🐍", label: "Python", delay: 0.5 },
  { emoji: "🔥", label: "Firebase", delay: 1 },
  { emoji: "⚡", label: "Next.js", delay: 1.5 },
  { emoji: "🧠", label: "ML", delay: 2 },
  { emoji: "🚀", label: "Node", delay: 2.5 },
  { emoji: "📊", label: "Data", delay: 3 },
  { emoji: "☁️", label: "Cloud", delay: 3.5 },
  { emoji: "🎨", label: "Design", delay: 4 },
  { emoji: "🔒", label: "Security", delay: 4.5 },
];

export default function FloatingTechIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {techIcons.map((icon, index) => (
        <motion.div
          key={index}
          className="absolute text-4xl opacity-10"
          initial={{
            x: Math.random() * 100 - 50 + "%",
            y: Math.random() * 100 - 50 + "%",
            scale: 0,
            rotate: 0,
          }}
          animate={{
            x: [
              Math.random() * 100 - 50 + "%",
              Math.random() * 100 - 50 + "%",
              Math.random() * 100 - 50 + "%",
            ],
            y: [
              Math.random() * 100 - 50 + "%",
              Math.random() * 100 - 50 + "%",
              Math.random() * 100 - 50 + "%",
            ],
            scale: [0, 1, 1, 0],
            rotate: [0, 180, 360],
            opacity: [0, 0.15, 0.15, 0],
          }}
          transition={{
            duration: 20,
            delay: icon.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {icon.emoji}
        </motion.div>
      ))}
    </div>
  );
}
