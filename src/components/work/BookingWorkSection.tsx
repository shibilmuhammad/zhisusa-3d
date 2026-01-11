"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

const workspaceTypes = [
  { id: "privateOffice", name: "Private Office", price: 8000 },
  { id: "coWorking", name: "Co-Working Space", price: 2500 },
  { id: "conferenceRoom", name: "Conference Room", price: 5000 },
];

const accommodationTypes = [
  { id: "cottages", name: "Cottages" },
  { id: "tents", name: "Luxury Tents" },
  { id: "villas", name: "Private Villas" },
  { id: "treehouses", name: "Tree Houses" },
];

export const BookingWorkSection = () => {
  const router = useRouter();
  const [bookingMode, setBookingMode] = useState<"workspace" | "combined">("workspace");
  const [workspaceType, setWorkspaceType] = useState("");
  const [date, setDate] = useState("");
  const [members, setMembers] = useState(1);
  const [checkInTime, setCheckInTime] = useState("09:00");
  const [checkOutTime, setCheckOutTime] = useState("18:00");
  
  // Combined booking fields
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [accommodationType, setAccommodationType] = useState("");
  const [combinedMembers, setCombinedMembers] = useState(1);

  // Get tomorrow's date as minimum
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const calculatePrice = () => {
    if (bookingMode === "workspace") {
      const selectedWorkspace = workspaceTypes.find(w => w.id === workspaceType);
      if (!selectedWorkspace) return 0;
      
      if (workspaceType === "conferenceRoom") {
        // Conference room is hourly
        const start = parseInt(checkInTime.split(":")[0]);
        const end = parseInt(checkOutTime.split(":")[0]);
        const hours = Math.max(1, end - start);
        return selectedWorkspace.price * hours;
      } else {
        // Private office and co-working are daily
        return selectedWorkspace.price;
      }
    } else {
      // Combined booking - would need accommodation pricing
      return 0; // Placeholder
    }
  };

  const handleProceed = () => {
    const bookingData = {
      bookingMode,
      workspaceType: bookingMode === "workspace" ? workspaceType : null,
      date: bookingMode === "workspace" ? date : null,
      members: bookingMode === "workspace" ? members : combinedMembers,
      checkInTime: bookingMode === "workspace" ? checkInTime : null,
      checkOutTime: bookingMode === "workspace" ? checkOutTime : null,
      // Combined fields
      checkInDate: bookingMode === "combined" ? checkInDate : null,
      checkOutDate: bookingMode === "combined" ? checkOutDate : null,
      accommodationType: bookingMode === "combined" ? accommodationType : null,
      price: calculatePrice(),
    };

    sessionStorage.setItem("workBookingData", JSON.stringify(bookingData));
    router.push("/work/booking");
  };

  const canProceed = () => {
    if (bookingMode === "workspace") {
      return workspaceType && date && members > 0;
    } else {
      return checkInDate && checkOutDate && accommodationType && combinedMembers > 0;
    }
  };

  return (
    <section className="work-booking">
      <motion.div
        className="work-booking__header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="work-booking__title">Reserve Your Workspace</h2>
        <p className="work-booking__subtitle">
          Choose your preferred booking option
        </p>
      </motion.div>

      {/* Booking Mode Toggle */}
      <div className="work-booking__mode-toggle">
        <button
          className={`work-booking__mode-btn ${bookingMode === "workspace" ? "is-active" : ""}`}
          onClick={() => setBookingMode("workspace")}
        >
          Workspace Only
        </button>
        <button
          className={`work-booking__mode-btn ${bookingMode === "combined" ? "is-active" : ""}`}
          onClick={() => setBookingMode("combined")}
        >
          Work + Stay Together
        </button>
      </div>

      <div className="work-booking__form-container">
        <AnimatePresence mode="wait">
          {bookingMode === "workspace" ? (
            <motion.div
              key="workspace"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="work-booking__form"
            >
              <div className="work-booking__field">
                <label>Workspace Type *</label>
                <div className="work-booking__radio-group">
                  {workspaceTypes.map((type) => (
                    <label key={type.id} className="work-booking__radio">
                    <input
                      type="radio"
                      name="workspaceType"
                      value={type.id}
                      checked={workspaceType === type.id}
                      onChange={(e) => setWorkspaceType(e.target.value)}
                    />
                    <span>{type.name}</span>
                    <small>₹{type.price.toLocaleString()}{type.id === "conferenceRoom" ? "/hour" : "/day"}</small>
                  </label>
                  ))}
                </div>
              </div>

              <div className="work-booking__field">
                <label>Date *</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={minDateStr}
                />
              </div>

              <div className="work-booking__row">
                <div className="work-booking__field">
                  <label>Check-in Time *</label>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                  />
                </div>

                <div className="work-booking__field">
                  <label>Check-out Time *</label>
                  <input
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="work-booking__field">
                <label>Number of Members *</label>
                <div className="work-booking__counter">
                  <button
                    onClick={() => setMembers(Math.max(1, members - 1))}
                    disabled={members <= 1}
                  >
                    −
                  </button>
                  <span>{members}</span>
                  <button
                    onClick={() => setMembers(Math.min(50, members + 1))}
                    disabled={members >= 50}
                  >
                    +
                  </button>
                </div>
              </div>

              {workspaceType && date && (
                <motion.div
                  className="work-booking__summary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="work-booking__summary-row">
                    <span>Estimated Price</span>
                    <span>₹{calculatePrice().toLocaleString()}</span>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="combined"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="work-booking__form"
            >
              <div className="work-booking__field">
                <label>Accommodation Type *</label>
                <div className="work-booking__radio-group">
                  {accommodationTypes.map((type) => (
                    <label key={type.id} className="work-booking__radio">
                      <input
                        type="radio"
                        name="accommodationType"
                        value={type.id}
                        checked={accommodationType === type.id}
                        onChange={(e) => setAccommodationType(e.target.value)}
                      />
                      <span>{type.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="work-booking__row">
                <div className="work-booking__field">
                  <label>Check-in Date *</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={minDateStr}
                  />
                </div>

                <div className="work-booking__field">
                  <label>Check-out Date *</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    min={checkInDate || minDateStr}
                    disabled={!checkInDate}
                  />
                </div>
              </div>

              <div className="work-booking__field">
                <label>Number of Members *</label>
                <div className="work-booking__counter">
                  <button
                    onClick={() => setCombinedMembers(Math.max(1, combinedMembers - 1))}
                    disabled={combinedMembers <= 1}
                  >
                    −
                  </button>
                  <span>{combinedMembers}</span>
                  <button
                    onClick={() => setCombinedMembers(Math.min(20, combinedMembers + 1))}
                    disabled={combinedMembers >= 20}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="work-booking__info">
                <p>✨ This package includes both accommodation and workspace access for your entire stay.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className="work-booking__submit"
          onClick={handleProceed}
          disabled={!canProceed()}
          whileHover={{ scale: canProceed() ? 1.02 : 1 }}
          whileTap={{ scale: canProceed() ? 0.98 : 1 }}
        >
          Proceed to Booking
        </motion.button>
      </div>
    </section>
  );
};


