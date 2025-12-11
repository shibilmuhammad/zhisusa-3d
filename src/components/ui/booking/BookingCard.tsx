"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface BookingCardProps {
  highlight: boolean;
}

const variants = {
  initial: { opacity: 0, y: 32, scale: 0.98 },
  animate: (highlight: boolean) => ({
    opacity: highlight ? 1 : 0.75,
    y: highlight ? 0 : 12,
    scale: highlight ? 1 : 0.98,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  })
};

export const BookingCard = ({ highlight }: BookingCardProps) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonText, setButtonText] = useState("View Availability");

  const handleSubmit = async () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates");
      return;
    }

    setIsSubmitting(true);
    setButtonText("Sending...");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkIn,
          checkOut,
        }),
      });

      if (response.ok) {
        setButtonText("Booking Sent!");
        setTimeout(() => {
          setButtonText("View Availability");
          setCheckIn("");
          setCheckOut("");
        }, 3000);
      } else {
        setButtonText("Error - Try Again");
        setTimeout(() => {
          setButtonText("View Availability");
        }, 3000);
      }
    } catch (error) {
      console.error("Booking error:", error);
      setButtonText("Error - Try Again");
      setTimeout(() => {
        setButtonText("View Availability");
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <motion.div
      className="booking-card"
      variants={variants}
      initial="initial"
      animate="animate"
      custom={highlight}
    >
      <div className="booking-card__content">
        <span className="booking-card__label">Tailored Itineraries</span>
        <h3>Reserve Your Sanctuary</h3>
        <p>Select your dates and we will curate a work-live-leisure flow that aligns with your energy.</p>
        <div className="booking-card__cta">
          <div className="booking-card__dates-row">
            <div className="booking-card__dates">
              <label htmlFor="checkin">Check-in</label>
              <input
                id="checkin"
                type="date"
                className="booking-card__date-input"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={today}
                required
              />
            </div>
            <div className="booking-card__dates">
              <label htmlFor="checkout">Check-out</label>
              <input
                id="checkout"
                type="date"
                className="booking-card__date-input"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || today}
                required
              />
            </div>
          </div>
          <button
            type="button"
            className="booking-card__button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCard;

