"use client";

import { motion } from "framer-motion";
import { User, Briefcase, Code, Mail, Sparkles } from "lucide-react";

const sections = [
  { id: "home", label: "Home", icon: Sparkles },
  { id: "about", label: "About", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "skills", label: "Skills", icon: Code },
  { id: "contact", label: "Contact", icon: Mail },
];

export default function QuickNav() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed top-24 right-6 z-40 hidden lg:block"
    >
      <div className="glass-card px-6 py-3 rounded-full border border-white/10">
        <div className="flex items-center gap-1">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.6 + index * 0.05,
                  duration: 0.2,
                  type: "spring",
                  stiffness: 400,
                }}
                whileHover={{
                  scale: 1.1,
                  y: -2,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center gap-2 px-4 py-2 rounded-full hover:bg-accent/10 transition-all duration-200"
              >
                <Icon className="w-4 h-4 text-accent/70 group-hover:text-accent transition-colors" />
                <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                  {section.label}
                </span>

                {/* Hover indicator */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-accent/0 group-hover:border-accent/30"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="text-center mt-2"
      >
        <p className="text-xs text-gray-600">Quick Navigation</p>
      </motion.div>
    </motion.div>
  );
}
