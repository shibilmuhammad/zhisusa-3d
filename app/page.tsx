"use client";

import { useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Application } from '@splinetool/runtime';

const carouselData = [
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop",
    title: "Luxury Living",
    description: "Experience the pinnacle of comfort in our premium villas designed for modern living."
  },
  {
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop",
    title: "Eco-Friendly Tents",
    description: "Close to nature, without compromising on luxury. Our eco-tents offer a unique blend of style and sustainability."
  },
  {
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop",
    title: "Modern Architecture",
    description: "Bespoke designs that harmonize with the landscape, using light and space to create a sanctuary of clarity."
  }
];

export default function Home() {
  // State to control visibility and active carousel index
  const [showLiveInfo, setShowLiveInfo] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % carouselData.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  function onLoad(splineApp: Application) {
    console.log('--- SPLINE OBJECTS YOU CAN CONTROL (via React Wrapper) ---');
    const splObj = splineApp.getAllObjects();
    splObj.forEach((obj: any) => {
      if (obj.name) {
         console.log(`Name: "${obj.name}" | Type: ${obj.type || 'Unknown'} | UUID: ${obj.uuid}`);
      }
    });

    splineApp.addEventListener('mouseDown', (e) => {
      if (e.target.name && e.target.name.toLowerCase().includes('live')) {
         console.log('LIVE button clicked! Showing carousel...');
         setShowLiveInfo(true);
      }
    });
  }

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black font-sans">
      <Spline
        scene="https://prod.spline.design/jlu-LrL7kOx-S9uS/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
        onLoad={onLoad}
      />

      {showLiveInfo && (
        <div 
          onClick={() => setShowLiveInfo(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(15px)',
            cursor: 'default'
          }}
        >
          {/* Main Content Area */}
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '90vw',
              height: '80vh',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              textAlign: 'center'
            }}
          >
            {/* Banner Image Container */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '30px',
              overflow: 'hidden',
              boxShadow: '0 50px 100px -20px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img 
                src={carouselData[activeIndex].image} 
                alt={carouselData[activeIndex].title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />

              {/* Navigation Arrows */}
              <button 
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>

              <button 
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>

              {/* Bottom Info Overlay */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '60px 40px 40px',
                background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.9))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '15px'
              }}>
                <h2 style={{ fontSize: '48px', fontWeight: '800', margin: 0, letterSpacing: '-1px' }}>{carouselData[activeIndex].title}</h2>
                <p style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)', maxWidth: '600px', margin: 0, lineHeight: '1.6' }}>
                  {carouselData[activeIndex].description}
                </p>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                  <button 
                    onClick={() => alert("Exploring more...")}
                    style={{
                      padding: '16px 40px',
                      fontSize: '16px',
                      fontWeight: '700',
                      borderRadius: '100px',
                      border: 'none',
                      backgroundColor: 'white',
                      color: 'black',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Know More
                  </button>
                  <button 
                    onClick={() => setShowLiveInfo(false)}
                    style={{
                      padding: '16px 40px',
                      fontSize: '16px',
                      fontWeight: '700',
                      borderRadius: '100px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Back to Scene
                  </button>
                </div>

                {/* Indicators */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '30px' }}>
                  {carouselData.map((_, i) => (
                    <div 
                      key={i}
                      style={{
                        width: i === activeIndex ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        backgroundColor: i === activeIndex ? 'white' : 'rgba(255, 255, 255, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
