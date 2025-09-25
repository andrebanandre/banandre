"use client";

import React, { useEffect, useState } from "react";

// Pure CSS falling banana component
function FallingBanana() {
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

export default function ThreeTitleScene() {
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
          <FallingBanana key={i} />
        ))}
      </div>
    </>
  );
}
