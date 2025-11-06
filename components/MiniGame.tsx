"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Cloud, CloudRain } from "lucide-react";

interface Volcano {
  x: number;
  gapY: number;
  gapSize: number;
  width: number;
  passed: boolean;
}

interface MiniGameProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function MiniGame({ isOpen, setIsOpen }: MiniGameProps) {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [weather, setWeather] = useState<"sunny" | "rainy">("sunny");

  const [dragonY, setDragonY] = useState(200);
  const [velocity, setVelocity] = useState(0);
  const [volcanoes, setVolcanoes] = useState<Volcano[]>([]);

  const gameLoopRef = useRef<number | undefined>(undefined);
  const volcanoTimerRef = useRef(0);

  const GRAVITY = 0.6;
  const FLAP_STRENGTH = -10;
  const DRAGON_X = 100;
  const DRAGON_SIZE = 50;
  const GAME_WIDTH = 600;
  const GAME_HEIGHT = 500;
  const VOLCANO_WIDTH = 80;
  const GAP_SIZE = 180;

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-start game when opened
  useEffect(() => {
    if (isOpen && !isPlaying && !gameOver) {
      setTimeout(() => setIsPlaying(true), 500);
    }
  }, [isOpen, isPlaying, gameOver]);

  // Load high score
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("flappy-dragon-highscore");
      if (saved) setHighScore(parseInt(saved));
    }
  }, []);

  // Save high score
  useEffect(() => {
    if (typeof window !== "undefined" && score > highScore) {
      setHighScore(score);
      localStorage.setItem("flappy-dragon-highscore", score.toString());
    }
  }, [score, highScore]);

  // Weather changes at 100 points
  useEffect(() => {
    if (score >= 100) {
      setWeather("rainy");
    } else {
      setWeather("sunny");
    }
  }, [score]);

  const flap = useCallback(() => {
    if (!gameOver && isPlaying) {
      setVelocity(FLAP_STRENGTH);
    }
  }, [gameOver, isPlaying, FLAP_STRENGTH]);

  const resetGame = () => {
    setDragonY(200);
    setVelocity(0);
    setVolcanoes([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setWeather("sunny");
    volcanoTimerRef.current = 0;
  };

  // Handle keyboard/click
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && isOpen) {
        e.preventDefault();
        if (gameOver) {
          resetGame();
        } else if (isPlaying) {
          flap();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, gameOver, isPlaying, flap]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    let lastTime = Date.now();

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 16.67;
      lastTime = now;

      // Update dragon physics
      setVelocity((v) => v + GRAVITY * deltaTime);
      setDragonY((y) => {
        const newY = y + velocity * deltaTime;
        // Check ceiling and floor collision
        if (newY < 0 || newY > GAME_HEIGHT - DRAGON_SIZE) {
          setGameOver(true);
          setIsPlaying(false);
          return y;
        }
        return newY;
      });

      // Spawn volcanoes
      volcanoTimerRef.current += deltaTime;
      if (volcanoTimerRef.current > 100) {
        volcanoTimerRef.current = 0;
        const gapY = Math.random() * (GAME_HEIGHT - GAP_SIZE - 100) + 50;
        setVolcanoes((prev) => [
          ...prev,
          {
            x: GAME_WIDTH,
            gapY,
            gapSize: GAP_SIZE,
            width: VOLCANO_WIDTH,
            passed: false,
          },
        ]);
      }

      // Move volcanoes and check collisions
      setVolcanoes((prev) =>
        prev
          .map((volcano) => {
            const newVolcano = { ...volcano, x: volcano.x - 3 * deltaTime };

            // Check if passed
            if (!newVolcano.passed && newVolcano.x + newVolcano.width < DRAGON_X) {
              newVolcano.passed = true;
              setScore((s) => s + 1);
            }

            // Collision detection
            const dragonLeft = DRAGON_X;
            const dragonRight = DRAGON_X + DRAGON_SIZE;
            const dragonTop = dragonY;
            const dragonBottom = dragonY + DRAGON_SIZE;

            const volcanoLeft = newVolcano.x;
            const volcanoRight = newVolcano.x + newVolcano.width;
            const gapTop = newVolcano.gapY;
            const gapBottom = newVolcano.gapY + newVolcano.gapSize;

            // Check if dragon is within volcano x range
            if (dragonRight > volcanoLeft && dragonLeft < volcanoRight) {
              // Check if dragon hit top or bottom volcano
              if (dragonTop < gapTop || dragonBottom > gapBottom) {
                setGameOver(true);
                setIsPlaying(false);
              }
            }

            return newVolcano;
          })
          .filter((v) => v.x > -v.width)
      );

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, velocity, dragonY, GRAVITY, GAME_HEIGHT, DRAGON_SIZE, GAME_WIDTH, VOLCANO_WIDTH, GAP_SIZE, DRAGON_X, flap]);

  if (!mounted) return null;

  const bgGradient = weather === "sunny"
    ? "from-sky-400 via-sky-300 to-orange-200"
    : "from-gray-700 via-gray-600 to-gray-500";

  return (
    <>
      {/* Game Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-40 glass-card rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT + 100 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">🐉 Flappy Dragon</h3>
                <p className="text-xs text-white/80">Dodge the volcanoes!</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-white text-sm font-bold">Score: {score}</div>
                  <div className="text-white/70 text-xs">Best: {highScore}</div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsPlaying(false);
                    setGameOver(false);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>

            {/* Game Canvas */}
            <div
              className={`relative bg-gradient-to-b ${bgGradient} overflow-hidden cursor-pointer`}
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
              onClick={() => {
                if (gameOver) {
                  resetGame();
                } else if (isPlaying) {
                  flap();
                }
              }}
            >
              {/* Weather effects */}
              {weather === "rainy" && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-0.5 h-4 bg-blue-300/60"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: -20,
                      }}
                      animate={{
                        y: [0, GAME_HEIGHT + 20],
                      }}
                      transition={{
                        duration: 0.5 + Math.random() * 0.3,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                        ease: "linear",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Clouds */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-white/30"
                    style={{
                      left: `${i * 35}%`,
                      top: `${20 + i * 15}%`,
                    }}
                    animate={{
                      x: [-50, GAME_WIDTH + 50],
                    }}
                    transition={{
                      duration: 20 + i * 5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {weather === "rainy" ? (
                      <CloudRain className="w-12 h-12" />
                    ) : (
                      <Cloud className="w-12 h-12" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Dragon */}
              <motion.div
                className="absolute"
                style={{
                  left: DRAGON_X,
                  top: dragonY,
                  width: DRAGON_SIZE,
                  height: DRAGON_SIZE,
                }}
                animate={{
                  rotate: Math.min(Math.max(velocity * 3, -30), 30),
                }}
              >
                <div className="text-5xl">🐉</div>
              </motion.div>

              {/* Volcanoes */}
              {volcanoes.map((volcano, i) => (
                <div key={i}>
                  {/* Top volcano */}
                  <div
                    className="absolute bg-gradient-to-b from-red-600 to-orange-500"
                    style={{
                      left: volcano.x,
                      top: 0,
                      width: volcano.width,
                      height: volcano.gapY,
                      clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                    }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-yellow-500" />
                  </div>

                  {/* Bottom volcano */}
                  <div
                    className="absolute bg-gradient-to-t from-red-600 to-orange-500"
                    style={{
                      left: volcano.x,
                      top: volcano.gapY + volcano.gapSize,
                      width: volcano.width,
                      height: GAME_HEIGHT - (volcano.gapY + volcano.gapSize),
                      clipPath: "polygon(0% 0%, 100% 0%, 80% 100%, 20% 100%)",
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-4 bg-yellow-500" />
                  </div>
                </div>
              ))}

              {/* Score display */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 text-6xl font-bold text-white/20">
                {score}
              </div>

              {/* Game Over Screen */}
              <AnimatePresence>
                {gameOver && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">💥</div>
                      <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
                      <p className="text-2xl text-yellow-400 mb-2">Score: {score}</p>
                      {score > highScore && score > 0 && (
                        <p className="text-lg text-green-400 mb-6">New High Score! 🎉</p>
                      )}
                      <button
                        onClick={resetGame}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-white hover:scale-110 transition-transform flex items-center gap-2 mx-auto"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Play Again
                      </button>
                      <p className="text-sm text-gray-300 mt-4">
                        Tap SPACE or Click to flap
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Start Screen */}
              <AnimatePresence>
                {!isPlaying && !gameOver && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <div className="text-8xl mb-6">🐉</div>
                      <h2 className="text-4xl font-bold text-white mb-4">Flappy Dragon</h2>
                      <p className="text-gray-200 mb-6">
                        Tap to flap through the volcanoes!<br />
                        Weather changes at 100 points
                      </p>
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-white hover:scale-110 transition-transform text-lg"
                      >
                        Start Flying
                      </button>
                      <p className="text-sm text-gray-300 mt-4">
                        Press SPACE or Click to flap
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls Info */}
            <div className="bg-black/40 p-3 text-center text-xs text-gray-300">
              <span className="font-semibold text-white">Controls:</span> SPACE or CLICK to flap •
              Dodge volcanoes 🌋 • Weather changes at 100 points {weather === "rainy" ? "🌧️" : "☀️"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
