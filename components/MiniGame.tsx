"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, X, RotateCcw } from "lucide-react";

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Obstacle extends GameObject {
  type: "bug" | "error";
}

interface Collectible extends GameObject {
  type: "star" | "coin";
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

  const [playerY, setPlayerY] = useState(250);
  const [velocity, setVelocity] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [collectibles, setCollectibles] = useState<Collectible[]>([]);

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-start game when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setIsPlaying(true), 500);
    } else {
      setIsPlaying(false);
    }
  }, [isOpen]);

  const gameLoopRef = useRef<number | undefined>(undefined);
  const canvasRef = useRef<HTMLDivElement>(null);
  const obstacleTimerRef = useRef(0);
  const collectibleTimerRef = useRef(0);

  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;
  const PLAYER_X = 80;
  const PLAYER_SIZE = 40;
  const GAME_WIDTH = 600;
  const GAME_HEIGHT = 400;
  const GROUND_Y = GAME_HEIGHT - 60;

  // Load high score from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("portfolio-game-highscore");
      if (saved) setHighScore(parseInt(saved));
    }
  }, []);

  // Save high score
  useEffect(() => {
    if (typeof window !== "undefined" && score > highScore) {
      setHighScore(score);
      localStorage.setItem("portfolio-game-highscore", score.toString());
    }
  }, [score, highScore]);

  const jump = useCallback(() => {
    if (!gameOver && playerY >= GROUND_Y - PLAYER_SIZE) {
      setVelocity(JUMP_STRENGTH);
    }
  }, [gameOver, playerY, GROUND_Y, PLAYER_SIZE, JUMP_STRENGTH]);

  const resetGame = () => {
    setPlayerY(GROUND_Y - PLAYER_SIZE);
    setVelocity(0);
    setObstacles([]);
    setCollectibles([]);
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  // Handle keyboard
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === "Space" && isOpen) {
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

  // Reset timers when game starts
  useEffect(() => {
    if (isPlaying && !gameOver) {
      obstacleTimerRef.current = 0;
      collectibleTimerRef.current = 0;
    }
  }, [isPlaying, gameOver]);

  // Game loop
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    let lastTime = Date.now();

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastTime) / 16.67; // Normalize to 60fps
      lastTime = now;

      // Update player physics
      setVelocity((v) => v + GRAVITY * deltaTime);
      setPlayerY((y) => {
        const newY = y + velocity * deltaTime;
        return Math.min(newY, GROUND_Y - PLAYER_SIZE);
      });

      // Spawn obstacles
      obstacleTimerRef.current += deltaTime;
      if (obstacleTimerRef.current > 60) {
        obstacleTimerRef.current = 0;
        const types: ("bug" | "error")[] = ["bug", "error"];
        setObstacles((prev) => [
          ...prev,
          {
            x: GAME_WIDTH,
            y: GROUND_Y - 40,
            width: 40,
            height: 40,
            type: types[Math.floor(Math.random() * types.length)],
          },
        ]);
      }

      // Spawn collectibles
      collectibleTimerRef.current += deltaTime;
      if (collectibleTimerRef.current > 80) {
        collectibleTimerRef.current = 0;
        const types: ("star" | "coin")[] = ["star", "coin"];
        setCollectibles((prev) => [
          ...prev,
          {
            x: GAME_WIDTH,
            y: Math.random() * (GROUND_Y - 100) + 50,
            width: 30,
            height: 30,
            type: types[Math.floor(Math.random() * types.length)],
          },
        ]);
      }

      // Move and filter obstacles
      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, x: obs.x - 5 * deltaTime }))
          .filter((obs) => obs.x > -obs.width)
      );

      // Move and filter collectibles
      setCollectibles((prev) =>
        prev
          .map((col) => ({ ...col, x: col.x - 5 * deltaTime }))
          .filter((col) => col.x > -col.width)
      );

      // Collision detection - obstacles
      const playerRect = {
        x: PLAYER_X,
        y: playerY,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
      };

      obstacles.forEach((obs) => {
        if (
          playerRect.x < obs.x + obs.width &&
          playerRect.x + playerRect.width > obs.x &&
          playerRect.y < obs.y + obs.height &&
          playerRect.y + playerRect.height > obs.y
        ) {
          setGameOver(true);
          setIsPlaying(false);
        }
      });

      // Collision detection - collectibles
      collectibles.forEach((col) => {
        if (
          playerRect.x < col.x + col.width &&
          playerRect.x + playerRect.width > col.x &&
          playerRect.y < col.y + col.height &&
          playerRect.y + playerRect.height > col.y
        ) {
          setScore((s) => s + (col.type === "star" ? 10 : 5));
          setCollectibles((prev) => prev.filter((c) => c !== col));
        }
      });

      // Increase score over time
      setScore((s) => s + 0.1 * deltaTime);

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPlaying, gameOver, velocity, playerY, obstacles, collectibles, GROUND_Y, PLAYER_SIZE, GAME_WIDTH, GRAVITY, jump]);

  if (!mounted) return null;

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
                <h3 className="font-semibold text-white">Code Runner</h3>
                <p className="text-xs text-white/80">Dodge bugs, collect features!</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-white text-sm font-bold">{Math.floor(score)}</div>
                  <div className="text-white/70 text-xs">High: {highScore}</div>
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
              ref={canvasRef}
              className="relative bg-gradient-to-b from-indigo-950 via-purple-950 to-black overflow-hidden"
              style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
              onClick={() => {
                if (gameOver) {
                  resetGame();
                } else if (isPlaying) {
                  jump();
                }
              }}
            >
              {/* Stars background */}
              <div className="absolute inset-0">
                {Array.from({ length: 30 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Ground */}
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/50 to-transparent"
                style={{ height: 60 }}
              />

              {/* Player */}
              <motion.div
                className="absolute bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg shadow-lg shadow-cyan-500/50"
                style={{
                  left: PLAYER_X,
                  top: playerY,
                  width: PLAYER_SIZE,
                  height: PLAYER_SIZE,
                }}
                animate={{
                  rotate: velocity < 0 ? -20 : 0,
                }}
              >
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  🚀
                </div>
              </motion.div>

              {/* Obstacles */}
              {obstacles.map((obs, i) => (
                <div
                  key={`obs-${i}`}
                  className="absolute rounded-lg"
                  style={{
                    left: obs.x,
                    top: obs.y,
                    width: obs.width,
                    height: obs.height,
                    background:
                      obs.type === "bug"
                        ? "linear-gradient(135deg, #ef4444, #dc2626)"
                        : "linear-gradient(135deg, #f97316, #ea580c)",
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center text-2xl">
                    {obs.type === "bug" ? "🐛" : "⚠️"}
                  </div>
                </div>
              ))}

              {/* Collectibles */}
              {collectibles.map((col, i) => (
                <motion.div
                  key={`col-${i}`}
                  className="absolute"
                  style={{
                    left: col.x,
                    top: col.y,
                    width: col.width,
                    height: col.height,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <div className="text-2xl">{col.type === "star" ? "⭐" : "💎"}</div>
                </motion.div>
              ))}

              {/* Game Over Screen */}
              <AnimatePresence>
                {gameOver && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
                      <p className="text-2xl text-cyan-400 mb-2">Score: {Math.floor(score)}</p>
                      {score > highScore && (
                        <p className="text-lg text-yellow-400 mb-6">New High Score! 🎉</p>
                      )}
                      <button
                        onClick={resetGame}
                        className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full font-semibold text-black hover:scale-110 transition-transform flex items-center gap-2 mx-auto"
                      >
                        <RotateCcw className="w-5 h-5" />
                        Play Again
                      </button>
                      <p className="text-sm text-gray-400 mt-4">
                        Press SPACE or Click to jump
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
                    className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                  >
                    <div className="text-center">
                      <h2 className="text-3xl font-bold text-white mb-4">Code Runner</h2>
                      <p className="text-gray-300 mb-6">
                        Dodge bugs and errors!<br />
                        Collect stars and features!
                      </p>
                      <button
                        onClick={() => setIsPlaying(true)}
                        className="px-8 py-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full font-semibold text-black hover:scale-110 transition-transform text-lg"
                      >
                        Start Game
                      </button>
                      <p className="text-sm text-gray-400 mt-4">
                        Press SPACE or Click to jump
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls Info */}
            <div className="bg-black/40 p-3 text-center text-xs text-gray-400">
              <span className="font-semibold text-white">Controls:</span> SPACE or CLICK to jump • Dodge 🐛 bugs and ⚠️ errors • Collect ⭐ stars (10pts) & 💎 gems (5pts)
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
