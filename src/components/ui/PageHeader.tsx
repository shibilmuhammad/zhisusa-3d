"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./PageHeader.css";

export interface PageHeaderProps {
  currentPage: "live" | "work" | "leisure" | "gallery" | "booking";
  pageTitle: string;
  pageColor?: string;
}

const pageConfig = {
  live: {
    label: "Live",
    path: "/live",
    gradient: "linear-gradient(135deg, #ff8a50, #ffb380)",
    glowColor: "rgba(255, 138, 80, 0.4)",
  },
  work: {
    label: "Work",
    path: "/work",
    gradient: "linear-gradient(135deg, #0091ff, #4fc3f7)",
    glowColor: "rgba(0, 145, 255, 0.5)",
  },
  leisure: {
    label: "Leisure",
    path: "/leisure",
    gradient: "linear-gradient(135deg, #3dd598, #6de3b4)",
    glowColor: "rgba(61, 213, 152, 0.4)",
  },
  gallery: {
    label: "Gallery",
    path: "/gallery",
    gradient: "linear-gradient(135deg, #a78bfa, #c4b5fd)",
    glowColor: "rgba(167, 139, 250, 0.4)",
  },
  booking: {
    label: "Booking",
    path: "/booking",
    gradient: "linear-gradient(135deg, #ff6b9d, #ff94b8)",
    glowColor: "rgba(255, 107, 157, 0.4)",
  },
};

export const PageHeader = ({ currentPage, pageTitle, pageColor }: PageHeaderProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentConfig = pageConfig[currentPage];

  // Close menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close menu on escape key and prevent body scroll when menu is open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);

    // Prevent body scroll when menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [isMobileMenuOpen]);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="page-header">
      <Link href="/" className="page-header__logo">
        <span>ZHISUSA</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="page-header__nav">
        <Link
          href="/"
          className={`page-header__nav-item ${pathname === "/" ? "is-active" : ""}`}
        >
          Home
        </Link>
        {Object.entries(pageConfig).map(([key, config]) => {
          if (key === currentPage) return null; // Don't show current page
          return (
            <Link
              key={key}
              href={config.path}
              className={`page-header__nav-item ${pathname === config.path ? "is-active" : ""}`}
            >
              {config.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="page-header__mobile-menu-btn"
        onClick={handleMenuToggle}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        <motion.div
          className="page-header__mobile-menu-icon"
          animate={{
            rotate: isMobileMenuOpen ? 180 : 0,
            scale: isMobileMenuOpen ? 0.9 : 1,
          }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.span
            animate={{
              rotate: isMobileMenuOpen ? 45 : 0,
              y: isMobileMenuOpen ? 6 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />
          <motion.span
            animate={{
              opacity: isMobileMenuOpen ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={{
              rotate: isMobileMenuOpen ? -45 : 0,
              y: isMobileMenuOpen ? -6 : 0,
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>
      </button>

      {/* Mobile Menu Overlay */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  className="page-header__mobile-menu-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={handleMenuClose}
                />

                {/* Menu Container */}
                <motion.div
                  className="page-header__mobile-menu"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 9999,
                  }}
                >
                  <div className="page-header__mobile-menu-header">
                    <span className="page-header__mobile-menu-title">Navigation</span>
                    <button
                      className="page-header__mobile-menu-close"
                      onClick={handleMenuClose}
                      aria-label="Close menu"
                    >
                      ×
                    </button>
                  </div>

                  <nav className="page-header__mobile-menu-nav">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      <Link
                        href="/"
                        className={`page-header__mobile-menu-item ${pathname === "/" ? "is-active" : ""}`}
                        onClick={handleMenuClose}
                      >
                        <span className="page-header__mobile-menu-item-label">Home</span>
                        {pathname === "/" && (
                          <motion.div
                            className="page-header__mobile-menu-item-indicator"
                            layoutId="mobileMenuIndicator"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Link>
                    </motion.div>

                    {Object.entries(pageConfig).map(([key, config], index) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                      >
                        <Link
                          href={config.path}
                          className={`page-header__mobile-menu-item ${pathname === config.path ? "is-active" : ""}`}
                          onClick={handleMenuClose}
                        >
                          <span className="page-header__mobile-menu-item-label">
                            {config.label}
                          </span>
                          {pathname === config.path && (
                            <motion.div
                              className="page-header__mobile-menu-item-indicator"
                              layoutId="mobileMenuIndicator"
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Colored Light Indicator */}
      <motion.div
        className="page-header__light"
        layout
        animate={{
          opacity: 1,
          background: currentConfig.gradient,
          boxShadow: `0 0 32px ${currentConfig.glowColor}, 0 0 64px ${currentConfig.glowColor.replace("0.4", "0.2")}`,
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </header>
  );
};

