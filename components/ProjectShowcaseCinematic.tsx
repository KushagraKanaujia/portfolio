"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, Github, Zap } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

interface ProjectShowcaseProps {
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string; value: string }[];
  tech: string[];
  image: string;
  github?: string;
  live?: string;
  gradient: string;
  reverse?: boolean;
}

const ProjectShowcaseCinematic = ({
  title,
  subtitle,
  description,
  metrics,
  tech,
  image,
  github,
  live,
  gradient,
  reverse = false,
}: ProjectShowcaseProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Magnetic hover effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <section className="min-h-screen flex items-center bg-gradient-to-b from-black via-neutral-950 to-black py-20">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? "md:flex-row-reverse" : ""}`}>
          {/* Image / Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`relative ${reverse ? "md:order-2" : ""}`}
          >
            <motion.div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-pointer"
            >
              {/* Dynamic Glow Background */}
              <motion.div
                animate={{
                  opacity: isHovered ? 0.5 : 0.3,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
                className={`absolute -inset-4 bg-gradient-to-br ${gradient} blur-3xl`}
              />

              {/* Image Container */}
              <div className="relative w-full h-full glass-card overflow-hidden group">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                />
                {/* Animated Overlay */}
                <motion.div
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 0.4 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
                />

                {/* Hover Indicator */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-4 right-4 bg-accent/90 backdrop-blur-sm rounded-full p-3"
                >
                  <Zap className="w-6 h-6 text-black" />
                </motion.div>
              </div>
            </motion.div>

            {/* Floating Metrics - Fast entrance */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {metrics.map((metric, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.1 + index * 0.05,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 400,
                    damping: 25
                  }}
                  whileHover={{
                    y: -8,
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                  className="glass-card p-4 text-center rounded-xl cursor-pointer group"
                >
                  <motion.div
                    className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent mb-1`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {metric.value}
                  </motion.div>
                  <div className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: reverse ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`space-y-6 ${reverse ? "md:order-1" : ""}`}
          >
            {/* Project Type - Faster */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className={`text-sm md:text-base font-medium tracking-wider uppercase bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
            >
              {subtitle}
            </motion.p>

            {/* Title - Magnetic effect */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.4 }}
              whileHover={{ x: 10, transition: { duration: 0.2 } }}
              className="text-4xl md:text-6xl font-bold gradient-text-apple cursor-pointer"
            >
              {title}
            </motion.h2>

            {/* Description - Fast fade */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-base md:text-lg text-gray-400 leading-relaxed"
            >
              {description}
            </motion.p>

            {/* Tech Stack - Stagger fast */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {tech.map((item, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + index * 0.03,
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
                  className="px-4 py-2 text-sm font-medium glass-card rounded-full text-accent cursor-pointer"
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>

            {/* Action Buttons - Snappy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35, duration: 0.3 }}
              className="flex gap-4"
            >
              {github && (
                <motion.a
                  href={github}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="btn-apple flex items-center gap-2 group"
                >
                  <Github className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  View Code
                </motion.a>
              )}
              {live && (
                <motion.a
                  href={live}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="btn-apple-primary flex items-center gap-2 group"
                >
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
                  Live Demo
                </motion.a>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProjectShowcaseCinematic;
