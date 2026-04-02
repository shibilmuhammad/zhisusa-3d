"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export const Header = () => {
  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
        backdropFilter: 'blur(5px)'
      }}
    >
      <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', textDecoration: 'none', letterSpacing: '2px' }}>
        ZHISUSA
      </Link>

      <nav style={{ display: 'flex', gap: '30px' }}>
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', opacity: 0.8 }}>Home</Link>
        <Link href="/live" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', opacity: 0.8 }}>Live</Link>
        <Link href="/work" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', opacity: 0.8 }}>Work</Link>
        <Link href="/leisure" style={{ color: 'white', textDecoration: 'none', fontSize: '14px', opacity: 0.8 }}>Leisure</Link>
      </nav>
    </header>
  );
};

export default Header;

