"use client";

import Link from "next/link";
import { motion, useMotionValue, animate, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { useExperienceStore } from "@/stores/useExperienceStore";
import { sceneSequence, SceneKey } from "@/animations/constants";
import { scrollToSection } from "@/utils/navigation";

export const Header = () => {
  const currentScene = useExperienceStore((state) => state.currentScene);
  const navRef = useRef<HTMLElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const containerX = useMotionValue(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Find current scene index in full sequence
  const currentSceneIndex = sceneSequence.findIndex(s => s.key === currentScene);
  
  // Calculate which 4 items should be visible
  // Show items starting from max(0, currentIndex - 1) to ensure current item is visible
  // But always show exactly 4 items
  const visibleStartIndex = useMemo(() => {
    if (currentSceneIndex <= 1) return 0; // Show first 4 items
    if (currentSceneIndex >= sceneSequence.length - 2) {
      // Near the end, show last 4 items
      return Math.max(0, sceneSequence.length - 4);
    }
    // Middle sections: show current and 3 more, but start 1 before current
    return currentSceneIndex - 1;
  }, [currentSceneIndex]);

  const visibleItems = useMemo(() => {
    return sceneSequence.slice(visibleStartIndex, visibleStartIndex + 4);
  }, [visibleStartIndex]);

  // Find current item index within visible items
  const currentVisibleIndex = visibleItems.findIndex(s => s.key === currentScene);

  // Update container position to shift visible items
  useEffect(() => {
    if (navRef.current && navContainerRef.current) {
      const navWidth = navRef.current.offsetWidth - 8; // Subtract padding
      const itemWidth = navWidth / 4; // Each visible item is 25% of nav width
      const targetX = -visibleStartIndex * itemWidth;
      animate(containerX, targetX, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      });
    }
  }, [visibleStartIndex, containerX]);

  // Update pill position when scene changes
  useEffect(() => {
    if (navRef.current && navContainerRef.current) {
      const navWidth = navRef.current.offsetWidth - 8; // Subtract padding (4px * 2)
      const targetX = (currentVisibleIndex * navWidth) / 4;
      animate(x, targetX, {
        type: "spring",
        stiffness: 380,
        damping: 35,
        mass: 0.8
      });
    }
  }, [currentScene, currentVisibleIndex, x]);

  const handleDragEnd = (_: any, info: any) => {
    if (!navRef.current || !navContainerRef.current) return;

    const navWidth = navRef.current.offsetWidth - 8; // Subtract padding (4px * 2)
    const draggedX = info.point.x - navRef.current.getBoundingClientRect().left - 4;
    
    // Calculate which section the pill was dragged to (within visible items)
    const sectionWidth = navWidth / 4;
    let targetVisibleIndex = Math.round(draggedX / sectionWidth);
    
    // Clamp between 0 and 3 (visible items)
    targetVisibleIndex = Math.max(0, Math.min(3, targetVisibleIndex));
    
    // Get the actual scene from visible items
    const targetScene = visibleItems[targetVisibleIndex];
    if (targetScene) {
      scrollToSection(targetScene.key);
    }
  };

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMenuNavClick = (sceneKey: SceneKey) => {
    // Close menu first
    setIsMobileMenuOpen(false);
    // Small delay to ensure menu closes before scrolling
    setTimeout(() => {
      scrollToSection(sceneKey);
    }, 100);
  };

  // Close menu on escape key and prevent body scroll when menu is open
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    
    // Prevent body scroll when menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="experience-header">
      <Link href="/" className="experience-header__logo">
        <span>ZHISUSA</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="experience-header__nav" ref={navRef}>
        {/* Draggable liquid glass pill - background indicator */}
        <motion.div
          className="experience-header__nav-pill"
          drag="x"
          dragConstraints={navRef}
          dragElastic={0.05}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          style={{
            x,
            left: 4,
            pointerEvents: 'none', // Don't block clicks on nav items
          }}
          whileDrag={{
            scale: 1.05,
            boxShadow: `
              inset 0 0 0 0.5px rgba(255, 255, 255, 0.6),
              inset 0 2px 6px rgba(255, 255, 255, 0.4),
              0 6px 32px rgba(255, 255, 255, 0.3),
              0 0 60px rgba(100, 180, 255, 0.25)
            `,
            cursor: 'grabbing',
            pointerEvents: 'auto', // Enable dragging only when interacting
          }}
          whileHover={{
            pointerEvents: 'auto' // Enable on hover for dragging
          }}
        />
        
        {/* Scrollable container with all items */}
        <motion.div
          ref={navContainerRef}
          className="experience-header__nav-container"
          style={{
            x: containerX,
            '--total-items': sceneSequence.length,
          } as React.CSSProperties & { '--total-items': number }}
        >
          {sceneSequence.map((scene) => (
          <button
            key={scene.key}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("Header button clicked:", scene.key);
              scrollToSection(scene.key);
            }}
            className={`experience-header__nav-item ${currentScene === scene.key ? "is-active" : ""}`}
            aria-label={`Go to ${scene.label} section`}
              style={{ 
                pointerEvents: 'auto', 
                zIndex: 100,
                flex: '0 0 25%', // Each item takes 25% of container width
                minWidth: 0
              }}
          >
            {scene.key === 'hero' ? 'Home' : scene.label}
          </button>
        ))}
        </motion.div>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="experience-header__mobile-menu-btn"
        onClick={handleMenuToggle}
        aria-label="Toggle menu"
        aria-expanded={isMobileMenuOpen}
      >
        <motion.div
          className="experience-header__mobile-menu-icon"
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

      {/* Mobile Menu Overlay - Rendered via Portal to avoid overflow clipping */}
      {typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="experience-header__mobile-menu-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleMenuClose}
              />
              
              {/* Menu Container */}
              <motion.div
                className="experience-header__mobile-menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 9999,
                }}
              >
                <div className="experience-header__mobile-menu-header">
                  <span className="experience-header__mobile-menu-title">Navigation</span>
                  <button
                    className="experience-header__mobile-menu-close"
                    onClick={handleMenuClose}
                    aria-label="Close menu"
                  >
                    ×
                  </button>
                </div>
                
                <nav className="experience-header__mobile-menu-nav">
                  {sceneSequence.map((scene, index) => (
                    <motion.button
                      key={scene.key}
                      className={`experience-header__mobile-menu-item ${
                        currentScene === scene.key ? "is-active" : ""
                      }`}
                      onClick={() => handleMenuNavClick(scene.key)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.05,
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="experience-header__mobile-menu-item-label">
                        {scene.key === 'hero' ? 'Home' : scene.label}
                      </span>
                      {currentScene === scene.key && (
                        <motion.div
                          className="experience-header__mobile-menu-item-indicator"
                          layoutId="mobileMenuIndicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}

      <motion.div
        className="experience-header__light"
        layout
        animate={{
          opacity: 1,
          background: (() => {
            switch(currentScene) {
              case "hero": return "linear-gradient(135deg, #00f5c8, #92f0ff)";
              case "live": return "linear-gradient(135deg, #ff8a50, #ffb380)";
              case "work": return "linear-gradient(135deg, #0091ff, #4fc3f7)";
              case "leisure": return "linear-gradient(135deg, #3dd598, #6de3b4)";
              case "booking": return "linear-gradient(135deg, #ff6b9d, #ff94b8)";
              case "gallery": return "linear-gradient(135deg, #a78bfa, #c4b5fd)";
              case "footer": return "linear-gradient(135deg, #38bdf8, #7dd3fc)";
              default: return "linear-gradient(135deg, #00f5c8, #92f0ff)";
            }
          })(),
          boxShadow: (() => {
            switch(currentScene) {
              case "hero": return "0 0 32px rgba(0, 245, 200, 0.7), 0 0 64px rgba(0, 245, 200, 0.35)";
              case "live": return "0 0 32px rgba(255, 138, 80, 0.7), 0 0 64px rgba(255, 138, 80, 0.35)";
              case "work": return "0 0 32px rgba(0, 145, 255, 0.7), 0 0 64px rgba(0, 145, 255, 0.35)";
              case "leisure": return "0 0 32px rgba(61, 213, 152, 0.7), 0 0 64px rgba(61, 213, 152, 0.35)";
              case "booking": return "0 0 32px rgba(255, 107, 157, 0.7), 0 0 64px rgba(255, 107, 157, 0.35)";
              case "gallery": return "0 0 32px rgba(167, 139, 250, 0.7), 0 0 64px rgba(167, 139, 250, 0.35)";
              case "footer": return "0 0 32px rgba(56, 189, 248, 0.7), 0 0 64px rgba(56, 189, 248, 0.35)";
              default: return "0 0 32px rgba(0, 245, 200, 0.7), 0 0 64px rgba(0, 245, 200, 0.35)";
            }
          })()
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      />
    </header>
  );
};

export default Header;

