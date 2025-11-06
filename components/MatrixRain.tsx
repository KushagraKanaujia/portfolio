"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Matrix characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>/\\|~`";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Initialize drops
    const drops: number[] = Array(columns).fill(1);
    const speeds: number[] = Array(columns)
      .fill(0)
      .map(() => 0.3 + Math.random() * 0.7);

    // Animation loop
    const animate = () => {
      // Fade effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];

        // Color gradient - brighter at the head
        const brightness = Math.floor(Math.random() * 155 + 100);
        ctx.fillStyle = `rgb(0, ${brightness}, ${brightness / 2})`;

        // Draw character
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(char, x, y);

        // Add glow effect at the head
        if (Math.random() > 0.98) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#00d9ff";
          ctx.fillStyle = "#00d9ff";
          ctx.fillText(char, x, y);
          ctx.shadowBlur = 0;
        }

        // Move drop
        drops[i] += speeds[i];

        // Reset drop
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = 0.3 + Math.random() * 0.7;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.3 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
