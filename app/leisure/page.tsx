"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import "./leisure.css";

// Activity types
const sportsActivities = [
  {
    id: "archery",
    name: "Archery",
    description: "Master precision and focus in our forest archery range",
    difficulty: "Moderate",
    groupSize: "1-4",
    icon: "🏹",
    gradient: "linear-gradient(135deg, #3dd598 0%, #6de3b4 100%)",
    glowColor: "rgba(61, 213, 152, 0.4)",
  },
  {
    id: "football",
    name: "Football",
    description: "Play on our natural grass field surrounded by mountains",
    difficulty: "High",
    groupSize: "4-22",
    icon: "⚽",
    gradient: "linear-gradient(135deg, #0091ff 0%, #4fc3f7 100%)",
    glowColor: "rgba(0, 145, 255, 0.5)",
  },
  {
    id: "kayaking",
    name: "Kayaking",
    description: "Paddle through serene waters with mountain views",
    difficulty: "Moderate",
    groupSize: "1-6",
    icon: "🛶",
    gradient: "linear-gradient(135deg, #00f5c8 0%, #92f0ff 100%)",
    glowColor: "rgba(0, 245, 200, 0.4)",
  },
  {
    id: "volleyball",
    name: "Volleyball",
    description: "Beach-style volleyball in nature's playground",
    difficulty: "Moderate",
    groupSize: "4-12",
    icon: "🏐",
    gradient: "linear-gradient(135deg, #ff8a50 0%, #ffb380 100%)",
    glowColor: "rgba(255, 138, 80, 0.4)",
  },
];

const adventureActivities = [
  {
    id: "atv",
    name: "ATV Ride",
    description: "Explore rugged trails on all-terrain vehicles",
    bestTime: "Morning",
    groupType: "Group",
    icon: "🏍️",
    gradient: "linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)",
    glowColor: "rgba(167, 139, 250, 0.4)",
  },
  {
    id: "fishing",
    name: "Fishing",
    description: "Peaceful angling in our pristine lake",
    bestTime: "Morning",
    groupType: "Solo/Group",
    icon: "🎣",
    gradient: "linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)",
    glowColor: "rgba(56, 189, 248, 0.4)",
  },
  {
    id: "gardening",
    name: "Gardening",
    description: "Connect with earth through hands-on cultivation",
    bestTime: "Morning",
    groupType: "Solo/Group",
    icon: "🌱",
    gradient: "linear-gradient(135deg, #3dd598 0%, #6de3b4 100%)",
    glowColor: "rgba(61, 213, 152, 0.4)",
  },
  {
    id: "kite-flying",
    name: "Kite Flying",
    description: "Soar colorful kites in open meadows",
    bestTime: "Evening",
    groupType: "Solo/Group",
    icon: "🪁",
    gradient: "linear-gradient(135deg, #ff6b9d 0%, #ff94b8 100%)",
    glowColor: "rgba(255, 107, 157, 0.4)",
  },
];

const mindfulActivities = [
  {
    id: "library",
    name: "Meditative Library",
    description: "Quiet reading space with nature views",
    duration: "1-3 hours",
    bestTime: "Anytime",
    icon: "📚",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    glowColor: "rgba(99, 102, 241, 0.4)",
  },
  {
    id: "painting",
    name: "Painting",
    description: "Express creativity in our art studio",
    duration: "2-4 hours",
    bestTime: "Morning",
    icon: "🎨",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
    glowColor: "rgba(236, 72, 153, 0.4)",
  },
  {
    id: "stargazing",
    name: "Stargazing",
    description: "Witness the cosmos under clear mountain skies",
    duration: "1-2 hours",
    bestTime: "Night",
    icon: "⭐",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)",
    glowColor: "rgba(14, 165, 233, 0.4)",
  },
  {
    id: "yoga",
    name: "Yoga",
    description: "Find balance and peace in nature's embrace",
    duration: "1 hour",
    bestTime: "Sunrise/Sunset",
    icon: "🧘",
    gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
    glowColor: "rgba(16, 185, 129, 0.4)",
  },
];

// Combine all activities for booking
const allActivities = [
  ...sportsActivities,
  ...adventureActivities,
  ...mindfulActivities,
];

interface SelectedActivity {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export default function LeisurePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState("");
  const [members, setMembers] = useState(1);
  const [selectedActivities, setSelectedActivities] = useState<SelectedActivity[]>([
    { id: "", name: "", startTime: "", endTime: "" },
  ]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  // Get tomorrow's date as minimum
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const handleAddActivity = () => {
    setSelectedActivities([
      ...selectedActivities,
      { id: "", name: "", startTime: "", endTime: "" },
    ]);
  };

  const handleActivityChange = (index: number, field: keyof SelectedActivity, value: string) => {
    const updated = [...selectedActivities];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-fill name when activity ID is selected
    if (field === "id") {
      const activity = allActivities.find(a => a.id === value);
      updated[index].name = activity?.name || "";
    }
    
    setSelectedActivities(updated);
  };

  const handleRemoveActivity = (index: number) => {
    if (selectedActivities.length > 1) {
      setSelectedActivities(selectedActivities.filter((_, i) => i !== index));
    }
  };

  const handleProceedToBooking = () => {
    if (!selectedDate || selectedActivities.some(a => !a.id || !a.startTime || !a.endTime)) {
      return;
    }

    // Store booking data
    sessionStorage.setItem(
      "leisureBookingData",
      JSON.stringify({
        date: selectedDate,
        members,
        activities: selectedActivities.filter(a => a.id),
      })
    );

    router.push("/leisure/booking");
  };

  const isValidBooking = selectedDate && 
    selectedActivities.every(a => a.id && a.startTime && a.endTime) &&
    selectedActivities.some(a => a.id);

  return (
    <div ref={containerRef} className="leisure-page">
      <PageHeader currentPage="leisure" pageTitle="Leisure at ZHISUSA" />
      
      {/* Hero Section */}
      <motion.section
        className="leisure-hero"
        style={{
          opacity: heroOpacity,
          scale: heroScale,
        }}
      >
        <div className="leisure-hero__content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="leisure-hero__title">Leisure at ZHISUSA</h1>
            <p className="leisure-hero__tagline">Play, pause, and reconnect</p>
            <p className="leisure-hero__description">
              Immerse yourself in curated experiences that blend adventure, creativity, and mindful moments.
              From active sports to peaceful reflection, discover your perfect rhythm in nature.
            </p>
          </motion.div>

          <motion.button
            className="leisure-hero__cta"
            onClick={() => {
              document.querySelector(".leisure-sports")?.scrollIntoView({ behavior: "smooth" });
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Activities
          </motion.button>
        </div>

        {/* Animated background elements */}
        <div className="leisure-hero__bg-elements">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="leisure-hero__particle"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 20, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + Math.sin(i) * 20}%`,
              }}
            />
          ))}
        </div>
      </motion.section>

      {/* Sports Zone Section */}
      <section className="leisure-sports">
        <motion.div
          className="leisure-section__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="leisure-section__title">Sports in Nature</h2>
          <p className="leisure-section__subtitle">
            Active adventures in the great outdoors
          </p>
        </motion.div>

        <div className="leisure-activities__grid">
          {sportsActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="leisure-activity-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div
                className="leisure-activity-card__glow"
                style={{
                  background: activity.gradient,
                  boxShadow: `0 20px 60px ${activity.glowColor}`,
                }}
              />
              
              <div className="leisure-activity-card__content">
                <div className="leisure-activity-card__icon">{activity.icon}</div>
                <h3 className="leisure-activity-card__name">{activity.name}</h3>
                <p className="leisure-activity-card__description">{activity.description}</p>
                
                <div className="leisure-activity-card__meta">
                  <span className="leisure-activity-card__badge">
                    {activity.difficulty}
                  </span>
                  <span className="leisure-activity-card__badge">
                    {activity.groupSize} people
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Adventure Section */}
      <section className="leisure-adventure">
        <motion.div
          className="leisure-section__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="leisure-section__title">Outdoor Experiences</h2>
          <p className="leisure-section__subtitle">
            Hands-on adventures and exploration
          </p>
        </motion.div>

        <div className="leisure-activities__grid">
          {adventureActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="leisure-activity-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div
                className="leisure-activity-card__glow"
                style={{
                  background: activity.gradient,
                  boxShadow: `0 20px 60px ${activity.glowColor}`,
                }}
              />
              
              <div className="leisure-activity-card__content">
                <div className="leisure-activity-card__icon">{activity.icon}</div>
                <h3 className="leisure-activity-card__name">{activity.name}</h3>
                <p className="leisure-activity-card__description">{activity.description}</p>
                
                <div className="leisure-activity-card__meta">
                  <span className="leisure-activity-card__badge">
                    {activity.bestTime}
                  </span>
                  <span className="leisure-activity-card__badge">
                    {activity.groupType}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mindful Section */}
      <section className="leisure-mindful">
        <motion.div
          className="leisure-section__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="leisure-section__title">Slow Down & Breathe</h2>
          <p className="leisure-section__subtitle">
            Mindful moments and creative expression
          </p>
        </motion.div>

        <div className="leisure-activities__grid">
          {mindfulActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              className="leisure-activity-card leisure-activity-card--mindful"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div
                className="leisure-activity-card__glow"
                style={{
                  background: activity.gradient,
                  boxShadow: `0 20px 60px ${activity.glowColor}`,
                }}
              />
              
              <div className="leisure-activity-card__content">
                <div className="leisure-activity-card__icon">{activity.icon}</div>
                <h3 className="leisure-activity-card__name">{activity.name}</h3>
                <p className="leisure-activity-card__description">{activity.description}</p>
                
                <div className="leisure-activity-card__meta">
                  <span className="leisure-activity-card__badge">
                    {activity.duration}
                  </span>
                  <span className="leisure-activity-card__badge">
                    {activity.bestTime}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Booking Form Section */}
      <section className="leisure-booking">
        <motion.div
          className="leisure-section__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="leisure-section__title">Book Your Leisure Slot</h2>
          <p className="leisure-section__subtitle">
            Select activities and reserve your experience
          </p>
        </motion.div>

        <motion.div
          className="leisure-booking__form-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="leisure-booking__form">
            <div className="leisure-booking__field">
              <label>Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={minDateStr}
              />
            </div>

            <div className="leisure-booking__field">
              <label>Number of Members</label>
              <div className="leisure-booking__counter">
                <button
                  onClick={() => setMembers(Math.max(1, members - 1))}
                  disabled={members <= 1}
                >
                  −
                </button>
                <span>{members}</span>
                <button
                  onClick={() => setMembers(Math.min(20, members + 1))}
                  disabled={members >= 20}
                >
                  +
                </button>
              </div>
            </div>

            <div className="leisure-booking__activities">
              <label>Activities</label>
              {selectedActivities.map((activity, index) => (
                <div key={index} className="leisure-booking__activity-row">
                  <div className="leisure-booking__activity-select">
                    <select
                      value={activity.id}
                      onChange={(e) => handleActivityChange(index, "id", e.target.value)}
                    >
                      <option value="">Select Activity</option>
                      {allActivities.map((act) => (
                        <option key={act.id} value={act.id}>
                          {act.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="leisure-booking__time-row">
                    <div className="leisure-booking__time-field">
                      <label>Start Time</label>
                      <input
                        type="time"
                        value={activity.startTime}
                        onChange={(e) => handleActivityChange(index, "startTime", e.target.value)}
                        disabled={!activity.id}
                      />
                    </div>

                    <div className="leisure-booking__time-field">
                      <label>End Time</label>
                      <input
                        type="time"
                        value={activity.endTime}
                        onChange={(e) => handleActivityChange(index, "endTime", e.target.value)}
                        disabled={!activity.id}
                      />
                    </div>
                  </div>

                  {selectedActivities.length > 1 && (
                    <button
                      className="leisure-booking__remove"
                      onClick={() => handleRemoveActivity(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}

              <button
                className="leisure-booking__add"
                onClick={handleAddActivity}
              >
                + Add Another Activity
              </button>
            </div>

            {isValidBooking && (
              <motion.div
                className="leisure-booking__summary"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3>Selected Activities</h3>
                {selectedActivities
                  .filter(a => a.id)
                  .map((activity, index) => (
                    <div key={index} className="leisure-booking__summary-item">
                      <span>{activity.name}</span>
                      <span>{activity.startTime} - {activity.endTime}</span>
                    </div>
                  ))}
              </motion.div>
            )}

            <motion.button
              className="leisure-booking__submit"
              onClick={handleProceedToBooking}
              disabled={!isValidBooking}
              whileHover={{ scale: isValidBooking ? 1.02 : 1 }}
              whileTap={{ scale: isValidBooking ? 0.98 : 1 }}
            >
              Proceed to Booking
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <div className="leisure-page__footer">
        <Link href="/" className="leisure-page__back-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

