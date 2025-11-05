"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-card-border py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-400 flex items-center justify-center gap-2">
            Built with
            <Heart size={16} className="text-accent fill-accent animate-pulse" />
            by Kushagra Kanaujia
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © {currentYear} All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Made with Next.js, TypeScript, Tailwind CSS, and Framer Motion
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
