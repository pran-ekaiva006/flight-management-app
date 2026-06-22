'use client';

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useEffect, useState } from 'react';

export function AnimatedHeroBackground() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  // Subtle parallax effect
  const y = useTransform(scrollY, [0, 1000], [0, 150]);

  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-background">
      {/* Stratosphere blurred shapes */}
      <motion.div
        className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[120px]"
        animate={shouldReduceMotion ? {} : { x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-[120px]"
        animate={shouldReduceMotion ? {} : { x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        style={{ y }}
        className="absolute inset-0 flex items-center justify-center opacity-[0.08] dark:opacity-[0.12]"
      >
        <svg
          viewBox="0 0 1000 500"
          className="w-[120%] min-w-[1000px] h-auto fill-current text-white"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Minimalist World Map / Node Grid Representation */}
          <path
            d="M150,150 Q180,120 220,130 T280,180 T350,150 T400,200 T450,120 T550,160 T600,100 T700,140 T750,220 T800,180"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.3"
          />
          <path
            d="M200,300 Q250,250 300,350 T400,280 T500,320 T600,250 T700,300 T800,200"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.3"
          />

          {/* Nodes */}
          <circle cx="200" cy="150" r="3" />
          <circle cx="240" cy="180" r="3" />
          <circle cx="280" cy="160" r="3" />
          <circle cx="500" cy="140" r="3" />
          <circle cx="480" cy="120" r="3" />
          <circle cx="530" cy="160" r="3" />
          <circle cx="700" cy="150" r="3" />
          <circle cx="750" cy="180" r="3" />
          <circle cx="680" cy="200" r="3" />

          {/* Flight Path Arcs */}
          <path
            id="flight-path-1"
            d="M240,180 Q350,50 500,140"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            id="flight-path-2"
            d="M530,160 Q650,100 750,180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Animated Planes (SVG Native animateMotion) */}
          {!shouldReduceMotion && (
            <>
              <g className="text-sky-400 dark:text-sky-300">
                <path d="M-8,-8 L8,0 L-8,8 L-4,0 Z" transform="scale(1.5)">
                  <animateMotion
                    dur="15s"
                    repeatCount="indefinite"
                    path="M240,180 Q350,50 500,140"
                    rotate="auto"
                  />
                </path>
              </g>
              <g className="text-violet-400 dark:text-violet-300">
                <path d="M-8,-8 L8,0 L-8,8 L-4,0 Z" transform="scale(1.5)">
                  <animateMotion
                    dur="20s"
                    repeatCount="indefinite"
                    path="M530,160 Q650,100 750,180"
                    rotate="auto"
                  />
                </path>
              </g>
            </>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
