'use client';

import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

export function AnimatedHeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Abstract blurred shapes for modern feel */}
      <motion.div
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[100px]"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-accent/20 blur-[100px]"
        animate={{
          x: [0, -50, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Floating Airplanes */}
      <motion.div
        className="absolute top-1/4 -left-10 text-muted/30"
        animate={{
          x: ['-10vw', '110vw'],
          y: [0, -50],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Plane className="h-24 w-24 rotate-45" />
      </motion.div>
      
      <motion.div
        className="absolute top-2/3 -right-10 text-muted/20"
        animate={{
          x: ['110vw', '-10vw'],
          y: [0, 100],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Plane className="h-32 w-32 -rotate-[135deg]" />
      </motion.div>

      <motion.div
        className="absolute bottom-1/4 -left-20 text-primary/10"
        animate={{
          x: ['-10vw', '110vw'],
          y: [0, -20],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: "linear",
          delay: 10
        }}
      >
        <Plane className="h-16 w-16 rotate-[75deg]" />
      </motion.div>

      {/* Abstract Map Grid Pattern */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:40px_40px] opacity-[0.15]" 
        style={{
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
        }}
      />
    </div>
  );
}
