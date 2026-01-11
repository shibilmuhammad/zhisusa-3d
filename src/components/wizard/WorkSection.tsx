"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import styles from "./WorkSection.module.css";

const workspaces = [
  {
    id: "private-office",
    name: "Private Office",
    description: "Dedicated private workspace with premium amenities",
    icon: "🏢",
  },
  {
    id: "coworking",
    name: "Co-Working Space",
    description: "Flexible shared workspace with networking opportunities",
    icon: "💼",
  },
  {
    id: "conference",
    name: "Conference Room",
    description: "Meeting space for teams and presentations",
    icon: "📊",
  },
];

interface WorkSectionProps {
  onContinue: (data: any) => void;
}

export const WorkSection = ({ onContinue }: WorkSectionProps) => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const [workDate, setWorkDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [members, setMembers] = useState(1);
  const [combineWithStay, setCombineWithStay] = useState(false);

  const handleSave = () => {
    if (selectedWorkspace) {
      onContinue({
        workspace: selectedWorkspace,
        date: workDate,
        startTime,
        endTime,
        members,
        combineWithStay,
      });
    }
  };

  return (
    <section id="section-work" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.zDecor}>Z</span>
          <h2 className={styles.title}>WORK</h2>
          <span className={styles.zDecor}>Z</span>
        </motion.div>

        <div className={styles.cardsGrid}>
          {workspaces.map((workspace, index) => (
            <motion.div
              key={workspace.id}
              className={`${styles.card} ${
                selectedWorkspace === workspace.id ? styles.cardSelected : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => setSelectedWorkspace(workspace.id)}
            >
              <div className={styles.cardIcon}>{workspace.icon}</div>
              <h3 className={styles.cardTitle}>{workspace.name}</h3>
              <p className={styles.cardDescription}>{workspace.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.bookingBox}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className={styles.bookingGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="work-date">Date</label>
              <input
                id="work-date"
                type="date"
                value={workDate}
                onChange={(e) => setWorkDate(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="start-time">Start Time</label>
              <input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="end-time">End Time</label>
              <input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="work-members">Members</label>
              <input
                id="work-members"
                type="number"
                min="1"
                max="20"
                value={members}
                onChange={(e) => setMembers(parseInt(e.target.value) || 1)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.toggleGroup}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={combineWithStay}
                onChange={(e) => setCombineWithStay(e.target.checked)}
                className={styles.toggle}
              />
              <span>Combine with Stay</span>
            </label>
          </div>

          {combineWithStay && (
            <motion.div
              className={styles.combineBox}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className={styles.inputGroup}>
                <label htmlFor="accommodation">Accommodation</label>
                <select id="accommodation" className={styles.input}>
                  <option value="">Select accommodation</option>
                  <option value="villa">Private Villa</option>
                  <option value="cottage">Cottage</option>
                  <option value="tent">Tent</option>
                  <option value="treehouse">Tree House</option>
                </select>
              </div>
              <div className={styles.bookingGrid}>
                <div className={styles.inputGroup}>
                  <label htmlFor="combine-checkin">Check-in</label>
                  <input
                    id="combine-checkin"
                    type="date"
                    className={styles.input}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor="combine-checkout">Check-out</label>
                  <input
                    id="combine-checkout"
                    type="date"
                    className={styles.input}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!selectedWorkspace}
          >
            Save Work Plan
          </button>
        </motion.div>
      </div>
    </section>
  );
};

