"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Command, Gamepad2 } from "lucide-react";

const SECTIONS = ["home", "about", "experience", "skills", "projects", "contact"];

interface NavigationBarProps {
  onOpenCommand: () => void;
  onOpenGame: () => void;
}

export default function NavigationBar({ onOpenCommand, onOpenGame }: NavigationBarProps) {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Scrollspy
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0.01,
      }
    );

    SECTIONS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    // Scroll detection
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10"
          : "bg-black/40 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Section Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            {["About", "Experience", "Skills", "Projects"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section.toLowerCase())}
                className={`text-xs sm:text-sm font-medium transition-all px-2 py-1 rounded-lg ${
                  active === section.toLowerCase()
                    ? "text-accent bg-accent/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                {section}
              </button>
            ))}
          </div>

          {/* Right: Game + Commands */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.button
              onClick={onOpenGame}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 flex items-center justify-center hover:shadow-purple-500/50 transition-shadow"
              title="Play Game"
            >
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </motion.button>

            <button
              onClick={onOpenCommand}
              className="group flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/10 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-400 transition-all hover:border-accent/50 hover:bg-white/5"
              title="Open Commands (⌘K)"
            >
              <Command className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">⌘K</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
