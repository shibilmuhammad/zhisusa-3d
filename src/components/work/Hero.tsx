"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

export const WorkHero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <section ref={containerRef} className="work-hero">
      <div className="work-hero__content">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            opacity: heroOpacity,
            scale: heroScale,
            y: heroY,
          }}
        >
          <h1 className="work-hero__title">Work at ZHISUSA</h1>
          <p className="work-hero__subtitle">Productivity Meets Peace</p>
          <p className="work-hero__description">
            Where focus flows naturally and creativity thrives in harmony with nature.
            Experience work reimagined in spaces designed for both productivity and tranquility.
          </p>
        </motion.div>

        <motion.button
          className="work-hero__cta"
          onClick={() => {
            document.querySelector(".work-workspaces")?.scrollIntoView({ behavior: "smooth" });
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Explore Workspaces
        </motion.button>
      </div>

      {/* Animated background elements */}
      <div className="work-hero__bg-elements">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="work-hero__particle"
            animate={{
              y: [0, -40, 0],
              x: [0, Math.sin(i) * 30, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
            style={{
              left: `${15 + i * 12}%`,
              top: `${25 + Math.cos(i) * 25}%`,
            }}
          />
        ))}
      </div>
    </section>
  );
};


