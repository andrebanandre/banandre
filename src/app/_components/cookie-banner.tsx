"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { isFromEU } from "@/lib/eu-utils";

// Cookie utilities
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user is from EU and has accepted cookies
    const consent = getCookie("cookie-consent");
    const shouldShow = isFromEU() && consent !== "accepted";

    if (shouldShow) {
      setShowBanner(true);
      // Delay for animation
      setTimeout(() => setIsVisible(true), 100);
    }
  }, []);

  const handleAccept = () => {
    setCookie("cookie-consent", "accepted", 7); // 7 days
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 300);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-card border-t-[3px] border-foreground shadow-[0_-6px_0px_var(--accent)] min-h-14">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs text-gray-300 text-center sm:text-left flex-1">
              By tapping Accept, you consent to our use of cookies. You can read our{" "}
              <Link
                href="/privacy"
                className="text-accent hover:text-accent-hover underline font-semibold transition-colors whitespace-nowrap"
              >
                Cookie Policy
              </Link>{" "}
              here.
            </p>

            <div className="flex-shrink-0">
              <motion.button
                onClick={handleAccept}
                className="px-4 py-2 bg-accent text-accent-foreground font-bold uppercase text-xs tracking-wide brutalist-border hover:bg-accent-hover transition-all duration-200 cursor-pointer whitespace-nowrap"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Accept
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
