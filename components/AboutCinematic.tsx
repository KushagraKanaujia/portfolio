"use client";

import { motion } from "framer-motion";

export default function AboutCinematic() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center bg-black py-20 relative overflow-hidden"
    >
      {/* Content background for visibility */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-4xl min-h-[60vh] bg-black/60 backdrop-blur-sm rounded-3xl border border-white/5" />
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center space-y-6">
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-bold"
            style={{
              fontSize: '2.5rem',
              color: '#FFFFFF',
              textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
              filter: 'brightness(1.2)'
            }}
          >
            About Me
          </motion.h2>

          {/* Subtitle */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="font-bold"
            style={{
              fontSize: '1.8rem',
              lineHeight: '1.4',
              color: '#FFFFFF',
              textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
              filter: 'brightness(1.2)'
            }}
          >
            Backend Engineer &{' '}
            <span style={{ color: '#fb923c' }}>System Architect</span>
          </motion.h3>

          {/* Description paragraphs */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="font-medium"
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: '#FFFFFF',
              textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
              filter: 'brightness(1.2)'
            }}
          >
            Hello! I'm Kushagra, a passionate Computer Science student at UC Santa Barbara with a strong foundation in software engineering, cloud infrastructure, and full-stack development. My journey spans from building scalable web applications to developing intelligent data processing systems and mobile platforms that serve thousands of users.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="font-medium"
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.8',
              color: '#FFFFFF',
              textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
              filter: 'brightness(1.2)'
            }}
          >
            I thrive in challenging environments where I can apply my technical expertise to solve complex problems. Whether it's architecting scalable backend systems, developing machine learning pipelines, or building full-stack applications, I'm driven by the opportunity to create impactful technology that makes a difference. My disciplined approach to engineering ensures robust, maintainable solutions that stand the test of production environments.
          </motion.p>

          {/* Key highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 pt-4 justify-center"
          >
            {['Backend Engineer', 'Full-Stack Dev', 'ML Infrastructure', 'System Design'].map((tag, index) => (
              <span
                key={index}
                className="px-6 py-3 font-bold bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-xl border-2 border-orange-300"
                style={{
                  fontSize: '0.9rem',
                  color: '#FFFFFF',
                  textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                  filter: 'brightness(1.2)'
                }}
              >
                {tag}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
