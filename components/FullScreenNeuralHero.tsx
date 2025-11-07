"use client";

import { motion } from "framer-motion";
import { ArrowDown, Github, Linkedin } from "lucide-react";
import { useEffect, useRef } from "react";

export default function FullScreenNeuralHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    // Optimized particle system - 80 particles instead of 150
    const particles: Array<{
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    const particleCount = 80; // Reduced from 150
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create particles with initial scatter positions
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const radius = Math.random() * 250 + 150;
      const baseX = centerX + Math.cos(angle) * radius;
      const baseY = centerY + Math.sin(angle) * radius;

      particles.push({
        x: centerX,
        y: centerY,
        baseX,
        baseY,
        vx: 0,
        vy: 0,
        size: Math.random() * 2.5 + 1.5,
        opacity: Math.random() * 0.5 + 0.5,
      });
    }

    let animationFrame: number;
    let startTime = Date.now();
    let lastTime = Date.now();

    // Mouse tracking with velocity
    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX;
      const newY = e.clientY;
      mouseRef.current.vx = (newX - mouseRef.current.x) * 0.5;
      mouseRef.current.vy = (newY - mouseRef.current.y) * 0.5;
      mouseRef.current.x = newX;
      mouseRef.current.y = newY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      const now = Date.now();
      const deltaTime = Math.min((now - lastTime) / 16, 2); // Cap delta for consistent speed
      lastTime = now;

      const elapsed = now - startTime;
      const scatterProgress = Math.min(elapsed / 1500, 1); // Faster: 1.5s instead of 2s

      // Clear with slight trail for smoothness
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const time = elapsed * 0.001;

      particles.forEach((particle, i) => {
        // Scatter animation (faster easing)
        if (scatterProgress < 1) {
          const ease = 1 - Math.pow(1 - scatterProgress, 2); // Faster easing
          particle.x = centerX + (particle.baseX - centerX) * ease;
          particle.y = centerY + (particle.baseY - centerY) * ease;
        } else {
          // Mouse influence - particles react to mouse speed
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const force = (200 - distance) / 200;
            const speed = Math.sqrt(mouseRef.current.vx ** 2 + mouseRef.current.vy ** 2);
            const influence = force * speed * 0.02;

            particle.vx += (dx / distance) * influence;
            particle.vy += (dy / distance) * influence;
          }

          // Apply velocity
          particle.vx *= 0.95; // Damping
          particle.vy *= 0.95;

          // Floating motion + velocity
          particle.x += Math.sin(time + i * 0.5) * 0.3 + particle.vx * deltaTime;
          particle.y += Math.cos(time + i * 0.5) * 0.3 + particle.vy * deltaTime;

          // Boundary bounce
          const margin = 50;
          if (particle.x < margin || particle.x > canvas.width - margin) {
            particle.vx *= -0.5;
            particle.x = Math.max(margin, Math.min(canvas.width - margin, particle.x));
          }
          if (particle.y < margin || particle.y > canvas.height - margin) {
            particle.vy *= -0.5;
            particle.y = Math.max(margin, Math.min(canvas.height - margin, particle.y));
          }

          // Gentle pull back to base position
          const backForce = 0.005;
          particle.vx += (particle.baseX - particle.x) * backForce;
          particle.vy += (particle.baseY - particle.y) * backForce;
        }

        // Draw connections (optimized - only check nearby particles)
        if (scatterProgress >= 1) {
          for (let j = i + 1; j < Math.min(i + 15, particles.length); j++) {
            const other = particles[j];
            const dx = other.x - particle.x;
            const dy = other.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) { // Reduced from 150
              const opacity = (1 - distance / 120) * 0.25;
              ctx.beginPath();
              ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(other.x, other.y);
              ctx.stroke();
            }
          }
        }

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 217, 255, ${particle.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#00d9ff";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Decay mouse velocity
      mouseRef.current.vx *= 0.95;
      mouseRef.current.vy *= 0.95;

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      setCanvasSize();
      // Recalculate base positions
      const newCenterX = canvas.width / 2;
      const newCenterY = canvas.height / 2;
      particles.forEach((particle, i) => {
        const angle = (Math.PI * 2 * i) / particleCount;
        const radius = Math.random() * 250 + 150;
        particle.baseX = newCenterX + Math.cos(angle) * radius;
        particle.baseY = newCenterY + Math.sin(angle) * radius;
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black"
    >
      {/* Full-Screen Neural Network Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: "transform" }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-6 leading-tight"
        >
          <span className="gradient-cyan text-glow">Kushagra Kanaujia</span>
        </motion.h1>

        {/* Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-xl sm:text-2xl md:text-3xl text-white/80 mb-12 space-y-2"
        >
          <p>Computer Science Student</p>
          <p>Software Engineer</p>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex items-center justify-center gap-6 mb-12"
        >
          <a
            href="https://linkedin.com/in/kushagrakanaujia"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/50 rounded-full transition-all duration-300"
          >
            <Linkedin className="w-5 h-5 text-accent" />
            <span className="text-white/80 group-hover:text-white">LinkedIn</span>
          </a>
          <a
            href="https://github.com/KushagraKanaujia"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-accent/50 rounded-full transition-all duration-300"
          >
            <Github className="w-5 h-5 text-accent" />
            <span className="text-white/80 group-hover:text-white">GitHub</span>
          </a>
        </motion.div>

        {/* View Work Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-accent-blue rounded-full text-lg font-semibold text-black hover:shadow-2xl hover:shadow-accent/60 transition-all duration-300 hover:scale-105"
          >
            <span>View My Work</span>
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
