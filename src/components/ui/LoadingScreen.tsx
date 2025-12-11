"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  progress: number;
  active: boolean;
}

export const LoadingScreen = ({ progress, active }: LoadingScreenProps) => {
  const [showLoader, setShowLoader] = useState(true);
  const [displayProgress, setDisplayProgress] = useState(0);

  // Smooth progress animation
  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayProgress((prev) => {
        const diff = progress - prev;
        if (Math.abs(diff) < 0.5) return progress;
        return prev + diff * 0.1;
      });
    }, 16);
    return () => clearInterval(timer);
  }, [progress]);

  // Hide loader when complete
  useEffect(() => {
    if (progress === 100 && !active) {
      const timer = setTimeout(() => {
        setShowLoader(false);
        // Re-enable scrolling
        document.body.style.overflow = "";
        document.body.style.position = "";
        document.body.style.width = "";
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [progress, active]);

  // Prevent scrolling while loading
  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    }
  }, [showLoader]);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          animate={{ opacity: progress === 100 && !active ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Animated Background */}
          <div className="loading-screen__background">
            <div className="loading-screen__gradient" />
            <div className="loading-screen__particles">
              {Array.from({ length: 20 }).map((_, i) => {
                const startX = typeof window !== "undefined" ? (Math.random() - 0.5) * window.innerWidth : 0;
                const startY = typeof window !== "undefined" ? (Math.random() - 0.5) * window.innerHeight : 0;
                return (
                  <motion.div
                    key={i}
                    className="loading-screen__particle"
                    initial={{ x: startX, y: startY }}
                    animate={{
                      y: [startY, startY - 100, startY],
                      x: [startX, startX + Math.sin(i) * 50, startX],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: "easeInOut",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="loading-screen__content">
            {/* Logo/Brand */}
            <motion.div
              className="loading-screen__brand"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <h1 className="loading-screen__title">ZHISUSA</h1>
              <p className="loading-screen__subtitle">Immersive Nature Retreat</p>
            </motion.div>

            {/* Progress Bar */}
            <div className="loading-screen__progress-container">
              <div className="loading-screen__progress-track">
                <motion.div
                  className="loading-screen__progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <motion.div
                    className="loading-screen__progress-glow"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(0, 245, 200, 0.5)",
                        "0 0 40px rgba(0, 245, 200, 0.8)",
                        "0 0 20px rgba(0, 245, 200, 0.5)",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>
              <motion.div
                className="loading-screen__progress-text"
                key={Math.round(displayProgress)}
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {Math.round(displayProgress)}%
              </motion.div>
            </div>

            {/* Loading Message */}
            <motion.div
              className="loading-screen__message"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Preparing your journey...
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

