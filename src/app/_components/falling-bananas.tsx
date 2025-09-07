"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Pure CSS falling banana component
function FallingBanana() {
  const [state, setState] = useState(() => {
    const isOpen = Math.random() > 0.7; // 30% chance for banana-open
    const shouldExplode = Math.random() > 0.6; // 40% chance to explode

    return {
      x: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      rotation: Math.random() * 360,
      bananaType: isOpen ? "/banana-open.png" : "/banana.png",
      isOpen,
      shouldExplode,
      isVisible: true,
      isExploding: false,
      key: Math.random(), // Force re-render for animation restart
    };
  });

  useEffect(() => {
    if (!state.isVisible) return;

    const resetBanana = () => {
      const isOpen = Math.random() > 0.7;
      const shouldExplode = Math.random() > 0.6;
      setState({
        x: Math.random() * 100,
        duration: 3 + Math.random() * 2,
        rotation: Math.random() * 360,
        bananaType: isOpen ? "/banana-open.png" : "/banana.png",
        isOpen,
        shouldExplode,
        isVisible: true,
        isExploding: false,
        key: Math.random(),
      });
    };

    if (state.shouldExplode) {
      // Start explosion just before animation completes
      const explosionTime = state.duration * 1000 - 300; // 300ms before completion
      const explosionTimeout = setTimeout(() => {
        setState((prev) => ({ ...prev, isExploding: true, isVisible: false }));

        // Hide explosion and reset banana
        setTimeout(() => {
          setState((prev) => ({ ...prev, isExploding: false }));
          resetBanana();
        }, 600); // Explosion duration
      }, explosionTime);

      return () => clearTimeout(explosionTimeout);
    } else {
      // Just disappear at bottom and reset
      const resetTimeout = setTimeout(() => {
        resetBanana();
      }, state.duration * 1000);

      return () => clearTimeout(resetTimeout);
    }
  }, [state.isVisible, state.duration, state.shouldExplode]);

  const animationName = state.isOpen ? "fallFast" : "fall";

  return (
    <>
      {/* Falling banana */}
      {state.isVisible && (
        <Image
          key={state.key}
          src={state.bananaType}
          width={48}
          height={48}
          className="absolute w-12 h-12 pointer-events-none"
          style={{
            left: `${state.x}%`,
            top: "-100px",
            animation: `${animationName} ${state.duration}s linear`,
            transform: `rotate(${state.rotation}deg)`,
            zIndex: 10,
          }}
          alt="falling banana"
        />
      )}

      {/* Explosion effect */}
      {state.isExploding && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${state.x}%`,
            top: "350px", // Near bottom where banana disappears
            transform: "translateX(-50%)",
            zIndex: 20,
          }}
        >
          {/* Multiple explosion particles */}
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full"
              style={{
                animation: `explode${i} 0.6s ease-out forwards`,
              }}
            />
          ))}
          {/* Center flash */}
          <div
            className="absolute w-8 h-8 bg-white rounded-full opacity-80"
            style={{
              transform: "translate(-50%, -50%)",
              animation: "flash 0.3s ease-out forwards",
            }}
          />
        </div>
      )}
    </>
  );
}

// Sneaky banana that appears rarely
function SneakyBanana() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const [position, setPosition] = useState({
    x: Math.random() * 80, // Keep away from edges since it's bigger
    delay: 0,
    duration: 4 + Math.random() * 2,
  });

  useEffect(() => {
    // Random chance to appear (roughly every 10-15 seconds)
    const checkInterval = setInterval(() => {
      if (!isVisible && !isExploding && Math.random() < 0.1) {
        // 10% chance every second
        setIsVisible(true);
        setIsExploding(false);
        setPosition({
          x: Math.random() * 80,
          delay: 0,
          duration: 4 + Math.random() * 2,
        });

        // Start explosion just before animation completes
        setTimeout(
          () => {
            setIsExploding(true);
            setIsVisible(false);

            // Hide explosion after animation
            setTimeout(() => {
              setIsExploding(false);
            }, 600); // Explosion duration
          },
          position.duration * 1000 - 200
        ); // Start explosion 200ms before fall completes
      }
    }, 1000);

    return () => clearInterval(checkInterval);
  }, [isVisible, isExploding, position.duration]);

  return (
    <>
      {/* Falling banana */}
      {isVisible && (
        <Image
          src="/banana_sneaky.png"
          width={80}
          height={80}
          className="absolute w-20 h-20 pointer-events-none"
          style={{
            left: `${position.x}%`,
            top: "-80px",
            animation: `fallSneaky ${position.duration}s linear infinite`,
            zIndex: 15,
          }}
          alt="sneaky banana"
        />
      )}

      {/* Explosion effect */}
      {isExploding && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${position.x}%`,
            top: "350px", // Near bottom where banana disappears
            transform: "translateX(-50%)",
            zIndex: 20,
          }}
        >
          {/* Multiple explosion particles */}
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full"
              style={{
                animation: `explode${i} 0.6s ease-out forwards`,
              }}
            />
          ))}
          {/* Center flash */}
          <div
            className="absolute w-8 h-8 bg-white rounded-full opacity-80"
            style={{
              transform: "translate(-50%, -50%)",
              animation: "flash 0.3s ease-out forwards",
            }}
          />
        </div>
      )}
    </>
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

        /* Explosion animations for each particle */
        @keyframes explode0 {
          to {
            transform: translate(30px, -30px) scale(0);
            opacity: 0;
          }
        }
        @keyframes explode1 {
          to {
            transform: translate(-30px, -30px) scale(0);
            opacity: 0;
          }
        }
        @keyframes explode2 {
          to {
            transform: translate(40px, 0px) scale(0);
            opacity: 0;
          }
        }
        @keyframes explode3 {
          to {
            transform: translate(-40px, 0px) scale(0);
            opacity: 0;
          }
        }
        @keyframes explode4 {
          to {
            transform: translate(25px, 25px) scale(0);
            opacity: 0;
          }
        }
        @keyframes explode5 {
          to {
            transform: translate(-25px, 25px) scale(0);
            opacity: 0;
          }
        }
        @keyframes explode6 {
          to {
            transform: translate(15px, -40px) scale(0);
            opacity: 0;
          }
        }
        @keyframes explode7 {
          to {
            transform: translate(-15px, -40px) scale(0);
            opacity: 0;
          }
        }

        /* Center flash animation */
        @keyframes flash {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
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

        {/* Sneaky banana - rare appearance */}
        <SneakyBanana />
      </div>
    </>
  );
}
