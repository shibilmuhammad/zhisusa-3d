"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./ProgressNav.module.css";

const steps = [
  { id: "live", label: "Live" },
  { id: "leisure", label: "Leisure" },
  { id: "work", label: "Work" },
  { id: "review", label: "Review" },
];

export const ProgressNav = () => {
  const [activeStep, setActiveStep] = useState("live");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 100);

      // Determine active step based on scroll position
      const sections = steps.map((step) => {
        const element = document.getElementById(`section-${step.id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          return { id: step.id, top: rect.top, bottom: rect.bottom };
        }
        return null;
      }).filter(Boolean);

      const viewportCenter = window.innerHeight / 2;

      for (const section of sections) {
        if (section && section.top <= viewportCenter && section.bottom >= viewportCenter) {
          setActiveStep(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStepClick = (stepId: string) => {
    const element = document.getElementById(`section-${stepId}`);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
      setActiveStep(stepId);
    }
  };

  return (
    <nav className={`${styles.nav} ${isSticky ? styles.navSticky : ""}`}>
      <div className={styles.navContainer}>
        {steps.map((step, index) => (
          <button
            key={step.id}
            className={`${styles.step} ${activeStep === step.id ? styles.stepActive : ""}`}
            onClick={() => handleStepClick(step.id)}
          >
            <span className={styles.stepLabel}>{step.label}</span>
            {activeStep === step.id && (
              <motion.div
                className={styles.underline}
                layoutId="underline"
                initial={false}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

