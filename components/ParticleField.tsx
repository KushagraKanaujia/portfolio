"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
}

const ParticleField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      // Create particles on mouse trail
      if (Math.random() > 0.7) {
        particlesRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          size: Math.random() * 3 + 1,
          opacity: 1,
          life: 1,
        });
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Create ambient particles
    const createAmbientParticles = () => {
      for (let i = 0; i < 5; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.5,
          life: 1,
        });
      }
    };

    // Initial ambient particles
    for (let i = 0; i < 50; i++) {
      createAmbientParticles();
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add new ambient particles occasionally
      if (Math.random() > 0.97) {
        createAmbientParticles();
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.05; // Slight gravity
        particle.life -= 0.01;
        particle.opacity = particle.life;

        // Draw particle
        if (particle.life > 0) {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

          // Gradient for glow effect
          const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size * 2
          );
          gradient.addColorStop(0, `rgba(0, 217, 255, ${particle.opacity})`);
          gradient.addColorStop(0.5, `rgba(0, 217, 255, ${particle.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(0, 217, 255, 0)`);

          ctx.fillStyle = gradient;
          ctx.fill();

          return true;
        }
        return false;
      });

      // Keep particle count reasonable
      if (particlesRef.current.length > 200) {
        particlesRef.current = particlesRef.current.slice(-200);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default ParticleField;
