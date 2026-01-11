"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./ReviewSection.module.css";

interface ReviewSectionProps {
  liveData?: any;
  leisureData?: any;
  workData?: any;
}

export const ReviewSection = ({
  liveData,
  leisureData,
  workData,
}: ReviewSectionProps) => {
  const accommodationNames: Record<string, string> = {
    villa: "Private Villa",
    cottage: "Cottage",
    tent: "Tent",
    treehouse: "Tree House",
  };

  const workspaceNames: Record<string, string> = {
    "private-office": "Private Office",
    coworking: "Co-Working Space",
    conference: "Conference Room",
  };

  return (
    <section id="section-review" className={styles.section}>
      <div className={styles.container}>
        <motion.h2
          className={styles.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Review Your Custom Plan
        </motion.h2>

        <div className={styles.summaryGrid}>
          {liveData && (
            <motion.div
              className={styles.summaryCard}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className={styles.cardTitle}>LIVE</h3>
              <div className={styles.cardContent}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Stay:</span>
                  <span className={styles.value}>
                    {accommodationNames[liveData.accommodation] || liveData.accommodation}
                  </span>
                </div>
                {liveData.checkIn && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Check-in:</span>
                    <span className={styles.value}>{liveData.checkIn}</span>
                  </div>
                )}
                {liveData.checkOut && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Check-out:</span>
                    <span className={styles.value}>{liveData.checkOut}</span>
                  </div>
                )}
                {liveData.guests && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Guests:</span>
                    <span className={styles.value}>{liveData.guests}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {leisureData && leisureData.days && leisureData.days.length > 0 && (
            <motion.div
              className={styles.summaryCard}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className={styles.cardTitle}>LEISURE</h3>
              <div className={styles.cardContent}>
                {leisureData.days.map((day: any, index: number) => (
                  <div key={index} className={styles.daySummary}>
                    <h4 className={styles.dayTitle}>Day {day.id}</h4>
                    {day.morning && (
                      <div className={styles.activityRow}>
                        <span className={styles.timeSlot}>Morning:</span>
                        <span className={styles.activity}>{day.morning}</span>
                      </div>
                    )}
                    {day.afternoon && (
                      <div className={styles.activityRow}>
                        <span className={styles.timeSlot}>Afternoon:</span>
                        <span className={styles.activity}>{day.afternoon}</span>
                      </div>
                    )}
                    {day.evening && (
                      <div className={styles.activityRow}>
                        <span className={styles.timeSlot}>Evening:</span>
                        <span className={styles.activity}>{day.evening}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {workData && (
            <motion.div
              className={styles.summaryCard}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className={styles.cardTitle}>WORK</h3>
              <div className={styles.cardContent}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Workspace:</span>
                  <span className={styles.value}>
                    {workspaceNames[workData.workspace] || workData.workspace}
                  </span>
                </div>
                {workData.date && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Date:</span>
                    <span className={styles.value}>{workData.date}</span>
                  </div>
                )}
                {workData.startTime && workData.endTime && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Time:</span>
                    <span className={styles.value}>
                      {workData.startTime} - {workData.endTime}
                    </span>
                  </div>
                )}
                {workData.members && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Members:</span>
                    <span className={styles.value}>{workData.members}</span>
                  </div>
                )}
                {workData.combineWithStay && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Combined with Stay:</span>
                    <span className={styles.value}>Yes</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        <motion.div
          className={styles.ctaContainer}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/packages/wizard/checkout" className={styles.ctaButton}>
            Proceed to Booking
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

