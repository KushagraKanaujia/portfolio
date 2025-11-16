"use client";

import { motion } from "framer-motion";

export default function FloatingShapes() {
  const shapes = [
    { color: "#00d9ff", size: 300, x: 20, y: 10 },
    { color: "#a855f7", size: 400, x: 70, y: 60 },
    { color: "#ff6b35", size: 350, x: 40, y: 80 },
    { color: "#10b981", size: 250, x: 80, y: 20 },
    { color: "#0066ff", size: 300, x: 10, y: 50 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            background: `radial-gradient(circle, ${shape.color}, transparent)`,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
