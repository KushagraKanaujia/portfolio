"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Cloud, CloudRain, Sun } from "lucide-react";

interface Volcano {
  x: number;
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

  const [dragonY, setDragonY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [volcanoes, setVolcanoes] = useState<Volcano[]>([]);

  const gameLoopRef = useRef<number | undefined>(undefined);
  const volcanoTimerRef = useRef(0);

  const GRAVITY = 1.2;
  const JUMP_STRENGTH = -18;
  const DRAGON_X = 100;
  const DRAGON_SIZE = 50;
  const GAME_WIDTH = 600;
  const GAME_HEIGHT = 400;
  const GROUND_Y = 320;
  const VOLCANO_WIDTH = 50;
  const VOLCANO_HEIGHT = 70;
  const GAME_SPEED = 5;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && !isPlaying && !gameOver) {
      setTimeout(() => setIsPlaying(true), 500);
    }
  }, [isOpen, isPlaying, gameOver]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dragon-runner-highscore");
      if (saved) setHighScore(parseInt(saved));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && score > highScore) {
      setHighScore(score);
      localStorage.setItem("dragon-runner-highscore", score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    if (score >= 100) {
      setWeather("rainy");
    } else {
      setWeather("sunny");
    }
  }, [score]);

  const jump = useCallback(() => {
    if (!gameOver && isPlaying && dragonY === 0 && !isJumping) {
      setVelocity(JUMP_STRENGTH);
      setIsJumping(true);
    }
  }, [gameOver, isPlaying, dragonY, isJumping, JUMP_STRENGTH]);

  const resetGame = () => {
    setDragonY(0);
    setVelocity(0);
    setIsJumping(false);
    setVolcanoes([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setWeather("sunny");
    volcanoTimerRef.current = 0;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "ArrowUp") && isOpen) {
        e.preventDefault();
        if (gameOver) {
          resetGame();
        } else if (isPlaying) {
          jump();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, gameOver, isPlaying, jump]);

  useEffect(() => {
    if (!isPlaying || gameOver) return;

    let lastTime = Date.now();

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 16.67;
      lastTime = now;

      // Update dragon physics
      if (dragonY > 0 || velocity < 0) {
        setVelocity((v) => v + GRAVITY * deltaTime);
        setDragonY((y) => {
          const newY = y + velocity * deltaTime;
          if (newY <= 0) {
            setIsJumping(false);
            return 0;
          }
          return newY;
        });
      }

      // Spawn volcanoes
      volcanoTimerRef.current += deltaTime;
      if (volcanoTimerRef.current > 100) {
        volcanoTimerRef.current = 0;
        setVolcanoes((prev) => [
          ...prev,
          {
            x: GAME_WIDTH,
            passed: false,
          },
        ]);
      }

      // Move volcanoes and check collisions
      setVolcanoes((prev) =>
        prev
          .map((volcano) => {
            const newVolcano = { ...volcano, x: volcano.x - GAME_SPEED * deltaTime };

            // Check if passed
            if (!newVolcano.passed && newVolcano.x + VOLCANO_WIDTH < DRAGON_X) {
              newVolcano.passed = true;
              setScore((s) => s + 1);
            }

            // Collision detection
            const dragonLeft = DRAGON_X;
            const dragonRight = DRAGON_X + DRAGON_SIZE;
            const dragonTop = GROUND_Y - dragonY - DRAGON_SIZE;
            const dragonBottom = GROUND_Y - dragonY;

            const volcanoLeft = newVolcano.x;
            const volcanoRight = newVolcano.x + VOLCANO_WIDTH;
            const volcanoTop = GROUND_Y - VOLCANO_HEIGHT;
            const volcanoBottom = GROUND_Y;

            // Check collision
            if (
              dragonRight > volcanoLeft &&
              dragonLeft < volcanoRight &&
              dragonBottom > volcanoTop &&
              dragonTop < volcanoBottom
            ) {
              setGameOver(true);
              setIsPlaying(false);
            }

            return newVolcano;
          })
          .filter((v) => v.x > -VOLCANO_WIDTH)
      );

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, velocity, dragonY, GRAVITY, GAME_WIDTH, VOLCANO_WIDTH, VOLCANO_HEIGHT, DRAGON_X, DRAGON_SIZE, GROUND_Y, GAME_SPEED, jump]);

  if (!mounted) return null;

  const bgGradient = weather === "sunny"
    ? "from-blue-300 via-blue-200 to-blue-100"
    : "from-gray-600 via-gray-500 to-gray-400";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-40 glass-card rounded-2xl shadow-2xl overflow-hidden border border-white/20"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT + 80 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">🐉 Dragon Runner</h3>
                <p className="text-xs text-white/80">Jump over volcanoes!</p>
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
                  jump();
                }
              }}
            >
              {/* Sun */}
              {weather === "sunny" && (
                <motion.div
                  className="absolute top-8 right-12 text-yellow-400"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <Sun className="w-16 h-16" />
                </motion.div>
              )}

              {/* Rain */}
              {weather === "rainy" && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-0.5 h-6 bg-blue-400/60"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: -20,
                      }}
                      animate={{
                        y: [0, GAME_HEIGHT + 20],
                      }}
                      transition={{
                        duration: 0.6 + Math.random() * 0.3,
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
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-white/40"
                    style={{
                      left: `${i * 30}%`,
                      top: `${10 + i * 8}%`,
                    }}
                    animate={{
                      x: [-100, GAME_WIDTH + 100],
                    }}
                    transition={{
                      duration: 15 + i * 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    {weather === "rainy" ? (
                      <CloudRain className="w-10 h-10" />
                    ) : (
                      <Cloud className="w-10 h-10" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Ground */}
              <div
                className="absolute left-0 right-0 bg-green-600"
                style={{
                  bottom: 0,
                  height: GAME_HEIGHT - GROUND_Y,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-green-700" />
                {/* Ground pattern */}
                <div className="absolute inset-0 flex">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-1 bg-green-700/30 mt-4"
                      style={{ marginLeft: i * 30 }}
                    />
                  ))}
                </div>
              </div>

              {/* Dragon */}
              <motion.div
                className="absolute"
                style={{
                  left: DRAGON_X,
                  bottom: GAME_HEIGHT - GROUND_Y + dragonY,
                  width: DRAGON_SIZE,
                  height: DRAGON_SIZE,
                }}
                animate={{
                  rotate: isJumping ? -10 : 0,
                }}
              >
                <div className="text-5xl">🐉</div>
              </motion.div>

              {/* Volcanoes */}
              {volcanoes.map((volcano, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{
                    left: volcano.x,
                    bottom: GAME_HEIGHT - GROUND_Y,
                    width: VOLCANO_WIDTH,
                    height: VOLCANO_HEIGHT,
                  }}
                >
                  <div className="relative w-full h-full">
                    {/* Volcano body */}
                    <div
                      className="absolute bottom-0 bg-gradient-to-t from-red-700 via-red-600 to-orange-500"
                      style={{
                        width: "100%",
                        height: "100%",
                        clipPath: "polygon(20% 100%, 50% 0%, 80% 100%)",
                      }}
                    />
                    {/* Lava */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                  </div>
                </div>
              ))}

              {/* Score display */}
              <div className="absolute top-4 left-4 text-4xl font-bold text-white/30">
                {score}
              </div>

              {/* Weather indicator */}
              <div className="absolute top-4 right-4 text-2xl">
                {weather === "rainy" ? "🌧️" : "☀️"}
              </div>

              {/* Game Over Screen */}
              <AnimatePresence>
                {gameOver && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <div className="text-6xl mb-4">💥</div>
                      <h2 className="text-4xl font-bold text-white mb-3">Game Over!</h2>
                      <p className="text-2xl text-yellow-400 mb-2">Score: {score}</p>
                      {score > highScore && score > 0 && (
                        <p className="text-lg text-green-400 mb-4">New High Score! 🎉</p>
                      )}
                      <button
                        onClick={resetGame}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-white hover:scale-110 transition-transform flex items-center gap-2 mx-auto"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Play Again
                      </button>
                      <p className="text-sm text-gray-300 mt-3">
                        Press SPACE to jump
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
                    className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <div className="text-7xl mb-4">🐉</div>
                      <h2 className="text-3xl font-bold text-white mb-3">Dragon Runner</h2>
                      <p className="text-gray-200 mb-5 text-sm">
                        Jump over volcanoes!<br />
                        Weather changes at 100 points
                      </p>
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full font-semibold text-white hover:scale-110 transition-transform text-lg"
                      >
                        Start Running
                      </button>
                      <p className="text-sm text-gray-300 mt-3">
                        Press SPACE or Click to jump
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls Info */}
            <div className="bg-black/40 p-2 text-center text-xs text-gray-300">
              <span className="font-semibold text-white">Controls:</span> SPACE or CLICK to jump • Dodge volcanoes 🌋
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
