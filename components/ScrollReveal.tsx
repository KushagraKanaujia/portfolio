"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  src: string;
  title: string;
  description: string;
}

export default function ScrollReveal({ src, title, description }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative flex flex-col items-center justify-center h-screen overflow-hidden">
      <motion.img
        src={src}
        style={{ scale, opacity }}
        className="absolute inset-0 object-cover w-full h-full"
      />
      <motion.div
        className="relative z-10 text-center text-white px-4"
        style={{ opacity }}
      >
        <h2 className="text-5xl font-semibold">{title}</h2>
        <p className="mt-4 text-lg opacity-80">{description}</p>
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
    </section>
  );
}
