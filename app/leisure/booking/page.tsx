"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import "../leisure.css";

interface LeisureBookingData {
  date: string;
  members: number;
  activities: Array<{
    id: string;
    name: string;
    startTime: string;
    endTime: string;
  }>;
}

export default function LeisureBookingPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<LeisureBookingData | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    const stored = sessionStorage.getItem("leisureBookingData");
    if (!stored) {
      router.push("/leisure");
      return;
    }
    setBookingData(JSON.parse(stored));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingData || !name || !email || !phone) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/booking/leisure", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: bookingData.date,
          members: bookingData.members,
          activities: bookingData.activities,
          name,
          email,
          phone,
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        sessionStorage.removeItem("leisureBookingData");
        setTimeout(() => {
          router.push("/leisure");
        }, 2000);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="leisure-page">
        <PageHeader currentPage="leisure" pageTitle="Leisure Booking" />
        <div style={{ padding: "120px 24px", textAlign: "center" }}>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="leisure-page">
      <PageHeader currentPage="leisure" pageTitle="Leisure Booking" />
      
      <section className="leisure-booking-confirm">
        <motion.div
          className="leisure-booking-confirm__container"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="leisure-booking-confirm__title">Confirm Your Leisure Booking</h1>

          {/* Booking Summary */}
          <div className="leisure-booking-confirm__summary">
            <h2 className="leisure-booking-confirm__summary-title">Booking Summary</h2>
            
            <div className="leisure-booking-confirm__summary-item">
              <span className="leisure-booking-confirm__summary-label">Date</span>
              <span className="leisure-booking-confirm__summary-value">
                {formatDate(bookingData.date)}
              </span>
            </div>

            <div className="leisure-booking-confirm__summary-item">
              <span className="leisure-booking-confirm__summary-label">Members</span>
              <span className="leisure-booking-confirm__summary-value">
                {bookingData.members} {bookingData.members === 1 ? "person" : "people"}
              </span>
            </div>

            <div className="leisure-booking-confirm__summary-item">
              <span className="leisure-booking-confirm__summary-label">Activities</span>
              <div className="leisure-booking-confirm__activities">
                {bookingData.activities.map((activity, index) => (
                  <div key={index} className="leisure-booking-confirm__activity">
                    <span className="leisure-booking-confirm__activity-name">
                      {activity.name}
                    </span>
                    <span className="leisure-booking-confirm__activity-time">
                      {activity.startTime} - {activity.endTime}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form className="leisure-booking-confirm__form" onSubmit={handleSubmit}>
            <h2 className="leisure-booking-confirm__form-title">Your Details</h2>

            <div className="leisure-booking-confirm__form-field">
              <label>Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="leisure-booking-confirm__form-field">
              <label>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="leisure-booking-confirm__form-field">
              <label>Phone *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+91 1234567890"
              />
            </div>

            {submitStatus === "success" && (
              <motion.div
                className="leisure-booking-confirm__success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ✓ Booking request sent successfully! Redirecting...
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                className="leisure-booking-confirm__error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ✗ Failed to send booking request. Please try again.
              </motion.div>
            )}

            <motion.button
              type="submit"
              className="leisure-booking-confirm__submit"
              disabled={isSubmitting || !name || !email || !phone}
              whileHover={{ scale: !isSubmitting && name && email && phone ? 1.02 : 1 }}
              whileTap={{ scale: !isSubmitting && name && email && phone ? 0.98 : 1 }}
            >
              {isSubmitting ? "Submitting..." : "Confirm Leisure Booking"}
            </motion.button>
          </form>

          <Link href="/leisure" className="leisure-booking-confirm__back">
            ← Back to Activities
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

