"use client";

import { motion } from "framer-motion";

export default function AnimatedDivider() {
  return (
    <div className="relative h-32 my-20">
      {/* Gradient line */}
      <motion.div
        className="absolute left-0 right-0 top-1/2 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Glowing dot */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
      >
        <motion.div
          className="w-4 h-4 rounded-full bg-accent"
          animate={{
            boxShadow: [
              "0 0 0px rgba(0, 217, 255, 0.4)",
              "0 0 30px rgba(0, 217, 255, 0.8)",
              "0 0 0px rgba(0, 217, 255, 0.4)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Small side dots */}
      {[-100, 100].map((offset, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent/50"
          style={{ marginLeft: offset }}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 + i * 0.1, type: "spring" }}
        />
      ))}
    </div>
  );
}
