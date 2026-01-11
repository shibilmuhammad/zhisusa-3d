"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import styles from "./LiveSection.module.css";

const accommodations = [
  {
    id: "villa",
    name: "Private Villa",
    description: "Luxurious standalone villa with lake views and private deck",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop&q=80",
    fallbackImage: "/images/villa.jpg",
  },
  {
    id: "cottage",
    name: "Cottage",
    description: "Charming cottage nestled in nature with cozy interiors",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&h=600&fit=crop&q=80",
    fallbackImage: "/images/cottage.jpg",
  },
  {
    id: "tent",
    name: "Tent",
    description: "Eco-luxury tent experience under the stars",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop&q=80",
    fallbackImage: "/images/tent.jpg",
  },
  {
    id: "treehouse",
    name: "Tree House",
    description: "Elevated retreat among the trees with panoramic views",
    image: "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?w=800&h=600&fit=crop&q=80",
    fallbackImage: "/images/treehouse.jpg",
  },
];

interface LiveSectionProps {
  onContinue: (data: any) => void;
}

export const LiveSection = ({ onContinue }: LiveSectionProps) => {
  const [selectedAccommodation, setSelectedAccommodation] = useState<string>("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSave = () => {
    if (selectedAccommodation) {
      onContinue({
        accommodation: selectedAccommodation,
        checkIn,
        checkOut,
        guests,
      });
    }
  };

  return (
    <section id="section-live" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.zDecor}>Z</span>
          <h2 className={styles.title}>LIVE</h2>
          <span className={styles.zDecor}>Z</span>
        </motion.div>

        <div className={styles.cardsGrid}>
          {accommodations.map((acc, index) => (
            <motion.div
              key={acc.id}
              className={`${styles.card} ${
                selectedAccommodation === acc.id ? styles.cardSelected : ""
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              onClick={() => setSelectedAccommodation(acc.id)}
            >
              <div className={styles.cardImage}>
                <Image
                  src={acc.image}
                  alt={acc.name}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    // Fallback to gradient if image doesn't exist
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.classList.add(styles.imageFallback);
                    }
                  }}
                />
              </div>
              <h3 className={styles.cardTitle}>{acc.name}</h3>
              <p className={styles.cardDescription}>{acc.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.bookingBox}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className={styles.bookingGrid}>
            <div className={styles.inputGroup}>
              <label htmlFor="checkin">Check-in</label>
              <input
                id="checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="checkout">Check-out</label>
              <input
                id="checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="guests">Guests</label>
              <input
                id="guests"
                type="number"
                min="1"
                max="10"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                className={styles.input}
              />
            </div>
          </div>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={!selectedAccommodation}
          >
            Save & Continue
          </button>
        </motion.div>
      </div>
    </section>
  );
};

