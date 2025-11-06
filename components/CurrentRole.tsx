"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { MapPin, GraduationCap, Briefcase, TrendingUp, Sparkles } from "lucide-react";
import { useRef } from "react";
import MatrixRain from "./MatrixRain";

const CurrentRole = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const rotateY = useSpring(mouseX, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mouseX.set(x * 10);
    mouseY.set(-y * 10);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="experience" className="min-h-screen flex items-center bg-gradient-to-b from-black via-neutral-950 to-black py-20 relative overflow-hidden">
      {/* Matrix Rain Background */}
      <MatrixRain />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/60 to-black pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto text-center px-4 relative z-10">
        {/* Section Title - Fast */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-4 bg-accent/10 border border-accent/20 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <p className="text-accent text-sm font-medium tracking-wider uppercase">
              Currently Building
            </p>
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-bold gradient-text-apple">
            Shaping the Future of AI
          </h2>
        </motion.div>

        {/* Floating 3D Card with Magnetic Effect */}
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.5,
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative max-w-3xl mx-auto perspective-1000 cursor-pointer"
        >
          {/* Animated Glow Effect */}
          <motion.div
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-accent/30 via-accent-blue/30 to-purple-500/30 blur-3xl rounded-3xl"
          />

          {/* Card */}
          <div className="relative glass-card p-8 md:p-12 group hover:border-accent/30 transition-all duration-300">
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-accent/40 rounded-full"
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>

            {/* Icon - Bounce on hover */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 20,
                delay: 0.2
              }}
              whileHover={{
                scale: 1.1,
                rotate: 360,
                transition: { duration: 0.6 }
              }}
              className="w-20 h-20 md:w-28 md:h-28 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent to-accent-blue flex items-center justify-center glow-cyan cursor-pointer"
            >
              <Briefcase className="w-10 h-10 md:w-14 md:h-14 text-black" />
            </motion.div>

            {/* Role - Fast entrance */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="text-2xl md:text-4xl font-bold text-white mb-2"
            >
              ML Research Intern
            </motion.h3>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="text-xl md:text-2xl text-accent font-semibold mb-6 inline-flex items-center gap-2"
            >
              @ Visual Layer
              <TrendingUp className="w-5 h-5 animate-bounce" />
            </motion.p>

            {/* Description - Quick reveal */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Building ML observability tools for production model monitoring.
              Optimizing computer vision pipelines and developing data quality
              frameworks for enterprise-scale ML systems.
            </motion.p>

            {/* Info Tags - Snappy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:border-accent/30 transition-colors cursor-pointer"
              >
                <GraduationCap className="w-5 h-5 text-accent" />
                <span className="text-sm text-gray-300">UC Santa Barbara '26</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 hover:border-accent/30 transition-colors cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-accent" />
                <span className="text-sm text-gray-300">Santa Barbara, CA</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Tech Stack Tags - Fast stagger */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.3 }}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          {["Python", "PyTorch", "FastAPI", "React", "PostgreSQL", "AWS"].map(
            (tech, index) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.5 + index * 0.04,
                  duration: 0.2,
                  type: "spring",
                  stiffness: 500
                }}
                whileHover={{
                  scale: 1.15,
                  y: -4,
                  boxShadow: "0 8px 30px rgba(0, 217, 255, 0.3)",
                  transition: { duration: 0.2 }
                }}
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-accent/10 to-accent-blue/10 border border-accent/20 rounded-full text-accent cursor-pointer hover:border-accent/40 transition-colors"
              >
                {tech}
              </motion.span>
            )
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CurrentRole;
