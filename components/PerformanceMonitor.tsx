"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, X } from "lucide-react";

interface PerformanceMetrics {
  fps: number;
  memory: number;
  loadTime: number;
  firstPaint: number;
}

export default function PerformanceMonitor() {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    loadTime: 0,
    firstPaint: 0,
  });

  useEffect(() => {
    // FPS Counter
    let lastTime = performance.now();
    let frames = 0;
    let fps = 60;

    const measureFPS = () => {
      const currentTime = performance.now();
      frames++;

      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;

        setMetrics((prev) => ({ ...prev, fps }));
      }

      requestAnimationFrame(measureFPS);
    };

    measureFPS();

    // Memory Usage (if available)
    if ((performance as any).memory) {
      const updateMemory = () => {
        const memoryMB =
          (performance as any).memory.usedJSHeapSize / 1048576;
        setMetrics((prev) => ({
          ...prev,
          memory: Math.round(memoryMB),
        }));
      };

      const interval = setInterval(updateMemory, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    // Page Load Performance
    if (typeof window !== "undefined" && window.performance) {
      const perfData = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;

      if (perfData) {
        const loadTime = perfData.loadEventEnd - perfData.fetchStart;
        const firstPaint = perfData.responseStart - perfData.fetchStart;

        setMetrics((prev) => ({
          ...prev,
          loadTime: Math.round(loadTime),
          firstPaint: Math.round(firstPaint),
        }));
      }
    }
  }, []);

  // Keyboard shortcut: Ctrl+Shift+P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return "text-green-400";
    if (fps >= 30) return "text-yellow-400";
    return "text-red-400";
  };

  const getMemoryColor = (mb: number) => {
    if (mb < 50) return "text-green-400";
    if (mb < 100) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-8 z-50 p-3 glass-card rounded-full hover:bg-white/10 transition-colors group"
        title="Performance Monitor (Ctrl+Shift+P)"
      >
        <Activity className="w-5 h-5 text-accent group-hover:animate-pulse" />
      </motion.button>

      {/* Performance Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-40 right-8 z-50 w-80"
          >
            <div className="glass-card rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-white">
                    Performance Monitor
                  </h3>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              {/* Metrics */}
              <div className="space-y-4">
                {/* FPS */}
                <MetricRow
                  label="FPS"
                  value={`${metrics.fps}`}
                  color={getFPSColor(metrics.fps)}
                  description="Frames per second"
                />

                {/* Memory */}
                {metrics.memory > 0 && (
                  <MetricRow
                    label="Memory"
                    value={`${metrics.memory} MB`}
                    color={getMemoryColor(metrics.memory)}
                    description="JavaScript heap size"
                  />
                )}

                {/* Load Time */}
                {metrics.loadTime > 0 && (
                  <MetricRow
                    label="Load Time"
                    value={`${metrics.loadTime} ms`}
                    color={
                      metrics.loadTime < 2000
                        ? "text-green-400"
                        : "text-yellow-400"
                    }
                    description="Page load duration"
                  />
                )}

                {/* First Paint */}
                {metrics.firstPaint > 0 && (
                  <MetricRow
                    label="First Paint"
                    value={`${metrics.firstPaint} ms`}
                    color={
                      metrics.firstPaint < 1000
                        ? "text-green-400"
                        : "text-yellow-400"
                    }
                    description="Time to first render"
                  />
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500 text-center">
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs">
                    Ctrl+Shift+P
                  </kbd>{" "}
                  to toggle
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MetricRow({
  label,
  value,
  color,
  description,
}: {
  label: string;
  value: string;
  color: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className="text-xs text-gray-600">{description}</div>
      </div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
