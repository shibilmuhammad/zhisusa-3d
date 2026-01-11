"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import styles from "./Hero.module.css";

export const WizardHero = () => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={containerRef} className={styles.hero}>
      <div className={styles.heroBackground} />
      
      {/* Decorative Z elements */}
      <motion.div
        className={styles.zLeft}
        initial={{ opacity: 0.1, x: -50 }}
        animate={{ opacity: [0.1, 0.15, 0.1], x: [-50, -45, -50] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ y: scrollY * 0.3 }}
      >
        Z
      </motion.div>
      <motion.div
        className={styles.zRight}
        initial={{ opacity: 0.1, x: 50 }}
        animate={{ opacity: [0.1, 0.15, 0.1], x: [50, 45, 50] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ y: scrollY * 0.3 }}
      >
        Z
      </motion.div>

      <div className={styles.heroContent}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Create Your Stay — Your Way.
        </motion.h1>
        
        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Design a custom lakeside experience that blends living,
          <br />leisure, and work tailored to your rhythm.
        </motion.p>
      </div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      >
        <span>Start planning</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </motion.div>
    </section>
  );
};

