"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import "./booking.css";

interface WorkBookingData {
  bookingMode: "workspace" | "combined";
  workspaceType: string | null;
  date: string | null;
  members: number;
  checkInTime: string | null;
  checkOutTime: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
  accommodationType: string | null;
  price: number;
}

export default function WorkBookingPage() {
  const [bookingData, setBookingData] = useState<WorkBookingData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const storedData = sessionStorage.getItem("workBookingData");
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

  const getWorkspaceName = (type: string | null) => {
    if (!type) return "";
    const names: Record<string, string> = {
      privateOffice: "Private Office",
      coWorking: "Co-Working Space",
      conferenceRoom: "Conference Room",
    };
    return names[type] || type;
  };

  const getAccommodationName = (type: string | null) => {
    if (!type) return "";
    const names: Record<string, string> = {
      cottages: "Cottages",
      tents: "Luxury Tents",
      villas: "Private Villas",
      treehouses: "Tree Houses",
    };
    return names[type] || type;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/booking/work", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          ...bookingData,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setName("");
        setEmail("");
        setPhone("");
        sessionStorage.removeItem("workBookingData");
        
        setTimeout(() => {
          window.location.href = "/work";
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
      <div className="work-booking-page">
        <PageHeader currentPage="work" pageTitle="Work Booking" />
        <div className="work-booking-page__container">
          <motion.div
            className="work-booking-page__empty"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1>No Booking Data Found</h1>
            <p>Please select a workspace and dates from the Work page.</p>
            <Link href="/work" className="work-booking-page__back-button">
              Go to Work Page
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="work-booking-page">
      <PageHeader currentPage="work" pageTitle="Complete Your Booking" />
      <div className="work-booking-page__container">
        <motion.div
          className="work-booking-page__header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/work" className="work-booking-page__back">
            ← Back
          </Link>
          <h1 className="work-booking-page__title">Complete Your Booking</h1>
          <p className="work-booking-page__subtitle">
            You're one step away from your perfect workspace
          </p>
        </motion.div>

        <div className="work-booking-page__content">
          {/* Booking Summary */}
          <motion.div
            className="work-booking-summary"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="work-booking-summary__title">Booking Summary</h2>

            <div className="work-booking-summary__card">
              {bookingData.bookingMode === "workspace" ? (
                <>
                  <div className="work-booking-summary__section">
                    <h3>Workspace Booking</h3>
                    <div className="work-booking-summary__detail">
                      <span className="work-booking-summary__detail-icon">🏢</span>
                      <div>
                        <p className="work-booking-summary__detail-label">Workspace</p>
                        <p className="work-booking-summary__detail-value">
                          {getWorkspaceName(bookingData.workspaceType)}
                        </p>
                      </div>
                    </div>

                    {bookingData.date && (
                      <div className="work-booking-summary__detail">
                        <span className="work-booking-summary__detail-icon">📅</span>
                        <div>
                          <p className="work-booking-summary__detail-label">Date</p>
                          <p className="work-booking-summary__detail-value">
                            {formatDate(bookingData.date)}
                          </p>
                        </div>
                      </div>
                    )}

                    {bookingData.checkInTime && bookingData.checkOutTime && (
                      <div className="work-booking-summary__detail">
                        <span className="work-booking-summary__detail-icon">⏰</span>
                        <div>
                          <p className="work-booking-summary__detail-label">Time</p>
                          <p className="work-booking-summary__detail-value">
                            {bookingData.checkInTime} - {bookingData.checkOutTime}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="work-booking-summary__detail">
                      <span className="work-booking-summary__detail-icon">👥</span>
                      <div>
                        <p className="work-booking-summary__detail-label">Members</p>
                        <p className="work-booking-summary__detail-value">
                          {bookingData.members} {bookingData.members === 1 ? "Person" : "People"}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="work-booking-summary__section">
                    <h3>Work + Stay Package</h3>
                    <div className="work-booking-summary__detail">
                      <span className="work-booking-summary__detail-icon">🏠</span>
                      <div>
                        <p className="work-booking-summary__detail-label">Accommodation</p>
                        <p className="work-booking-summary__detail-value">
                          {getAccommodationName(bookingData.accommodationType)}
                        </p>
                      </div>
                    </div>

                    {bookingData.checkInDate && bookingData.checkOutDate && (
                      <>
                        <div className="work-booking-summary__detail">
                          <span className="work-booking-summary__detail-icon">📅</span>
                          <div>
                            <p className="work-booking-summary__detail-label">Check-In</p>
                            <p className="work-booking-summary__detail-value">
                              {formatDate(bookingData.checkInDate)}
                            </p>
                          </div>
                        </div>

                        <div className="work-booking-summary__detail">
                          <span className="work-booking-summary__detail-icon">📅</span>
                          <div>
                            <p className="work-booking-summary__detail-label">Check-Out</p>
                            <p className="work-booking-summary__detail-value">
                              {formatDate(bookingData.checkOutDate)}
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="work-booking-summary__detail">
                      <span className="work-booking-summary__detail-icon">👥</span>
                      <div>
                        <p className="work-booking-summary__detail-label">Members</p>
                        <p className="work-booking-summary__detail-value">
                          {bookingData.members} {bookingData.members === 1 ? "Person" : "People"}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="work-booking-summary__divider" />

              <div className="work-booking-summary__pricing">
                <div className="work-booking-summary__total">
                  <span>Total</span>
                  <span>₹{bookingData.price.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booking Form */}
          <motion.div
            className="work-booking-form-container"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="work-booking-form__title">Contact Information</h2>

            <form className="work-booking-form" onSubmit={handleSubmit}>
              <div className="work-booking-form__field">
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

              <div className="work-booking-form__field">
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

              <div className="work-booking-form__field">
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

              <div className="work-booking-form__info">
                <p>
                  By proceeding, you agree to our terms and conditions. We'll send a
                  confirmation email with all the booking details.
                </p>
              </div>

              {submitStatus === "success" && (
                <motion.div
                  className="work-booking-form__success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ✓ Booking request submitted successfully! Redirecting...
                </motion.div>
              )}

              {submitStatus === "error" && (
                <motion.div
                  className="work-booking-form__error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ✗ Failed to submit booking. Please try again.
                </motion.div>
              )}

              <motion.button
                type="submit"
                className="work-booking-form__submit"
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


