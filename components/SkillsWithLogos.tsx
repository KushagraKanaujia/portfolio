"use client";

import { motion } from "framer-motion";

// Programming Languages
const programmingLanguages = [
  { name: "Python", icon: "🐍", color: "#3776ab" },
  { name: "JavaScript", icon: "⚡", color: "#f7df1e" },
  { name: "TypeScript", icon: "📘", color: "#3178c6" },
  { name: "Java", icon: "☕", color: "#007396" },
  { name: "Swift", icon: "🦅", color: "#fa7343" },
  { name: "C/C++", icon: "⚙️", color: "#00599c" },
  { name: "SQL", icon: "🗄️", color: "#f29111" },
  { name: "HTML/CSS", icon: "🎨", color: "#e44d26" },
];

// Technologies
const technologies = [
  { name: "React", icon: "⚛️", color: "#61dafb" },
  { name: "Next.js", icon: "▲", color: "#ffffff" },
  { name: "Node.js", icon: "🟢", color: "#339933" },
  { name: "Tailwind CSS", icon: "🎨", color: "#06b6d4" },
  { name: "AWS", icon: "☁️", color: "#ff9900" },
  { name: "Docker", icon: "🐳", color: "#2496ed" },
  { name: "PostgreSQL", icon: "🐘", color: "#336791" },
  { name: "MongoDB", icon: "🍃", color: "#47a248" },
  { name: "Redis", icon: "💎", color: "#dc382d" },
  { name: "Flask", icon: "🌶️", color: "#000000" },
  { name: "FastAPI", icon: "⚡", color: "#009688" },
  { name: "TensorFlow", icon: "🧠", color: "#ff6f00" },
  { name: "PyTorch", icon: "🔥", color: "#ee4c2c" },
  { name: "GitHub Actions", icon: "🔄", color: "#2088ff" },
  { name: "Grafana", icon: "📊", color: "#f46800" },
  { name: "Firebase", icon: "🔥", color: "#ffca28" },
  { name: "Express", icon: "🚂", color: "#000000" },
];

export default function SkillsWithLogos() {
  return (
    <section
      id="skills"
      style={{ backgroundColor: "#0a0a0a" }}
      className="py-24 relative overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
        {/* Programming Languages Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          {/* Section Title with Cyan Underline */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
              Programming Languages
            </h2>
            <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full" />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {programmingLanguages.map((lang, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.08,
                  y: -10,
                  boxShadow: `0 20px 60px ${lang.color}60`,
                  transition: { duration: 0.3 },
                }}
                style={{
                  backgroundColor: "#1a1a1a",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
                className="rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 border-2 border-gray-800 hover:border-cyan-400 backdrop-blur-sm"
              >
                {/* Icon */}
                <motion.div
                  className="text-8xl mb-6 drop-shadow-2xl"
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  {lang.icon}
                </motion.div>

                {/* Name */}
                <h3 className="text-lg font-bold text-white tracking-wide">
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
          {/* Section Title with Cyan Underline */}
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
              Technologies
            </h2>
            <div className="w-40 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto rounded-full" />
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.08,
                  y: -10,
                  boxShadow: `0 20px 60px ${tech.color}60`,
                  transition: { duration: 0.3 },
                }}
                style={{
                  backgroundColor: "#1a1a1a",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
                className="rounded-3xl p-8 text-center cursor-pointer transition-all duration-300 border-2 border-gray-800 hover:border-cyan-400 backdrop-blur-sm"
              >
                {/* Icon */}
                <motion.div
                  className="text-8xl mb-6 drop-shadow-2xl"
                  whileHover={{ rotate: 360, scale: 1.15 }}
                  transition={{ duration: 0.6, type: "spring" }}
                >
                  {tech.icon}
                </motion.div>

                {/* Name */}
                <h3 className="text-lg font-bold text-white tracking-wide">
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
