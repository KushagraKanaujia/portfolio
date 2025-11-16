"use client";

import { motion } from "framer-motion";
import { Mail, Github, Linkedin } from "lucide-react";
import FloatingShapes from "./FloatingShapes";

const CTACinematic = () => {
  return (
    <section className="section-100vh bg-gradient-to-b from-black via-neutral-950 to-black relative overflow-hidden">
      <FloatingShapes />
      <div className="w-full max-w-5xl mx-auto text-center px-4 relative z-10">
        {/* Main CTA Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="font-bold mb-8 leading-tight" style={{ fontSize: '2.5rem' }}>
            <span className="gradient-text-apple">Let's build</span>
            <br />
            <motion.span
              className="gradient-cyan animate-gradient text-glow"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              something amazing
            </motion.span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-gray-400 max-w-2xl mx-auto"
            style={{ fontSize: '1.1rem', lineHeight: '1.8' }}
          >
            Open to opportunities, collaborations, and conversations about technology
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          <motion.a
            href="mailto:kushagrakanaujia@ucsb.edu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Send me an email"
            className="btn-apple-primary flex items-center gap-2 px-8 py-4"
            style={{ fontSize: '1rem' }}
          >
            <Mail className="w-5 h-5" aria-hidden="true" />
            Email Me
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex justify-center gap-6"
        >
          {[
            { icon: Github, href: "https://github.com/KushagraKanaujia", label: "GitHub" },
            { icon: Linkedin, href: "https://www.linkedin.com/in/kushagra-kanaujia", label: "LinkedIn" },
          ].map((social, index) => (
            <motion.a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.1 }}
              className="glass-card p-4 rounded-full hover:border-accent/50 transition-colors group"
              aria-label={`Visit my ${social.label} profile`}
            >
              <social.icon className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors" aria-hidden="true" />
            </motion.a>
          ))}
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9 }}
          className="mt-16 text-sm text-gray-600"
        >
          Santa Barbara, CA • PST/PDT • Available for opportunities
        </motion.p>
      </div>
    </section>
  );
};

export default CTACinematic;
