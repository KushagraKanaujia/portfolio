"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Twitter, MapPin, Calendar } from "lucide-react";

interface ContactLinkProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  delay?: number;
}

const ContactLink = ({ icon, label, value, href, delay = 0 }: ContactLinkProps) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, x: 5 }}
      className="glow-card bg-card border border-card-border rounded-lg p-4 flex items-center gap-4 hover:border-accent/50 transition-all cursor-pointer"
    >
      <div className="text-accent">{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-gray-200 font-semibold">{value}</p>
      </div>
    </motion.a>
  );
};

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail size={24} />,
      label: "Email",
      value: "kushagra@example.com",
      href: "mailto:kushagra@example.com",
    },
    {
      icon: <Linkedin size={24} />,
      label: "LinkedIn",
      value: "/in/kushagra-kanaujia",
      href: "#",
    },
    {
      icon: <Github size={24} />,
      label: "GitHub",
      value: "@kushagrakanaujia",
      href: "#",
    },
    {
      icon: <Twitter size={24} />,
      label: "Twitter",
      value: "@kushagra_dev",
      href: "#",
    },
  ];

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Let's Connect</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Always open to interesting projects and opportunities
          </p>
        </motion.div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {contactInfo.map((info, index) => (
            <ContactLink key={info.label} {...info} delay={0.1 * index} />
          ))}
        </div>

        {/* Availability Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="glow-card bg-card border border-card-border rounded-lg p-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mt-2"></div>
            <div>
              <h3 className="text-2xl font-bold mb-2 gradient-text">
                Currently Available
              </h3>
              <p className="text-gray-300">
                Open to full-time opportunities starting Summer 2026
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-accent" />
              <div>
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-gray-200">Santa Barbara, CA</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-accent" />
              <div>
                <p className="text-sm text-gray-400">Availability</p>
                <p className="text-gray-200">Flexible / Remote</p>
              </div>
            </div>
          </div>

          <p className="text-gray-400 mb-6">
            Interested in roles involving ML systems, distributed systems, or full-stack
            development. Let's build something amazing together!
          </p>

          <motion.a
            href="mailto:kushagra@example.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent-blue transition-colors cursor-pointer"
          >
            <Mail size={20} />
            Send me an email
          </motion.a>
        </motion.div>

        {/* Terminal Style CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 terminal"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <p className="text-accent font-mono text-sm">
            <span className="text-gray-500">$</span> echo "Thanks for visiting!"
          </p>
          <p className="text-gray-300 font-mono text-sm pl-4 mt-2">
            Thanks for visiting!
          </p>
          <p className="text-accent font-mono text-sm mt-3">
            <span className="text-gray-500">$</span> git commit -m "Let's build something
            great"
            <span className="animate-pulse ml-2">|</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
