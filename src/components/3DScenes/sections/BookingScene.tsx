"use client";

import { useSectionOpacity } from "@/components/3DScenes/hooks/useSectionOpacity";

export const BookingScene = () => {
  const { opacity, visible } = useSectionOpacity("booking");

  // All booking elements are now handled by ReceptionDesk component in Experience.tsx
  return (
    <group visible={visible} name="BookingScene">
      {/* Reception desk is rendered in Experience.tsx */}
    </group>
  );
};
