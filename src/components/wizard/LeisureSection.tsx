"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./LeisureSection.module.css";

const allActivities = [
  "Archery",
  "Football",
  "Kayaking",
  "Volleyball",
  "ATV",
  "Fishing",
  "Gardening",
  "Kite Flying",
  "Meditative Library",
  "Painting",
  "Stargazing",
  "Yoga",
];

const timeSlots = ["Morning", "Afternoon", "Evening"];

interface DaySchedule {
  id: number;
  morning: string;
  afternoon: string;
  evening: string;
}

interface LeisureSectionProps {
  onContinue: (data: any) => void;
}

export const LeisureSection = ({ onContinue }: LeisureSectionProps) => {
  const [days, setDays] = useState<DaySchedule[]>([
    { id: 1, morning: "", afternoon: "", evening: "" },
  ]);

  const addDay = () => {
    const newDay: DaySchedule = {
      id: days.length + 1,
      morning: "",
      afternoon: "",
      evening: "",
    };
    setDays([...days, newDay]);
  };

  const updateDayActivity = (dayId: number, slot: string, activity: string) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          const slotKey = slot.toLowerCase() as "morning" | "afternoon" | "evening";
          return { ...day, [slotKey]: activity };
        }
        return day;
      })
    );
  };

  const handleSave = () => {
    onContinue({ days });
  };

  return (
    <section id="section-leisure" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.zDecor}>Z</span>
          <h2 className={styles.title}>LEISURE</h2>
          <span className={styles.zDecor}>Z</span>
        </motion.div>

        <AnimatePresence>
          {days.map((day, dayIndex) => (
            <motion.div
              key={day.id}
              className={styles.dayCard}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, delay: dayIndex * 0.1 }}
            >
              <h3 className={styles.dayTitle}>Day {day.id}</h3>
              
              <div className={styles.scheduleBox}>
                {timeSlots.map((slot) => (
                  <div key={slot} className={styles.timeSlot}>
                    <label className={styles.slotLabel}>{slot}</label>
                    <select
                      value={day[slot.toLowerCase() as keyof DaySchedule] as string}
                      onChange={(e) =>
                        updateDayActivity(day.id, slot, e.target.value)
                      }
                      className={styles.select}
                    >
                      <option value="">Select activity</option>
                      {allActivities.map((activity) => (
                        <option key={activity} value={activity}>
                          {activity}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>

              {dayIndex === days.length - 1 && dayIndex === 0 && (
                <motion.div
                  className={styles.carousel}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className={styles.carouselTrack}>
                    {allActivities.slice(0, 6).map((activity, idx) => (
                      <div key={idx} className={styles.carouselItem}>
                        <div className={styles.activityIcon}>{activity[0]}</div>
                        <span className={styles.activityName}>{activity}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          className={styles.addDayButton}
          onClick={addDay}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>+</span> Add Another Day
        </motion.button>

        <motion.button
          className={styles.saveButton}
          onClick={handleSave}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Save Leisure Plan
        </motion.button>
      </div>
    </section>
  );
};

