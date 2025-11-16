"use client";

import { motion } from "framer-motion";

const CurrentRole = () => {
  return (
    <section id="experience" className="min-h-screen flex items-center bg-gradient-to-b from-black via-neutral-950 to-black py-20 relative overflow-hidden">
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/60 to-black pointer-events-none" />

      {/* Content background for visibility */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-6xl min-h-[80vh] bg-black/70 backdrop-blur-md rounded-3xl border border-white/10" />
      </div>

      <div className="w-full px-4 relative z-10 flex justify-center">
        <div className="max-w-5xl">
          {/* Section Title - BRIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="mb-24 text-center"
          >
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-bold mb-8 tracking-wider uppercase"
              style={{
                fontSize: '1rem',
                color: '#FFFFFF',
                textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                filter: 'brightness(1.2)'
              }}
            >
              Current Experience
            </motion.p>
            <h2 className="font-bold" style={{
              fontSize: '2.5rem',
              color: '#FFFFFF',
              textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
              filter: 'brightness(1.2)'
            }}>
              What I'm Building
            </h2>
          </motion.div>

          {/* Content - Center Aligned */}
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="space-y-10"
            >
              {/* Role Title - BRIGHT */}
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="font-bold mb-12"
                style={{
                  fontSize: '1.8rem',
                  lineHeight: '1.4',
                  color: '#FFFFFF',
                  textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                  filter: 'brightness(1.2)'
                }}
              >
                Full-Stack Developer
                <br />
                <span style={{ color: '#fb923c' }}>@ ReceiptBank</span>
              </motion.h3>

              {/* Description - BRIGHT WHITE */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mb-12 font-medium"
                style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.8',
                  color: '#FFFFFF',
                  textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                  filter: 'brightness(1.2)'
                }}
              >
                Building intelligent receipt management and expense tracking platform with OCR technology for automated data extraction. Implementing mobile-first React Native application with real-time receipt scanning, categorization, and financial analytics. Developing RESTful APIs with Node.js and PostgreSQL for seamless expense reporting and integration with accounting software.
              </motion.p>

              {/* Tech Tags - WARM COLORS */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="flex flex-wrap gap-4 pt-6 justify-center"
              >
                {["React Native", "Node.js", "PostgreSQL", "OCR", "REST APIs", "TypeScript"].map(
                  (tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{
                        delay: 0.5 + index * 0.05,
                        duration: 0.3,
                      }}
                      className="px-7 py-4 font-bold bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-lg"
                      style={{
                        fontSize: '0.9rem',
                        color: '#FFFFFF',
                        textShadow: '0 0 25px rgba(255,255,255,0.8), 0 0 15px rgba(255,255,255,0.5)',
                        filter: 'brightness(1.2)'
                      }}
                    >
                      {tech}
                    </motion.span>
                  )
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CurrentRole;
