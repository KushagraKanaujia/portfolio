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
    <section className="min-h-screen flex items-center bg-black py-20 relative overflow-hidden">
      {/* Content background for visibility */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-7xl min-h-[85vh] bg-black/60 backdrop-blur-sm rounded-3xl border border-white/5" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
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
                  alt={`${title} - ${subtitle}`}
                  fill
                  className="object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  quality={85}
                  priority={false}
                  loading="lazy"
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

            {/* Floating Metrics - Warm and vibrant */}
            <div className="grid grid-cols-3 gap-4 mt-8">
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
                  className="bg-gradient-to-br from-orange-500/80 to-amber-500/80 border-2 border-orange-400 p-6 text-center rounded-xl cursor-pointer group backdrop-blur-sm shadow-xl"
                >
                  <motion.div
                    className="text-3xl md:text-4xl font-black mb-2"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      color: '#FFFFFF',
                      textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                      filter: 'brightness(1.2)'
                    }}
                  >
                    {metric.value}
                  </motion.div>
                  <div
                    className="text-sm md:text-base font-bold group-hover:text-white transition-colors"
                    style={{
                      color: '#FFFFFF',
                      textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                      filter: 'brightness(1.2)'
                    }}
                  >
                    {metric.label}
                  </div>
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
            {/* Project Type - Warmer and more visible */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="font-bold tracking-wider uppercase"
              style={{
                fontSize: '1rem',
                color: '#FFFFFF',
                textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                filter: 'brightness(1.2)'
              }}
            >
              {subtitle}
            </motion.p>

            {/* Title - Much bigger and vibrant */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.4 }}
              whileHover={{ x: 10, transition: { duration: 0.2 } }}
              className="font-bold cursor-pointer"
              style={{
                fontSize: '2.5rem',
                color: '#FFFFFF',
                textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                filter: 'brightness(1.2)'
              }}
            >
              {title}
            </motion.h2>

            {/* Description - Warm white and clearly visible */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="leading-relaxed font-medium"
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#FFFFFF',
                textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                filter: 'brightness(1.2)'
              }}
            >
              {description}
            </motion.p>

            {/* Tech Stack - Warmer and vibrant */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.3 }}
              className="flex flex-wrap gap-3"
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
                    boxShadow: "0 8px 30px rgba(251, 146, 60, 0.4)",
                    transition: { duration: 0.2 }
                  }}
                  className="px-6 py-3 font-bold bg-gradient-to-r from-orange-500 to-amber-500 rounded-full cursor-pointer shadow-xl border-2 border-orange-300"
                  style={{
                    fontSize: '0.9rem',
                    color: '#FFFFFF',
                    textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                    filter: 'brightness(1.2)'
                  }}
                >
                  {item}
                </motion.span>
              ))}
            </motion.div>

            {/* Action Buttons - Warm and vibrant */}
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
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${title} source code on GitHub`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 font-bold rounded-lg flex items-center gap-2 group shadow-lg hover:shadow-orange-500/50"
                  style={{
                    color: '#FFFFFF',
                    textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                    filter: 'brightness(1.2)'
                  }}
                >
                  <Github className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" aria-hidden="true" />
                  View Code
                </motion.a>
              )}
              {live && (
                <motion.a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${title} live demo`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 font-bold rounded-lg flex items-center gap-2 group shadow-lg hover:shadow-amber-500/50"
                  style={{
                    color: '#FFFFFF',
                    textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                    filter: 'brightness(1.2)'
                  }}
                >
                  <ExternalLink className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" aria-hidden="true" />
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
