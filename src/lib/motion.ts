"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion, type Transition, type Variants } from "framer-motion";

// Reusable Easing curves
export const EASE_EDITORIAL = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;

// Reusable Durations (seconds)
export const DURATION_FAST = 0.18;
export const DURATION_NORMAL = 0.28;
export const DURATION_REVEAL = 0.45;
export const DURATION_SLOW = 0.6;

// Reusable Stagger timings
export const STAGGER_FAST = 0.04;
export const STAGGER_NORMAL = 0.08;
export const STAGGER_SLOW = 0.12;

// Standard Framer Motion transitions
export const transitionEditorial: Transition = {
  duration: DURATION_REVEAL,
  ease: EASE_EDITORIAL
};

export const transitionFast: Transition = {
  duration: DURATION_FAST,
  ease: EASE_OUT
};

export const transitionNormal: Transition = {
  duration: DURATION_NORMAL,
  ease: EASE_OUT
};

// Section & Item Reveal Variants (One-time viewport reveals)
export const revealFadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION_REVEAL, ease: EASE_EDITORIAL }
  }
};

export const revealFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION_NORMAL, ease: EASE_OUT }
  }
};

export const staggerContainer = (staggerDelay = STAGGER_NORMAL, delayChildren = 0.05): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren
    }
  }
});

// Reusable button & card micro-interactions
export const buttonPressVariants: Variants = {
  hover: { y: -1, transition: { duration: DURATION_FAST, ease: EASE_OUT } },
  tap: { scale: 0.98, y: 0, transition: { duration: 0.1 } }
};

export const cardHoverVariants: Variants = {
  initial: { y: 0, borderColor: "#262626" },
  hover: {
    y: -3,
    borderColor: "rgba(255, 122, 0, 0.45)",
    transition: { duration: DURATION_NORMAL, ease: EASE_OUT }
  },
  tap: { scale: 0.99, transition: { duration: 0.1 } }
};

// Standard accessible keyboard focus ring classes
export const FOCUS_RING = "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF7A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]";

export interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  distance?: number;
  delay?: number;
  index?: number;
}

/**
 * Restrained vertical floating wrapper that gently oscillates between 0px and -distance (default -5px).
 * Separates floating oscillation from inner card hover lift to prevent transform conflicts.
 * Automatically disabled when prefers-reduced-motion is active.
 */
export function FloatingCard({
  children,
  className = "",
  duration,
  distance = 5,
  delay,
  index = 0
}: FloatingCardProps) {
  const shouldReduceMotion = useReducedMotion();

  // Staggered durations (4.8s to 6.8s) and delays per card for natural non-synchronized float
  const durations = [5.8, 5.0, 6.6, 5.2, 6.2, 4.8];
  const delays = [0, 0.8, 1.5, 0.4, 1.1, 1.9];

  const calculatedDuration = duration ?? durations[index % durations.length];
  const calculatedDelay = delay ?? delays[index % delays.length];

  if (shouldReduceMotion) {
    return React.createElement("div", { className }, children);
  }

  return React.createElement(
    motion.div,
    {
      className,
      animate: { y: [0, -distance, 0] },
      transition: {
        duration: calculatedDuration,
        delay: calculatedDelay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    },
    children
  );
}

/**
 * Hook to pause continuous ambient effects when browser tab is hidden (visibilitychange)
 * or when user prefers reduced motion.
 */
export function useAmbientAnimation(enabled: boolean = true) {
  const [isPlaying, setIsPlaying] = useState(() => {
    if (!enabled) return false;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    return true;
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const checkReducedMotion = () => {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    };

    const handleVisibilityChange = () => {
      setIsPlaying(!document.hidden && !checkReducedMotion());
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [enabled]);

  return isPlaying && enabled;
}

/**
 * Hook for subtle 1–2 degree desktop card tilt (active only on fine-pointer desktop devices).
 * Strictly clamped to [-1.8, 1.8] degrees.
 */
export function useFinePointerTilt() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const isFinePointer = useRef(false);

  useEffect(() => {
    isFinePointer.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isFinePointer.current || !cardRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Maximum 1.5 degrees tilt
    const maxTilt = 1.5;
    const rotateY = ((x - centerX) / centerX) * maxTilt;
    const rotateX = -((y - centerY) / centerY) * maxTilt;

    setTilt({
      rotateX: Math.max(-maxTilt, Math.min(maxTilt, rotateX)),
      rotateY: Math.max(-maxTilt, Math.min(maxTilt, rotateY))
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ rotateX: 0, rotateY: 0 });
  }, []);

  return {
    ref: cardRef,
    style: {
      transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
      transition: tilt.rotateX === 0 && tilt.rotateY === 0 ? "transform 0.3s ease-out" : "none"
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave
  };
}
