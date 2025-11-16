"use client";

import { motion } from "framer-motion";

interface Experience {
  date: string;
  role: string;
  company: string;
  description: string;
}

const experiences: Experience[] = [
  {
    date: "Jun 2024 - Present",
    role: "Backend Software Engineer",
    company: "Dawdle",
    description: "Architected full-stack mobile platform serving 1,000+ users. Built scalable microservices backend with Node.js/Express, Redis caching, and PostgreSQL optimization. Shipped 12+ A/B tested features driving 18% DAU increase and 25% retention boost.",
  },
  {
    date: "Jan 2024 - Jun 2024",
    role: "Backend Software Engineer",
    company: "Smartshore",
    description: "Scaled RESTful APIs to 2M+ monthly requests at 99.9% uptime. Reduced P95 latency 40% through PostgreSQL query optimization and Redis caching architecture. Built comprehensive Grafana observability dashboards for production monitoring.",
  },
  {
    date: "Sep 2023 - Jan 2024",
    role: "Platform Software Engineer",
    company: "Visual Layer",
    description: "Engineered ML infrastructure platform automating distributed training on AWS/Azure multi-GPU clusters. Built scalable data pipelines processing 10M+ images from ImageNet/COCO. Automated cloud resource orchestration reducing idle compute costs 40%.",
  },
];

export default function WorkExperience() {
  return (
    <section
      id="experience"
      className="min-h-screen flex items-center bg-black py-20 relative overflow-hidden scroll-mt-20"
    >
      {/* Content background for visibility */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-5xl min-h-[80vh] bg-black/60 backdrop-blur-sm rounded-3xl border border-white/5" />
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 relative z-10">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-bold text-center mb-16"
          style={{
            fontSize: '2.5rem',
            color: '#FFFFFF',
            textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
            filter: 'brightness(1.2)'
          }}
        >
          Work Experience
        </motion.h2>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-500 to-cyan-400 transform md:-translate-x-1/2" />

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Timeline Dot */}
                <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-cyan-400 rounded-full border-4 border-black transform md:-translate-x-1/2 shadow-lg shadow-cyan-400/50" />

                {/* Content Card */}
                <div className={`ml-8 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'} md:w-1/2`}>
                  {/* Date Badge */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.2 + 0.2 }}
                    className="inline-block px-4 py-2 bg-cyan-400 rounded-full mb-4"
                  >
                    <span
                      className="font-bold"
                      style={{
                        fontSize: '0.9rem',
                        color: '#000000',
                      }}
                    >
                      {exp.date}
                    </span>
                  </motion.div>

                  {/* Role Title */}
                  <motion.h3
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                    className="font-bold mb-2"
                    style={{
                      fontSize: '1.3rem',
                      color: '#FFFFFF',
                      textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                      filter: 'brightness(1.2)'
                    }}
                  >
                    {exp.role}
                  </motion.h3>

                  {/* Company Name */}
                  <motion.h4
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.4 }}
                    className="font-semibold mb-3"
                    style={{
                      fontSize: '1rem',
                      color: '#fb923c',
                      textShadow: '0 0 15px rgba(251,146,60,0.6)',
                    }}
                  >
                    {exp.company}
                  </motion.h4>

                  {/* Description */}
                  <motion.p
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                    className="font-medium"
                    style={{
                      fontSize: '1rem',
                      lineHeight: '1.7',
                      color: '#FFFFFF',
                      textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                      filter: 'brightness(1.2)'
                    }}
                  >
                    {exp.description}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
