"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Zap } from "lucide-react";
import DataFlowBackground from "./DataFlowBackground";

interface Metric {
  value: string;
  number: number;
  suffix: string;
  label: string;
  description: string;
  color: string;
  icon: string;
}

const MetricsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: false,
  });

  const metrics: Metric[] = [
    {
      value: "3",
      number: 3,
      suffix: "",
      label: "SWE Internships",
      description: "Backend & Infrastructure roles at production startups, building scalable systems from the ground up",
      color: "from-cyan-400 to-blue-500",
      icon: "💼",
    },
    {
      value: "2M+",
      number: 2,
      suffix: "M+",
      label: "Monthly API Traffic",
      description: "Engineered backend systems serving millions of requests with 99.9% uptime and sub-200ms latency",
      color: "from-green-400 to-emerald-500",
      icon: "🚀",
    },
    {
      value: "40%",
      number: 40,
      suffix: "%",
      label: "Performance Optimizations",
      description: "Reduced P95 latency through PostgreSQL query optimization and intelligent Redis caching strategies",
      color: "from-orange-400 to-red-500",
      icon: "⚡",
    },
    {
      value: "1K+",
      number: 1000,
      suffix: "+",
      label: "Real Users Impacted",
      description: "Built mobile platforms and backend systems that directly improve user experiences at scale",
      color: "from-purple-400 to-pink-500",
      icon: "👥",
    },
    {
      value: "10M+",
      number: 10,
      suffix: "M+",
      label: "Data Pipeline Processing",
      description: "Architected ML infrastructure handling massive datasets with automated cloud orchestration",
      color: "from-blue-400 to-cyan-500",
      icon: "📊",
    },
  ];

  // Faster auto-advance (2s instead of 4s)
  useEffect(() => {
    if (!inView) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % metrics.length);
    }, 2500); // Faster!

    return () => clearInterval(interval);
  }, [inView, metrics.length]);

  const currentMetric = metrics[currentIndex];

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center bg-gradient-to-b from-black via-neutral-950 to-black py-20 relative overflow-hidden"
    >
      {/* Animated Data Flow Background */}
      <DataFlowBackground />

      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black pointer-events-none" />

      <div className="w-full max-w-5xl mx-auto text-center px-4 relative z-10">
        {/* Heading - Fast entrance */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.1 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Zap className="w-6 h-6 text-accent animate-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold gradient-text-apple">
              Impact at Scale
            </h2>
            <Zap className="w-6 h-6 text-accent animate-pulse" />
          </motion.div>
        </motion.div>

        {/* Main Metric Display - Faster transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9, rotateX: 45 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateX: -45 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-12"
          >
            {/* Icon Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
              className="text-6xl mb-6"
            >
              {currentMetric.icon}
            </motion.div>

            {/* Big Number - Snappy */}
            <div className="mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className={`big-number text-glow bg-gradient-to-r ${currentMetric.color} bg-clip-text text-transparent`}
              >
                {inView && (
                  <CountUp
                    end={currentMetric.number}
                    duration={1.5} // Faster count
                    decimals={currentMetric.suffix === "%" && currentMetric.number < 100 ? 1 : 0}
                    suffix={currentMetric.suffix}
                    separator=","
                  />
                )}
              </motion.div>
            </div>

            {/* Label - Quick */}
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="text-2xl md:text-4xl font-semibold text-white mb-4"
            >
              {currentMetric.label}
            </motion.h3>

            {/* Description - Fast reveal */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
            >
              {currentMetric.description}
            </motion.p>

            {/* Progress Bar - 2.5s to match interval */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0 }}
              transition={{ duration: 2.5, ease: "linear" }}
              className={`h-1 bg-gradient-to-r ${currentMetric.color} rounded-full max-w-md mx-auto mt-12`}
              style={{ transformOrigin: "left" }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Pagination Dots - Interactive */}
        <div className="flex justify-center gap-3 mt-16">
          {metrics.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentIndex(index)}
              whileHover={{ scale: 1.2, y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`transition-all duration-300 rounded-full ${
                index === currentIndex
                  ? "w-12 h-3 bg-gradient-to-r from-accent to-accent-blue shadow-lg shadow-accent/50"
                  : "w-3 h-3 bg-gray-700 hover:bg-accent/50"
              }`}
              aria-label={`Go to metric ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Hint - Subtle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm text-gray-600 mt-8"
        >
          Auto-advancing every 2.5s • Click dots to navigate
        </motion.p>
      </div>
    </section>
  );
};

export default MetricsCarousel;
