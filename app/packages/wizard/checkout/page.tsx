"use client";

import { motion } from "framer-motion";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import styles from "./checkout.module.css";

export default function WizardCheckoutPage() {
  return (
    <main className={styles.checkoutPage}>
      <WizardHeader />
      <div className={styles.container}>
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Complete Your Booking
        </motion.h1>
        
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className={styles.description}>
            Booking checkout page coming soon. This page will collect final details
            and process your custom package booking.
          </p>
        </motion.div>
      </div>
    </main>
  );
}

