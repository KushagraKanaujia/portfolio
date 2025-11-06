"use client";

import { motion } from "framer-motion";

export default function Logo() {
  return (
    <motion.div
      className="relative w-12 h-12 cursor-pointer"
      initial={{ opacity: 0, rotate: -180 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{ scale: 1.1, rotate: 360 }}
      whileTap={{ scale: 0.95 }}
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Outer hexagon */}
        <motion.path
          d="M24 2L44 14L44 34L24 46L4 34L4 14L24 2Z"
          stroke="url(#logo-gradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Inner K letters */}
        <g className="text-accent">
          {/* First K */}
          <motion.path
            d="M16 14L16 34M16 24L22 14M16 24L22 34"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />

          {/* Second K */}
          <motion.path
            d="M26 14L26 34M26 24L32 14M26 24L32 34"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
          />
        </g>

        {/* Gradient definition */}
        <defs>
          <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d9ff" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#00d9ff" />
          </linearGradient>
        </defs>
      </svg>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-accent/20 blur-xl -z-10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.8, 1.2, 0.8],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}
