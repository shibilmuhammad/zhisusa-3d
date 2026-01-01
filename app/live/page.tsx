"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import "./live.css";

// Stay types data
const stayTypes = [
  {
    id: "cottages",
    name: "Cottages",
    tagline: "Rustic Elegance",
    description: "Cozy wooden sanctuaries nestled in nature's embrace",
    gradient: "linear-gradient(135deg, #ff8a50 0%, #ffb380 100%)",
    glowColor: "rgba(255, 138, 80, 0.4)",
  },
  {
    id: "tents",
    name: "Luxury Tents",
    tagline: "Canvas Dreams",
    description: "Glamping redefined with modern comforts",
    gradient: "linear-gradient(135deg, #3dd598 0%, #6de3b4 100%)",
    glowColor: "rgba(61, 213, 152, 0.4)",
  },
  {
    id: "villas",
    name: "Private Villas",
    tagline: "Ultimate Luxury",
    description: "Exclusive spaces for unforgettable experiences",
    gradient: "linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)",
    glowColor: "rgba(167, 139, 250, 0.4)",
  },
  {
    id: "treehouses",
    name: "Tree Houses",
    tagline: "Elevated Living",
    description: "Sleep among the canopy, wake to birdsong",
    gradient: "linear-gradient(135deg, #0091ff 0%, #4fc3f7 100%)",
    glowColor: "rgba(0, 145, 255, 0.5)",
  },
];

// Stay details for each type
const stayDetails = {
  cottages: {
    roomSize: "450 sq ft",
    beds: "1 King / 2 Queen",
    breakfast: true,
    pricePerNight: 12000,
    description: "Our cottages blend rustic charm with modern luxury. Hand-crafted wooden interiors, large windows overlooking the forest, and private outdoor seating areas create an intimate connection with nature.",
    amenities: [
      { icon: "📶", label: "High-Speed WiFi" },
      { icon: "❄️", label: "Climate Control" },
      { icon: "📺", label: "Smart TV" },
      { icon: "🌲", label: "Forest View" },
      { icon: "🔒", label: "Private Space" },
      { icon: "🔥", label: "Campfire Access" },
      { icon: "☕", label: "Tea/Coffee Maker" },
      { icon: "🛁", label: "Premium Bathroom" },
    ],
  },
  tents: {
    roomSize: "350 sq ft",
    beds: "1 Queen / 2 Twin",
    breakfast: true,
    pricePerNight: 8500,
    description: "Experience luxury camping like never before. Our spacious tents feature comfortable beds, ambient lighting, and elegant furnishings, offering a unique blend of adventure and comfort.",
    amenities: [
      { icon: "📶", label: "WiFi Available" },
      { icon: "💨", label: "Natural Cooling" },
      { icon: "🌌", label: "Stargazing Deck" },
      { icon: "🌿", label: "Garden View" },
      { icon: "🔒", label: "Private Area" },
      { icon: "🔥", label: "Campfire Setup" },
      { icon: "☕", label: "Coffee Station" },
      { icon: "🚿", label: "Attached Washroom" },
    ],
  },
  villas: {
    roomSize: "1200 sq ft",
    beds: "2 King + 1 Queen",
    breakfast: true,
    pricePerNight: 25000,
    description: "Our private villas offer the pinnacle of luxury accommodation. Spacious living areas, private pools, full kitchens, and panoramic views create an exclusive retreat for discerning guests.",
    amenities: [
      { icon: "📶", label: "Premium WiFi" },
      { icon: "❄️", label: "Full AC & Heating" },
      { icon: "📺", label: "Entertainment System" },
      { icon: "🏊", label: "Private Pool" },
      { icon: "🏠", label: "Full Privacy" },
      { icon: "🔥", label: "Private Fireplace" },
      { icon: "🍳", label: "Full Kitchen" },
      { icon: "🛋️", label: "Living Room" },
    ],
  },
  treehouses: {
    roomSize: "380 sq ft",
    beds: "1 King",
    breakfast: true,
    pricePerNight: 15000,
    description: "Elevated 15-20 feet above ground, our tree houses offer a truly unique perspective. Watch wildlife from your private balcony and drift to sleep to the sounds of the forest canopy.",
    amenities: [
      { icon: "📶", label: "WiFi Enabled" },
      { icon: "💨", label: "Natural Ventilation" },
      { icon: "🌳", label: "Canopy View" },
      { icon: "🦜", label: "Birdwatching Spot" },
      { icon: "🔒", label: "Secure Access" },
      { icon: "🔭", label: "Observatory Deck" },
      { icon: "☕", label: "Mini Bar" },
      { icon: "🛁", label: "Modern Bathroom" },
    ],
  },
};

export default function LivePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [selectedStay, setSelectedStay] = useState<string | null>("cottages"); // Default to cottages
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(2);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  // Handle stay type selection with smooth scroll
  const handleStaySelect = (stayId: string) => {
    setSelectedStay(stayId);
    
    // Scroll to details section smoothly after a brief delay
    setTimeout(() => {
      detailsRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }, 300);
  };

  // Get tomorrow's date as minimum check-in
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  // Calculate minimum checkout date (day after check-in)
  const minCheckoutDate = checkInDate
    ? new Date(new Date(checkInDate).getTime() + 86400000).toISOString().split("T")[0]
    : minDateStr;

  // Calculate nights and total price
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate || !selectedStay) return 0;
    const nights = Math.ceil(
      (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / 86400000
    );
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
  const totalPrice = selectedStay ? nights * stayDetails[selectedStay as keyof typeof stayDetails].pricePerNight : 0;

  const handleProceedToBooking = () => {
    if (!selectedStay || !checkInDate || !checkOutDate) return;
    
    // Store booking data in sessionStorage
    sessionStorage.setItem(
      "bookingData",
      JSON.stringify({
        stayType: selectedStay,
        stayName: stayTypes.find(s => s.id === selectedStay)?.name,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        nights,
        pricePerNight: stayDetails[selectedStay as keyof typeof stayDetails].pricePerNight,
        totalPrice,
      })
    );
    
    window.location.href = "/live/booking";
  };

  return (
    <div ref={containerRef} className="live-page">
      <PageHeader currentPage="live" pageTitle="Live at ZHISUSA" />
      
      {/* Hero Section */}
      <motion.section
        className="live-hero"
        style={{
          opacity: heroOpacity,
          scale: heroScale,
        }}
      >
        <div className="live-hero__content">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 className="live-hero__title">Live at ZHISUSA</h1>
            <p className="live-hero__tagline">Where Nature Meets Luxury</p>
            <p className="live-hero__description">
              Immerse yourself in curated living experiences designed to harmonize with the
              natural world. Each stay is a journey into tranquility, comfort, and authentic
              connection.
            </p>
          </motion.div>

          <motion.button
            className="live-hero__cta"
            onClick={() => {
              document.querySelector(".live-types")?.scrollIntoView({ behavior: "smooth" });
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Explore Living Options
          </motion.button>
        </div>

        {/* Animated background elements */}
        <div className="live-hero__bg-elements">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="live-hero__particle"
              animate={{
                y: [0, -30, 0],
                x: [0, Math.sin(i) * 20, 0],
                opacity: [0.3, 0.6, 0.3],
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

      {/* Stay Types Section */}
      <section className="live-types">
        <motion.div
          className="live-types__header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="live-types__title">Choose Your Sanctuary</h2>
          <p className="live-types__subtitle">
            Four unique ways to experience ZHISUSA
          </p>
          {selectedStay && (
            <motion.p 
              className="live-types__hint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              ↓ Scroll down to view details
            </motion.p>
          )}
        </motion.div>

        <div className="live-types__grid">
          {stayTypes.map((stay, index) => (
            <motion.div
              key={stay.id}
              className={`live-type-card ${selectedStay === stay.id ? "is-selected" : ""}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => handleStaySelect(stay.id)}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="live-type-card__glow"
                style={{
                  background: stay.gradient,
                  boxShadow: `0 20px 60px ${stay.glowColor}`,
                }}
              />
              
              <div className="live-type-card__content">
                <h3 className="live-type-card__name">{stay.name}</h3>
                <p className="live-type-card__tagline">{stay.tagline}</p>
                <p className="live-type-card__description">{stay.description}</p>
                
                <motion.button
                  className="live-type-card__button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedStay === stay.id ? "Selected ✓" : "Select"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Detailed Stay View */}
      <AnimatePresence mode="wait">
        {selectedStay && (
          <motion.section
            ref={detailsRef}
            className="live-details"
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ 
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
              height: { duration: 0.5 }
            }}
          >
            <div className="live-details__container">
              <motion.div
                className="live-details__showcase"
                key={`showcase-${selectedStay}`}
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30, scale: 0.95 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div
                  className="live-details__showcase-card"
                  style={{
                    background: stayTypes.find(s => s.id === selectedStay)?.gradient,
                  }}
                >
                  <div className="live-details__showcase-content">
                    <h3>{stayTypes.find(s => s.id === selectedStay)?.name}</h3>
                    <p>{stayTypes.find(s => s.id === selectedStay)?.tagline}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="live-details__info"
                key={`info-${selectedStay}`}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 30, scale: 0.95 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <h2 className="live-details__title">
                  {stayTypes.find(s => s.id === selectedStay)?.name}
                </h2>

                <div className="live-details__stats">
                  <div className="live-details__stat">
                    <span className="live-details__stat-icon">📏</span>
                    <div>
                      <p className="live-details__stat-label">Room Size</p>
                      <p className="live-details__stat-value">
                        {stayDetails[selectedStay as keyof typeof stayDetails].roomSize}
                      </p>
                    </div>
                  </div>

                  <div className="live-details__stat">
                    <span className="live-details__stat-icon">🛏️</span>
                    <div>
                      <p className="live-details__stat-label">Beds</p>
                      <p className="live-details__stat-value">
                        {stayDetails[selectedStay as keyof typeof stayDetails].beds}
                      </p>
                    </div>
                  </div>

                  <div className="live-details__stat">
                    <span className="live-details__stat-icon">🍳</span>
                    <div>
                      <p className="live-details__stat-label">Breakfast</p>
                      <p className="live-details__stat-value">
                        {stayDetails[selectedStay as keyof typeof stayDetails].breakfast
                          ? "Included"
                          : "Not Included"}
                      </p>
                    </div>
                  </div>

                  <div className="live-details__stat">
                    <span className="live-details__stat-icon">💰</span>
                    <div>
                      <p className="live-details__stat-label">Per Night</p>
                      <p className="live-details__stat-value">
                        ₹{stayDetails[selectedStay as keyof typeof stayDetails].pricePerNight.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <p className="live-details__description">
                  {stayDetails[selectedStay as keyof typeof stayDetails].description}
                </p>

                <div className="live-details__amenities">
                  <h3 className="live-details__amenities-title">Amenities</h3>
                  <div className="live-details__amenities-grid">
                    {stayDetails[selectedStay as keyof typeof stayDetails].amenities.map(
                      (amenity, index) => (
                        <motion.div
                          key={`${selectedStay}-amenity-${index}`}
                          className="live-details__amenity"
                          initial={{ opacity: 0, scale: 0.8, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ 
                            delay: 0.3 + index * 0.05,
                            duration: 0.4,
                            ease: [0.4, 0, 0.2, 1]
                          }}
                          whileHover={{ scale: 1.05, y: -2 }}
                        >
                          <span className="live-details__amenity-icon">{amenity.icon}</span>
                          <span className="live-details__amenity-label">{amenity.label}</span>
                        </motion.div>
                      )
                    )}
                  </div>
                </div>

                {/* Booking Form */}
                <div className="live-details__booking">
                  <h3 className="live-details__booking-title">Reserve Your Stay</h3>
                  
                  <div className="live-details__booking-form">
                    <div className="live-details__booking-row">
                      <div className="live-details__booking-field">
                        <label>Check-In</label>
                        <input
                          type="date"
                          value={checkInDate}
                          onChange={(e) => setCheckInDate(e.target.value)}
                          min={minDateStr}
                        />
                      </div>

                      <div className="live-details__booking-field">
                        <label>Check-Out</label>
                        <input
                          type="date"
                          value={checkOutDate}
                          onChange={(e) => setCheckOutDate(e.target.value)}
                          min={minCheckoutDate}
                          disabled={!checkInDate}
                        />
                      </div>
                    </div>

                    <div className="live-details__booking-field">
                      <label>Number of Guests</label>
                      <div className="live-details__booking-counter">
                        <button
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                          disabled={guests <= 1}
                        >
                          −
                        </button>
                        <span>{guests}</span>
                        <button
                          onClick={() => setGuests(Math.min(10, guests + 1))}
                          disabled={guests >= 10}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {nights > 0 && (
                      <motion.div
                        className="live-details__booking-summary"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div className="live-details__booking-summary-row">
                          <span>{nights} night{nights > 1 ? 's' : ''}</span>
                          <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="live-details__booking-summary-total">
                          <span>Total</span>
                          <span>₹{totalPrice.toLocaleString()}</span>
                        </div>
                      </motion.div>
                    )}

                    <motion.button
                      className="live-details__booking-submit"
                      onClick={handleProceedToBooking}
                      disabled={!checkInDate || !checkOutDate || nights === 0}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Proceed to Booking
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Back to Home Link */}
      <div className="live-page__footer">
        <Link href="/" className="live-page__back-link">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

