import "./globals.css";

import type { Metadata } from "next";
import { Poppins, Plus_Jakarta_Sans } from "next/font/google";
import { ReactNode } from "react";

const headingFont = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"]
});

const bodyFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  title: "ZHISUSA — Immersive Nature Retreat",
  description:
    "Scroll-triggered 3D journey through the luxury nature retreat by ZHISUSA. Work, live, and leisure reimagined."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.className} ${bodyFont.className}`}>

      <body>{children}</body>
    </html>
  );
}

