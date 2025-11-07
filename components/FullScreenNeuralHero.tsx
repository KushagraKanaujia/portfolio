"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { TypeAnimation } from "react-type-animation";
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
      <div className="relative z-10 text-center px-6 max-w-5xl">
        {/* Name with Fast Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight"
        >
          KUSHAGRA{" "}
          <span className="gradient-cyan text-glow block sm:inline">KANAUJIA</span>
        </motion.h1>

        {/* Role One-Liner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white/90 mb-8 sm:mb-10 font-light px-4"
        >
          <TypeAnimation
            sequence={[
              "Building Intelligent Systems",
              2000,
              "ML Engineer & Full-Stack Developer",
              2000,
              "Turning Ideas Into Reality",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
            cursor={true}
          />
        </motion.div>

        {/* Quick Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-16 max-w-3xl mx-auto mb-12"
        >
          <MetricCard number="2M+" label="Monthly Requests" delay={1.1} />
          <MetricCard number="99.9%" label="System Uptime" delay={1.2} />
          <MetricCard number="10+" label="Production Apps" delay={1.3} />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-blue px-10 py-5 text-lg font-bold text-black hover:shadow-2xl hover:shadow-accent/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all duration-300 hover:scale-110"
          >
            Explore My Work
            <ChevronDown className="ml-2 h-6 w-6 group-hover:translate-y-1 transition-transform" />
          </a>
        </motion.div>

        {/* Intent Line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.7 }}
          className="mt-10 text-base sm:text-lg text-white/70 max-w-2xl mx-auto"
        >
          UC Santa Barbara '26 • ML Research Intern @ Visual Layer
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-sm text-accent/70 font-medium">Scroll to Explore</span>
          <ChevronDown className="w-6 h-6 text-accent/70" />
        </div>
      </motion.div>
    </section>
  );
}

function MetricCard({ number, label, delay }: { number: string; label: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, type: "spring", stiffness: 400 }}
      className="text-center py-4 sm:py-0"
    >
      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold gradient-cyan mb-1 sm:mb-2 text-glow">
        {number}
      </div>
      <div className="text-xs sm:text-sm text-white/70 uppercase tracking-wider whitespace-nowrap">
        {label}
      </div>
    </motion.div>
  );
}
