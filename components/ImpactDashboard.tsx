"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface MetricCardProps {
  value: string;
  label: string;
  suffix?: string;
  delay?: number;
}

const MetricCard = ({ value, label, suffix = "", delay = 0 }: MetricCardProps) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const target = parseFloat(value);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="glow-card bg-card border border-card-border rounded-lg p-6 text-center"
    >
      <div className="text-4xl md:text-5xl font-bold mb-2">
        <span className="gradient-text">{Math.round(count * 10) / 10}</span>
        <span className="text-accent">{suffix}</span>
      </div>
      <p className="text-gray-400 text-sm md:text-base">{label}</p>
    </motion.div>
  );
};

const ImpactDashboard = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Impact at Scale</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Building systems that serve millions with reliability
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <MetricCard value="2" label="Monthly API Requests" suffix="M+" delay={0.1} />
          <MetricCard value="99.9" label="Uptime" suffix="%" delay={0.2} />
          <MetricCard value="150" label="Response Time" suffix="ms" delay={0.3} />
          <MetricCard value="500" label="Code Commits" suffix="K+" delay={0.4} />
        </div>

        {/* Progress bars for tech proficiency */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="bg-card border border-card-border rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">
            <span className="gradient-text">Core Competencies</span>
          </h3>
          <div className="space-y-6">
            {[
              { skill: "Machine Learning & AI", level: 95 },
              { skill: "Full-Stack Development", level: 90 },
              { skill: "System Architecture", level: 88 },
              { skill: "Cloud & DevOps", level: 85 },
            ].map((item, index) => (
              <div key={item.skill}>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">{item.skill}</span>
                  <span className="text-accent font-semibold">{item.level}%</span>
                </div>
                <motion.div
                  className="h-2 bg-card-border rounded-full overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent-blue"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${item.level}%` }}
                    transition={{ duration: 1, delay: 0.8 + index * 0.1 }}
                    viewport={{ once: true }}
                  />
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ImpactDashboard;
