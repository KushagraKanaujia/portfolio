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
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Left: Game Button */}
          <motion.button
            onClick={onOpenGame}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 flex items-center justify-center hover:shadow-purple-500/50 transition-shadow"
            title="Play Game"
          >
            <Gamepad2 className="w-5 h-5 text-white" />
          </motion.button>

          {/* Right: Section Navigation Links */}
          <div className="flex items-center gap-6 sm:gap-8">
            {["About", "Experience", "Skills", "Projects"].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section.toLowerCase())}
                className={`text-base sm:text-lg font-medium transition-all ${
                  active === section.toLowerCase()
                    ? "text-accent"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
