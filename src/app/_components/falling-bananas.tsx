"use client";

import { useEffect, useState } from "react";

// Pure CSS falling banana component
function FallingBanana({ index }: { index: number }) {
  const [position, setPosition] = useState(() => {
    const isOpen = Math.random() > 0.7; // 30% chance for banana-open
    return {
      x: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      rotation: Math.random() * 360,
      bananaType: isOpen ? "/banana-open.png" : "/banana.png",
      isOpen,
    };
  });

  useEffect(() => {
    const interval = setInterval(
      () => {
        const isOpen = Math.random() > 0.7; // 30% chance for banana-open
        setPosition((prev) => ({
          ...prev,
          x: Math.random() * 100,
          delay: Math.random() * 2,
          duration: 3 + Math.random() * 2,
          rotation: Math.random() * 360,
          bananaType: isOpen ? "/banana-open.png" : "/banana.png",
          isOpen,
        }));
      },
      (position.duration + position.delay) * 1000
    );

    return () => clearInterval(interval);
  }, [position.duration, position.delay]);

  const animationName = position.isOpen ? "fallFast" : "fall";

  return (
    <img
      src={position.bananaType}
      className="absolute w-12 h-12 pointer-events-none"
      style={{
        left: `${position.x}%`,
        top: "-48px",
        animation: `${animationName} ${position.duration}s linear ${position.delay}s infinite`,
        transform: `rotate(${position.rotation}deg)`,
        zIndex: 10,
      }}
      alt="falling banana"
    />
  );
}

// Sneaky banana that appears rarely
function SneakyBanana() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({
    x: Math.random() * 80, // Keep away from edges since it's bigger
    delay: 0,
    duration: 4 + Math.random() * 2,
  });

  useEffect(() => {
    // Random chance to appear (roughly every 10-15 seconds)
    const checkInterval = setInterval(() => {
      if (!isVisible && Math.random() < 0.1) { // 10% chance every second
        setIsVisible(true);
        setPosition({
          x: Math.random() * 80,
          delay: 0,
          duration: 4 + Math.random() * 2,
        });
        
        // Hide after animation completes
        setTimeout(() => {
          setIsVisible(false);
        }, position.duration * 1000);
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [isVisible, position.duration]);

  if (!isVisible) return null;

  return (
    <img
      src="/banana_sneaky.png"
      className="absolute w-20 h-20 pointer-events-none" // Bigger than others (w-20 h-20 vs w-12 h-12)
      style={{
        left: `${position.x}%`,
        top: "-80px",
        animation: `fallSneaky ${position.duration}s linear infinite`,
        zIndex: 15, // Higher z-index than regular bananas
      }}
      alt="sneaky banana"
    />
  );
}

export function FallingBananasTitle() {
  return (
    <>
      <style jsx>{`
        @keyframes fall {
          from {
            transform: translateY(-100px) rotate(0deg);
          }
          to {
            transform: translateY(450px) rotate(360deg);
          }
        }
        @keyframes fallFast {
          from {
            transform: translateY(-100px) rotate(0deg);
          }
          to {
            transform: translateY(450px) rotate(720deg);
          }
        }
        @keyframes fallSneaky {
          from {
            transform: translateY(-100px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(225px) rotate(180deg) scale(1.1);
          }
          to {
            transform: translateY(450px) rotate(360deg) scale(1);
          }
        }
      `}</style>

      <div className="w-full h-96 relative overflow-hidden">
        {/* Title */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight text-center z-20">
            BANANDRE
          </h1>
        </div>

        {/* Falling bananas */}
        {Array.from({ length: 15 }, (_, i) => (
          <FallingBanana key={i} index={i} />
        ))}
        
        {/* Sneaky banana - rare appearance */}
        <SneakyBanana />
      </div>
    </>
  );
}