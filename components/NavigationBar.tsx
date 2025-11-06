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

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="wrap flex h-16 items-center justify-between">
        {/* Game Button */}
        <div className="flex items-center gap-3">
          <motion.button
            onClick={onOpenGame}
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg shadow-purple-500/30 flex items-center justify-center hover:shadow-purple-500/50 transition-shadow"
          >
            <Gamepad2 className="w-5 h-5 text-white" />
          </motion.button>
          <span className="text-xl font-semibold tracking-tight hover:text-accent transition-colors hidden sm:block">
            Kushagra<span className="text-accent">.</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {SECTIONS.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={`capitalize text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm px-2 py-1 ${
                active === section
                  ? "text-accent"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {section}
              {active === section && (
                <motion.div
                  layoutId="activeSection"
                  className="h-0.5 bg-accent mt-1 rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommand}
          className="group flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-gray-400 transition-all hover:border-accent/50 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <Command className="h-4 w-4" />
          <span className="hidden sm:inline">Commands</span>
          <kbd className="hidden lg:inline-block ml-2 rounded bg-white/10 px-1.5 py-0.5 text-xs text-gray-500 group-hover:bg-accent/20 group-hover:text-accent">
            ⌘K
          </kbd>
        </button>
      </div>
    </motion.nav>
  );
}
