"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Programming Languages with actual icon URLs
const programmingLanguages = [
  { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", color: "#3776ab" },
  { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", color: "#f7df1e" },
  { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", color: "#3178c6" },
  { name: "Java", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", color: "#007396" },
  { name: "Swift", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg", color: "#fa7343" },
  { name: "C++", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg", color: "#00599c" },
  { name: "SQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", color: "#4479a1" },
  { name: "HTML/CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", color: "#e44d26" },
];

// Technologies with actual icon URLs
const technologies = [
  { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", color: "#61dafb" },
  { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-line.svg", color: "#FFFFFF" },
  { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", color: "#339933" },
  { name: "Tailwind CSS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", color: "#06b6d4" },
  { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", color: "#ff9900" },
  { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", color: "#2496ed" },
  { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", color: "#336791" },
  { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", color: "#47a248" },
  { name: "Redis", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg", color: "#dc382d" },
  { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original-wordmark.svg", color: "#FFFFFF" },
  { name: "FastAPI", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg", color: "#009688" },
  { name: "TensorFlow", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg", color: "#ff6f00" },
  { name: "PyTorch", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg", color: "#ee4c2c" },
  { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original-wordmark.svg", color: "#FFFFFF" },
  { name: "Grafana", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg", color: "#f46800" },
  { name: "Firebase", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", color: "#ffca28" },
];

export default function SkillsWithLogos() {
  return (
    <section
      id="skills"
      className="py-16 relative overflow-hidden bg-black"
    >
      {/* Content background for visibility */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-5xl min-h-[80%] bg-black/60 backdrop-blur-sm rounded-3xl border border-white/5" />
      </div>

      <div className="w-full max-w-5xl mx-auto px-4 relative z-10">
        {/* Programming Languages Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Section Title - Smaller and cleaner */}
          <div className="text-center mb-8">
            <h2 className="font-bold mb-3 tracking-tight" style={{
              fontSize: '1.5rem',
              color: '#FFFFFF',
              textShadow: '0 0 20px rgba(255,255,255,0.6)',
              filter: 'brightness(1.1)'
            }}>
              Programming Languages
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto rounded-full" />
          </div>

          {/* Grid Layout - Compact 8 items per row */}
          <div className="grid grid-cols-8 gap-3">
            {programmingLanguages.map((lang, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03,
                }}
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.2 },
                }}
                className="rounded-md p-2 text-center cursor-pointer transition-all duration-200 border border-white/5 hover:border-white/10 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm hover:shadow-md"
              >
                {/* Icon - Small and clean (14px) */}
                <div className="w-3.5 h-3.5 mb-1.5 mx-auto flex items-center justify-center">
                  <Image
                    src={lang.icon}
                    alt={lang.name}
                    width={14}
                    height={14}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>

                {/* Name - Clean and readable */}
                <h3 className="font-medium tracking-tight text-[10px] leading-tight" style={{
                  color: '#FFFFFF',
                  textShadow: '0 0 10px rgba(255,255,255,0.4)',
                  filter: 'brightness(1.05)'
                }}>
                  {lang.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technologies Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Section Title - Smaller and cleaner */}
          <div className="text-center mb-8">
            <h2 className="font-bold mb-3 tracking-tight" style={{
              fontSize: '1.5rem',
              color: '#FFFFFF',
              textShadow: '0 0 20px rgba(255,255,255,0.6)',
              filter: 'brightness(1.1)'
            }}>
              Technologies
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent mx-auto rounded-full" />
          </div>

          {/* Grid Layout - Compact 8 items per row */}
          <div className="grid grid-cols-8 gap-3">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03,
                }}
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.2 },
                }}
                className="rounded-md p-2 text-center cursor-pointer transition-all duration-200 border border-white/5 hover:border-white/10 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm hover:shadow-md"
              >
                {/* Icon - Small and clean (14px) */}
                <div className="w-3.5 h-3.5 mb-1.5 mx-auto flex items-center justify-center">
                  <Image
                    src={tech.icon}
                    alt={tech.name}
                    width={14}
                    height={14}
                    className="w-full h-full object-contain"
                    unoptimized
                  />
                </div>

                {/* Name - Clean and readable */}
                <h3 className="font-medium tracking-tight text-[10px] leading-tight" style={{
                  color: '#FFFFFF',
                  textShadow: '0 0 10px rgba(255,255,255,0.4)',
                  filter: 'brightness(1.05)'
                }}>
                  {tech.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
