"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import styles from "./WizardHeader.module.css";

export const WizardHeader = () => {
  return (
    <motion.header
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Link href="/" className={styles.logo}>
        ZHISUSA
      </Link>
      <Link href="/" className={styles.backLink}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back to Home</span>
      </Link>
    </motion.header>
  );
};

