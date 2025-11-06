"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Packet {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
  speed: number;
  size: number;
  color: string;
}

export default function DataFlowBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const packetsRef = useRef<Packet[]>([]);
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

    // Central hub nodes
    const hubs = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3 },
      { x: canvas.width * 0.5, y: canvas.height * 0.5 },
      { x: canvas.width * 0.8, y: canvas.height * 0.7 },
    ];

    // Colors for different data types
    const colors = [
      "#00d9ff", // Cyan
      "#a855f7", // Purple
      "#f59e0b", // Orange
      "#10b981", // Green
    ];

    // Create initial packets
    const createPacket = (): Packet => {
      const startHub = hubs[Math.floor(Math.random() * hubs.length)];
      const endHub = hubs[Math.floor(Math.random() * hubs.length)];

      return {
        x: startHub.x,
        y: startHub.y,
        targetX: endHub.x,
        targetY: endHub.y,
        progress: 0,
        speed: 0.005 + Math.random() * 0.01,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    // Initialize packets
    for (let i = 0; i < 30; i++) {
      packetsRef.current.push(createPacket());
    }

    // Animation loop
    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw hub nodes
      hubs.forEach((hub) => {
        const gradient = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 20);
        gradient.addColorStop(0, "rgba(0, 217, 255, 0.8)");
        gradient.addColorStop(0.5, "rgba(168, 85, 247, 0.4)");
        gradient.addColorStop(1, "rgba(0, 217, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Hub core
        ctx.fillStyle = "#00d9ff";
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Pulsing ring
        const pulseRadius = 8 + Math.sin(Date.now() / 500) * 4;
        ctx.strokeStyle = "rgba(0, 217, 255, 0.5)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hub.x, hub.y, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Update and draw packets
      packetsRef.current.forEach((packet, index) => {
        packet.progress += packet.speed;

        if (packet.progress >= 1) {
          // Reset packet with new path
          const newPacket = createPacket();
          packetsRef.current[index] = newPacket;
          return;
        }

        // Bezier curve path
        const controlX = (packet.x + packet.targetX) / 2 + (Math.random() - 0.5) * 100;
        const controlY = (packet.y + packet.targetY) / 2 + (Math.random() - 0.5) * 100;

        const t = packet.progress;
        const currentX =
          Math.pow(1 - t, 2) * packet.x +
          2 * (1 - t) * t * controlX +
          Math.pow(t, 2) * packet.targetX;
        const currentY =
          Math.pow(1 - t, 2) * packet.y +
          2 * (1 - t) * t * controlY +
          Math.pow(t, 2) * packet.targetY;

        // Draw trail
        ctx.strokeStyle = `${packet.color}30`;
        ctx.lineWidth = packet.size * 0.5;
        ctx.beginPath();
        ctx.moveTo(packet.x, packet.y);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        // Draw packet with glow
        const gradient = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          packet.size * 3
        );
        gradient.addColorStop(0, packet.color);
        gradient.addColorStop(0.5, `${packet.color}80`);
        gradient.addColorStop(1, `${packet.color}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, packet.size * 3, 0, Math.PI * 2);
        ctx.fill();

        // Packet core
        ctx.fillStyle = packet.color;
        ctx.beginPath();
        ctx.arc(currentX, currentY, packet.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw grid lines between hubs
      ctx.strokeStyle = "rgba(100, 100, 150, 0.1)";
      ctx.lineWidth = 1;
      hubs.forEach((hub1, i) => {
        hubs.forEach((hub2, j) => {
          if (i < j) {
            ctx.beginPath();
            ctx.moveTo(hub1.x, hub1.y);
            ctx.lineTo(hub2.x, hub2.y);
            ctx.stroke();
          }
        });
      });

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
      animate={{ opacity: 0.5 }}
      transition={{ duration: 1 }}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
