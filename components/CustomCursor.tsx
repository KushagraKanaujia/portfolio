"use client";

import { useEffect, useState, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const particles = useRef<Particle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over interactive element
      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
          target.tagName === "A" ||
          target.tagName === "BUTTON"
      );

      // Add particle
      if (particles.current.length < 20) {
        particles.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          life: 1,
        });
      }
    };

    const handleMouseEnter = () => setIsHidden(false);
    const handleMouseLeave = () => setIsHidden(true);

    document.addEventListener("mousemove", updateCursor);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", updateCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 217, 255, ${p.life})`;
          ctx.fill();
          return true;
        }
        return false;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, []);

  // Magnetic effect for buttons
  useEffect(() => {
    const buttons = document.querySelectorAll("button, a");

    const handleButtonHover = (e: Event) => {
      const button = e.currentTarget as HTMLElement;
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = position.x - centerX;
      const distY = position.y - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        const offsetX = -distX * force * 0.3;
        const offsetY = -distY * force * 0.3;
        button.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      }
    };

    const handleButtonLeave = (e: Event) => {
      const button = e.currentTarget as HTMLElement;
      button.style.transform = "";
    };

    buttons.forEach((button) => {
      button.addEventListener("mouseenter", handleButtonHover);
      button.addEventListener("mouseleave", handleButtonLeave);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("mouseenter", handleButtonHover);
        button.removeEventListener("mouseleave", handleButtonLeave);
      });
    };
  }, [position]);

  return (
    <>
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998]"
      />

      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className={`pointer-events-none fixed z-[9999] mix-blend-difference transition-transform duration-100 ${
          isHidden ? "opacity-0" : "opacity-100"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
        }}
      >
        {/* Outer ring */}
        <div className="h-10 w-10 rounded-full border-2 border-accent animate-pulse" />

        {/* Inner dot */}
        <div
          className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
          style={{
            transform: `translate(-50%, -50%) scale(${
              isPointer ? 0 : 1
            })`,
          }}
        />
      </div>
    </>
  );
}
