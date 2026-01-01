"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import "./booking.css";

interface BookingData {
  stayType: string;
  stayName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
}

export default function BookingPage() {
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    // Retrieve booking data from sessionStorage
    const storedData = sessionStorage.getItem("bookingData");
    if (storedData) {
      setBookingData(JSON.parse(storedData));
    }
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/booking/live", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          stayType: bookingData.stayType,
          stayName: bookingData.stayName,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          guests: bookingData.guests,
          nights: bookingData.nights,
          pricePerNight: bookingData.pricePerNight,
          totalPrice: bookingData.totalPrice,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Clear form
        setName("");
        setEmail("");
        setPhone("");
        // Clear session storage
        sessionStorage.removeItem("bookingData");
        
        // Redirect to success page after 2 seconds
        setTimeout(() => {
          window.location.href = "/live";
        }, 3000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="booking-page">
        <div className="booking-page__container">
          <motion.div
            className="booking-page__empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>No Booking Data Found</h1>
            <p>Please select a stay type and dates from the Live page.</p>
            <Link href="/live" className="booking-page__back-button">
              Go to Live Page
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <PageHeader currentPage="live" pageTitle="Complete Your Booking" />
      <div className="booking-page__container">
        <motion.div
          className="booking-page__header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/live" className="booking-page__back">
            ← Back
          </Link>
          <h1 className="booking-page__title">Complete Your Booking</h1>
          <p className="booking-page__subtitle">
            You're just one step away from an unforgettable experience
          </p>
        </motion.div>

        <div className="booking-page__content">
          {/* Booking Summary */}
          <motion.div
            className="booking-summary"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="booking-summary__title">Booking Summary</h2>

            <div className="booking-summary__card">
              <div className="booking-summary__stay">
                <h3>{bookingData.stayName}</h3>
                <span className="booking-summary__type">{bookingData.stayType}</span>
              </div>

              <div className="booking-summary__divider" />

              <div className="booking-summary__details">
                <div className="booking-summary__detail">
                  <span className="booking-summary__detail-icon">📅</span>
                  <div>
                    <p className="booking-summary__detail-label">Check-In</p>
                    <p className="booking-summary__detail-value">
                      {formatDate(bookingData.checkIn)}
                    </p>
                  </div>
                </div>

                <div className="booking-summary__detail">
                  <span className="booking-summary__detail-icon">📅</span>
                  <div>
                    <p className="booking-summary__detail-label">Check-Out</p>
                    <p className="booking-summary__detail-value">
                      {formatDate(bookingData.checkOut)}
                    </p>
                  </div>
                </div>

                <div className="booking-summary__detail">
                  <span className="booking-summary__detail-icon">🌙</span>
                  <div>
                    <p className="booking-summary__detail-label">Duration</p>
                    <p className="booking-summary__detail-value">
                      {bookingData.nights} Night{bookingData.nights > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="booking-summary__detail">
                  <span className="booking-summary__detail-icon">👥</span>
                  <div>
                    <p className="booking-summary__detail-label">Guests</p>
                    <p className="booking-summary__detail-value">
                      {bookingData.guests} Guest{bookingData.guests > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="booking-summary__divider" />

              <div className="booking-summary__pricing">
                <div className="booking-summary__price-row">
                  <span>
                    ₹{bookingData.pricePerNight.toLocaleString()} × {bookingData.nights} night{bookingData.nights > 1 ? "s" : ""}
                  </span>
                  <span>₹{bookingData.totalPrice.toLocaleString()}</span>
                </div>
                <div className="booking-summary__total">
                  <span>Total</span>
                  <span>₹{bookingData.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="booking-summary__note">
              <p>🌿 Breakfast included</p>
              <p>✓ Free cancellation up to 48 hours before check-in</p>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            className="booking-form-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="booking-form__title">Guest Information</h2>

            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="booking-form__field">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="booking-form__field">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="booking-form__field">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div className="booking-form__info">
                <p>
                  By proceeding, you agree to our terms and conditions. We'll send a
                  confirmation email with all the booking details.
                </p>
              </div>

              {submitStatus === "success" && (
                <motion.div
                  className="booking-form__success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ✓ Booking request submitted successfully! Redirecting...
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  className="booking-form__error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ✗ Failed to submit booking. Please try again.
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="booking-form__submit"
                disabled={isSubmitting || submitStatus === "success"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? "Processing..." : "Confirm Booking"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

