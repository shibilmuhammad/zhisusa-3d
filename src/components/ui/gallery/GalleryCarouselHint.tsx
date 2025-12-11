"use client";

import { motion } from "framer-motion";

interface GalleryCarouselHintProps {
  active: boolean;
}

export const GalleryCarouselHint = ({ active }: GalleryCarouselHintProps) => (
  <motion.div
    className="gallery-hint"
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: active ? 1 : 0.6, y: active ? 0 : 12 }}
    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
  >
    <span>Drag or scroll sideways to explore</span>
    <div className="gallery-hint__bars">
      {[...Array(5)].map((_, idx) => (
        <motion.span
          key={`gallery-hint-bar-${idx}`}
          animate={{
            scaleX: active ? 1 + idx * 0.06 : 1,
            opacity: active ? 1 : 0.4
          }}
          transition={{
            repeat: active ? Infinity : 0,
            repeatType: "mirror",
            duration: 1.8 + idx * 0.2,
            delay: idx * 0.1
          }}
        />
      ))}
    </div>
  </motion.div>
);

export default GalleryCarouselHint;

