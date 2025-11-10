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

    // Enhanced particle system - more evenly distributed
    const particles: Array<{
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      glow: number;
    }> = [];

    const particleCount = 100; // Increased for better coverage
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Create particles across entire screen for better visual coverage
    for (let i = 0; i < particleCount; i++) {
      const baseX = Math.random() * canvas.width;
      const baseY = Math.random() * canvas.height;

      particles.push({
        x: baseX,
        y: baseY,
        baseX,
        baseY,
        vx: 0,
        vy: 0,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.6 + 0.4,
        glow: 0,
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
      const deltaTime = Math.min((now - lastTime) / 16, 2);
      lastTime = now;

      const time = (now - startTime) * 0.001;

      // Clear with darker trail for cleaner look
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        // Mouse influence - enlarge and glow particles near cursor (like Suhrit's)
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Enhanced mouse responsiveness
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.glow = force;

          // Slight attraction to cursor
          particle.vx += (dx / distance) * force * 0.5;
          particle.vy += (dy / distance) * force * 0.5;
        } else {
          particle.glow *= 0.95; // Fade out glow
        }

        // Apply velocity with damping
        particle.vx *= 0.92;
        particle.vy *= 0.92;

        // Gentle floating motion
        particle.x += Math.sin(time + i * 0.3) * 0.2 + particle.vx * deltaTime;
        particle.y += Math.cos(time + i * 0.4) * 0.2 + particle.vy * deltaTime;

        // Soft boundary constraints
        const margin = 20;
        if (particle.x < margin) particle.x = margin;
        if (particle.x > canvas.width - margin) particle.x = canvas.width - margin;
        if (particle.y < margin) particle.y = margin;
        if (particle.y > canvas.height - margin) particle.y = canvas.height - margin;

        // Gentle pull back to base position
        const backForce = 0.002;
        particle.vx += (particle.baseX - particle.x) * backForce;
        particle.vy += (particle.baseY - particle.y) * backForce;

        // Draw connections with cleaner appearance
        particles.forEach((other, j) => {
          if (i >= j) return;
          const dx = other.x - particle.x;
          const dy = other.y - particle.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const opacity = (1 - dist / 150) * 0.2;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 217, 255, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();

            // Pulsing energy along connections
            if (Math.random() < 0.005) {
              const pulseX = particle.x + dx * Math.random();
              const pulseY = particle.y + dy * Math.random();
              ctx.beginPath();
              ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(0, 217, 255, ${opacity * 3})`;
              ctx.fill();
            }
          }
        });

        // Draw particle with enhanced glow effect
        const glowSize = particle.size * (1 + particle.glow * 2);
        const glowOpacity = particle.opacity * (1 + particle.glow * 0.5);

        // Outer glow
        if (particle.glow > 0.1) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, glowSize * 3, 0, Math.PI * 2);
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, glowSize * 3
          );
          gradient.addColorStop(0, `rgba(0, 217, 255, ${particle.glow * 0.3})`);
          gradient.addColorStop(1, "rgba(0, 217, 255, 0)");
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        // Core particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 217, 255, ${glowOpacity})`;
        ctx.shadowBlur = 15 * (1 + particle.glow);
        ctx.shadowColor = "#00d9ff";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      setCanvasSize();
      // Recalculate base positions across entire screen
      particles.forEach((particle) => {
        particle.baseX = Math.random() * canvas.width;
        particle.baseY = Math.random() * canvas.height;
        particle.x = particle.baseX;
        particle.y = particle.baseY;
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

      {/* Dark Gradient Overlay - cleaner and more subtle */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-7xl">
        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-bold tracking-tight mb-8 leading-tight"
        >
          <span className="gradient-cyan text-glow">Kushagra Kanaujia</span>
        </motion.h1>

        {/* Roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/80 mb-12 space-y-3"
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
