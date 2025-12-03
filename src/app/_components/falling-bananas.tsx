"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

// Types for banana configuration
type BananaDepth = "back" | "mid" | "front";

interface BananaState {
  x: number; // 0-100%
  duration: number;
  rotation: number;
  bananaType: string;
  depth: BananaDepth;
  swayType: number; // 0, 1, or 2 for different sway patterns
  isVisible: boolean;
  isExploding: boolean;
  shouldExplode: boolean;
  key: number;
}

// Pure CSS falling banana component
function FallingBanana() {
  const [state, setState] = useState<BananaState>(() => generateBananaState());

  function generateBananaState(): BananaState {
    const isOpen = Math.random() > 0.7; // 30% chance for banana-open
    const shouldExplode = Math.random() > 0.6; // 40% chance to explode

    // Determine depth and associated properties
    const depthRoll = Math.random();
    let depth: BananaDepth = "mid";
    if (depthRoll < 0.3)
      depth = "back"; // 30% background
    else if (depthRoll > 0.8) depth = "front"; // 20% foreground

    // Duration depends on depth (parallax effect)
    // Back: slower (looks further away)
    // Front: faster
    let baseDuration = 3;
    if (depth === "back") baseDuration = 5 + Math.random() * 3;
    else if (depth === "mid") baseDuration = 3 + Math.random() * 2;
    else baseDuration = 2 + Math.random() * 1.5;

    return {
      x: Math.random() * 100,
      duration: baseDuration,
      rotation: Math.random() * 360,
      bananaType: isOpen ? "/banana-open.png" : "/banana.png",
      depth,
      swayType: Math.floor(Math.random() * 3),
      isVisible: true,
      isExploding: false,
      shouldExplode,
      key: Math.random(),
    };
  }

  useEffect(() => {
    if (!state.isVisible) return;

    const resetBanana = () => {
      setState(generateBananaState());
    };

    if (state.shouldExplode) {
      // Start explosion just before animation completes
      // Adjust timing based on depth/speed
      const explosionTime = state.duration * 1000 - 300;

      const explosionTimeout = setTimeout(() => {
        setState((prev) => ({ ...prev, isExploding: true, isVisible: false }));

        setTimeout(() => {
          setState((prev) => ({ ...prev, isExploding: false }));
          resetBanana();
        }, 600);
      }, explosionTime);

      return () => clearTimeout(explosionTimeout);
    } else {
      const resetTimeout = setTimeout(() => {
        resetBanana();
      }, state.duration * 1000);
      return () => clearTimeout(resetTimeout);
    }
  }, [state.isVisible, state.duration, state.shouldExplode]);

  // Dynamic styles based on depth
  const getDepthStyles = () => {
    switch (state.depth) {
      case "back":
        return {
          size: 32,
          className: "opacity-60 blur-[1px] z-0",
          zIndex: 0,
        };
      case "front":
        return {
          size: 64,
          className: "z-20 drop-shadow-xl",
          zIndex: 20,
        };
      case "mid":
      default:
        return {
          size: 48,
          className: "z-10 opacity-90",
          zIndex: 10,
        };
    }
  };

  const depthStyle = getDepthStyles();
  const animationName = `fallSway${state.swayType}`;

  return (
    <>
      {state.isVisible && (
        <Image
          key={state.key}
          src={state.bananaType}
          width={depthStyle.size}
          height={depthStyle.size}
          className={`absolute pointer-events-none will-change-transform ${depthStyle.className}`}
          style={{
            left: `${state.x}%`,
            top: "-120px",
            width: `${depthStyle.size}px`,
            height: `${depthStyle.size}px`,
            animation: `${animationName} ${state.duration}s linear`,
            transform: `rotate(${state.rotation}deg)`,
          }}
          alt="falling banana"
        />
      )}

      {state.isExploding && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${state.x}%`,
            top: "85%", // Explode near bottom
            transform: "translateX(-50%)",
            zIndex: depthStyle.zIndex,
          }}
        >
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className={`absolute rounded-full bg-yellow-400 ${state.depth === "back" ? "w-2 h-2" : "w-3 h-3"}`}
              style={{
                animation: `explode${i} 0.6s ease-out forwards`,
              }}
            />
          ))}
          <div
            className="absolute w-8 h-8 bg-white rounded-full opacity-60 blur-md"
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

// Sneaky banana component (keeps largely same logic but adjusted for new container)
function SneakyBanana() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, duration: 0 });

  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (!isVisible && Math.random() < 0.05) {
        // 5% chance every second
        setIsVisible(true);
        setPosition({
          x: 10 + Math.random() * 80, // Keep roughly in center
          duration: 4 + Math.random() * 2,
        });
      }
    }, 1000);
    return () => clearInterval(checkInterval);
  }, []);

  // Auto-hide after animation
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setIsVisible(false), position.duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, position.duration]);

  if (!isVisible) return null;

  return (
    <Image
      src="/banana_sneaky.png"
      width={100}
      height={100}
      className="absolute w-24 h-24 pointer-events-none z-30 drop-shadow-2xl"
      style={{
        left: `${position.x}%`,
        top: "-120px",
        animation: `fallSneaky ${position.duration}s linear`,
      }}
      alt="sneaky banana"
    />
  );
}

export function FallingBananasTitle() {
  // Generate static array for hydration consistency
  const bananaCount = 20; // Increased count for better density

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 400]);
  const titleY = useTransform(scrollY, [0, 1000], [0, 200]);

  return (
    <>
      <style jsx global>{`
        /* Sway Patterns */
        @keyframes fallSway0 {
          0% {
            transform: translate(0, -120px) rotate(0deg);
          }
          25% {
            transform: translate(20px, 20vh) rotate(90deg);
          }
          50% {
            transform: translate(-15px, 50vh) rotate(180deg);
          }
          75% {
            transform: translate(10px, 80vh) rotate(270deg);
          }
          100% {
            transform: translate(0, 110vh) rotate(360deg);
          }
        }

        @keyframes fallSway1 {
          0% {
            transform: translate(0, -120px) rotate(0deg);
          }
          30% {
            transform: translate(-25px, 30vh) rotate(-60deg);
          }
          60% {
            transform: translate(20px, 60vh) rotate(-120deg);
          }
          100% {
            transform: translate(-10px, 110vh) rotate(-360deg);
          }
        }

        @keyframes fallSway2 {
          0% {
            transform: translate(0, -120px) rotate(45deg);
          }
          40% {
            transform: translate(15px, 40vh) rotate(100deg);
          }
          80% {
            transform: translate(-15px, 90vh) rotate(200deg);
          }
          100% {
            transform: translate(0, 110vh) rotate(280deg);
          }
        }

        @keyframes fallSneaky {
          0% {
            transform: translateY(-120px) rotate(0deg) scale(1);
          }
          50% {
            transform: translateY(40vh) rotate(180deg) scale(1.2);
          }
          100% {
            transform: translateY(110vh) rotate(360deg) scale(1);
          }
        }

        /* Explosion Particles */
        @keyframes explode0 {
          to {
            transform: translate(40px, -40px) scale(0);
            opacity: 0;
          }
        }
        @keyframes explode1 {
          to {
            transform: translate(-40px, -40px) scale(0);
            opacity: 0;
          }
        }
        @keyframes explode2 {
          to {
            transform: translate(50px, 10px) scale(0);
            opacity: 0;
          }
        }
        @keyframes explode3 {
          to {
            transform: translate(-50px, 10px) scale(0);
            opacity: 0;
          }
        }
        @keyframes explode4 {
          to {
            transform: translate(20px, 40px) scale(0);
            opacity: 0;
          }
        }
        @keyframes explode5 {
          to {
            transform: translate(-20px, 40px) scale(0);
            opacity: 0;
          }
        }

        @keyframes flash {
          0% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(0.5);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(3);
          }
        }
      `}</style>

      <div className="w-full relative overflow-hidden bg-gradient-to-b from-[#1a1a1a] to-[#252525] h-[40vh] min-h-[300px] md:h-[50vh] select-none">
        {/* Background pattern/grid for texture */}
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#444 1px, transparent 1px)",
            backgroundSize: "30px 30px",
            y: backgroundY,
          }}
        ></motion.div>

        {/* Title Container */}
        <motion.div
          style={{ y: titleY }}
          className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none px-4"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight text-center">
            BANANDRE
          </h1>
        </motion.div>

        {/* Falling bananas */}
        {Array.from({ length: bananaCount }, (_, i) => (
          <FallingBanana key={i} />
        ))}

        <SneakyBanana />

        {/* Gradient Overlay at bottom for smooth fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#181818] to-transparent z-20 pointer-events-none"></div>
      </div>
    </>
  );
}
