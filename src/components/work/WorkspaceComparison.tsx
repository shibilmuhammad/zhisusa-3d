"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export interface WorkspaceFeature {
  label: string;
  privateOffice: string | number;
  coWorking: string | number;
  conferenceRoom: string | number;
  highlight?: "privateOffice" | "coWorking" | "conferenceRoom";
}

const workspaceFeatures: WorkspaceFeature[] = [
  {
    label: "Capacity",
    privateOffice: "1-2",
    coWorking: "5-20",
    conferenceRoom: "10-30",
  },
  {
    label: "Privacy Level",
    privateOffice: "High",
    coWorking: "Medium",
    conferenceRoom: "Low",
  },
  {
    label: "Noise Level",
    privateOffice: "Quiet",
    coWorking: "Moderate",
    conferenceRoom: "Controlled",
  },
  {
    label: "Best For",
    privateOffice: "Deep Focus",
    coWorking: "Collaboration",
    conferenceRoom: "Meetings",
  },
  {
    label: "Internet Speed",
    privateOffice: "1 Gbps",
    coWorking: "1 Gbps",
    conferenceRoom: "1 Gbps",
  },
  {
    label: "Nature Immersion",
    privateOffice: "High",
    coWorking: "Medium",
    conferenceRoom: "Medium",
  },
  {
    label: "Availability",
    privateOffice: "Full Day",
    coWorking: "Hourly/Daily",
    conferenceRoom: "Hourly",
  },
  {
    label: "Price Range",
    privateOffice: "₹8,000/day",
    coWorking: "₹2,500/day",
    conferenceRoom: "₹5,000/hour",
  },
];

const workspaceTypes = [
  {
    id: "privateOffice",
    name: "Private Offices",
    tagline: "Focused Solitude",
    description: "Dedicated spaces for uninterrupted deep work, surrounded by nature's tranquility.",
    gradient: "linear-gradient(135deg, #0091ff 0%, #4fc3f7 100%)",
    glowColor: "rgba(0, 145, 255, 0.5)",
    icon: "🏢",
  },
  {
    id: "coWorking",
    name: "Co-Working Spaces",
    tagline: "Collaborative Energy",
    description: "Open spaces designed for teamwork, creativity, and dynamic collaboration.",
    gradient: "linear-gradient(135deg, #3dd598 0%, #6de3b4 100%)",
    glowColor: "rgba(61, 213, 152, 0.4)",
    icon: "👥",
  },
  {
    id: "conferenceRoom",
    name: "Conference Rooms",
    tagline: "Professional Meetings",
    description: "Fully equipped spaces for presentations, discussions, and strategic planning.",
    gradient: "linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)",
    glowColor: "rgba(167, 139, 250, 0.4)",
    icon: "📊",
  },
];

export const WorkspaceComparison = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);

  return (
    <section className="work-workspaces">
      <motion.div
        className="work-workspaces__header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="work-workspaces__title">Choose Your Workspace</h2>
        <p className="work-workspaces__subtitle">
          Three distinct environments, each designed for different work styles
        </p>
      </motion.div>

      {/* Workspace Type Cards */}
      <div className="work-workspaces__grid">
        {workspaceTypes.map((workspace, index) => (
          <motion.div
            key={workspace.id}
            className={`work-workspace-card ${selectedWorkspace === workspace.id ? "is-selected" : ""}`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onClick={() => setSelectedWorkspace(workspace.id)}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className="work-workspace-card__glow"
              style={{
                background: workspace.gradient,
                boxShadow: `0 20px 60px ${workspace.glowColor}`,
              }}
            />
            
            <div className="work-workspace-card__content">
              <div className="work-workspace-card__icon">{workspace.icon}</div>
              <h3 className="work-workspace-card__name">{workspace.name}</h3>
              <p className="work-workspace-card__tagline">{workspace.tagline}</p>
              <p className="work-workspace-card__description">{workspace.description}</p>
              
              <motion.button
                className="work-workspace-card__button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {selectedWorkspace === workspace.id ? "Selected ✓" : "Select"}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Comparison Table */}
      <motion.div
        className="work-comparison"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <h3 className="work-comparison__title">Feature Comparison</h3>
        <div className="work-comparison__table">
          <div className="work-comparison__header">
            <div className="work-comparison__header-cell">Feature</div>
            <div className="work-comparison__header-cell">Private Office</div>
            <div className="work-comparison__header-cell">Co-Working</div>
            <div className="work-comparison__header-cell">Conference Room</div>
          </div>
          
          {workspaceFeatures.map((feature, index) => (
            <motion.div
              key={index}
              className="work-comparison__row"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <div className="work-comparison__label">{feature.label}</div>
              <div className={`work-comparison__value ${feature.highlight === "privateOffice" ? "is-highlighted" : ""}`}>
                {feature.privateOffice}
              </div>
              <div className={`work-comparison__value ${feature.highlight === "coWorking" ? "is-highlighted" : ""}`}>
                {feature.coWorking}
              </div>
              <div className={`work-comparison__value ${feature.highlight === "conferenceRoom" ? "is-highlighted" : ""}`}>
                {feature.conferenceRoom}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};


