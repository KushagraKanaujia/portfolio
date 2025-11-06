"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function EasterEggs() {
  const [konamiActivated, setKonamiActivated] = useState(false);
  const [secretMessage, setSecretMessage] = useState("");

  useEffect(() => {
    // Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A
    const konamiCode = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          activateKonami();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }

      // Secret messages for specific keys
      if (e.key === "h" && e.ctrlKey) {
        e.preventDefault();
        showSecret("👋 Hi there, curious developer! I see you're exploring the code.");
      }

      if (e.key === "i" && e.ctrlKey && e.shiftKey) {
        e.preventDefault();
        showSecret("🕵️ Nice try! DevTools are always welcome here.");
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const activateKonami = () => {
    setKonamiActivated(true);

    // Confetti explosion
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#00d9ff", "#0066ff", "#a855f7"],
    });

    showSecret(
      "🎮 Konami Code Activated! You're a true gamer at heart. Let's work together!"
    );

    // Matrix effect
    applyMatrixEffect();

    setTimeout(() => setKonamiActivated(false), 10000);
  };

  const showSecret = (message: string) => {
    setSecretMessage(message);
    setTimeout(() => setSecretMessage(""), 5000);
  };

  const applyMatrixEffect = () => {
    const body = document.body;
    body.style.animation = "matrix-rain 2s ease-in-out";

    setTimeout(() => {
      body.style.animation = "";
    }, 2000);
  };

  // Console messages
  useEffect(() => {
    const styles = [
      "color: #00d9ff",
      "font-size: 20px",
      "font-weight: bold",
      "padding: 10px",
    ].join(";");

    console.log("%c👋 Hey there, curious developer!", styles);
    console.log(
      "%cI see you're checking out the code. I like your style!",
      "color: #fff; font-size: 14px;"
    );
    console.log(
      "%cWant to work together? Reach out: your-email@example.com",
      "color: #a855f7; font-size: 14px;"
    );
    console.log(
      "%c🎮 Pro tip: Try the Konami Code (↑↑↓↓←→←→BA)",
      "color: #0ea5e9; font-size: 14px;"
    );
    console.log(
      "%c⚡ Or press Ctrl+Shift+H for a secret message",
      "color: #10b981; font-size: 14px;"
    );
  }, []);

  return (
    <>
      {/* Secret Message Toast */}
      <AnimatePresence>
        {secretMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[9999] max-w-md"
          >
            <div className="glass-card rounded-2xl p-6 shadow-2xl shadow-accent/20 border-2 border-accent/30">
              <p className="text-base text-white leading-relaxed">
                {secretMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Konami Mode Overlay */}
      <AnimatePresence>
        {konamiActivated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] pointer-events-none"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-purple-500/20 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="text-9xl"
              >
                🎮
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
