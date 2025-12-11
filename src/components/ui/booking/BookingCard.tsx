"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

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
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [modalStep, setModalStep] = useState<"form" | "success">("form");
  const [error, setError] = useState("");

  const isPastDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const picked = new Date(dateStr);
    picked.setHours(0, 0, 0, 0);
    return picked < today;
  };

  const hasMinimumStay = (inStr: string, outStr: string) => {
    const inDate = new Date(inStr);
    const outDate = new Date(outStr);
    const diff = outDate.getTime() - inDate.getTime();
    return diff >= 24 * 60 * 60 * 1000; // at least one night
  };

  const handleContinue = () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates");
      return;
    }

    if (isPastDate(checkIn) || isPastDate(checkOut)) {
      alert("Dates cannot be in the past");
      return;
    }

    if (!hasMinimumStay(checkIn, checkOut)) {
      alert("Please select at least a 1-night stay");
      return;
    }

    setShowModal(true);
    setModalStep("form");
  };

  const handleSubmit = async () => {
    if (!name || !email || !phone) {
      alert("Please fill name, email, and phone");
      return;
    }

    setError("");
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
          name,
          email,
          phone,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        setButtonText("Booking Sent!");
        setModalStep("success");
        setTimeout(() => {
          setButtonText("View Availability");
          setCheckIn("");
          setCheckOut("");
          setName("");
          setEmail("");
          setPhone("");
          setShowModal(false);
        }, 3000);
      } else {
        const message =
          (data && (data.error || data.message)) ||
          "Failed to send request. Please try again.";
        setError(message);
        setButtonText("Error - Try Again");
        setTimeout(() => {
          setButtonText("View Availability");
        }, 3000);
      }
    } catch (error) {
      console.error("Booking error:", error);
      setError("Network error. Please try again.");
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
  const nextDay = checkIn
    ? new Date(new Date(checkIn).getTime() + 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0]
    : today;

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
                min={nextDay}
                required
              />
            </div>
          </div>
          <button
            type="button"
            className="booking-card__button"
            onClick={handleContinue}
            disabled={isSubmitting}
          >
            {buttonText}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="booking-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="booking-modal__card"
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {modalStep === "form" && (
                <>
                  <div className="booking-modal__header">
                    <h4>Share your details</h4>
                    <p>We’ll confirm availability and tailor your stay.</p>
                  </div>
                  {error && <div className="booking-modal__error">{error}</div>}
                  <div className="booking-modal__form">
                    <label>
                      Name
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </label>
                    <label>
                      Email
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </label>
                    <label>
                      Phone
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 555 123 4567"
                      />
                    </label>
                  </div>
                  <div className="booking-modal__actions">
                    <button
                      type="button"
                      className="booking-modal__secondary"
                      onClick={() => setShowModal(false)}
                      disabled={isSubmitting}
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="booking-modal__primary"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Continue"}
                    </button>
                  </div>
                </>
              )}

              {modalStep === "success" && (
                <div className="booking-modal__success">
                  <h4>Availability request sent</h4>
                  <p>Our team will contact you soon with next steps.</p>
                  <button
                    type="button"
                    className="booking-modal__primary"
                    onClick={() => setShowModal(false)}
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BookingCard;

