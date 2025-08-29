'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

const sentence = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const letter = {
  hidden: { 
    opacity: 0, 
    y: 50 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      // This creates the reveal
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

export function AnimatedHeading({ text, className }: AnimatedHeadingProps) {
  const letters = text.split('');

  return (
    <motion.h1
      className={cn('font-bold', className)}
      variants={sentence}
      initial="hidden"
      animate="visible"
      // Add a key to force re-render and re-animate
      // But a better approach is needed for looping reveal and disappear.
      // Let's rewrite the logic to be more robust.
    >
      {letters.map((char, index) => {
        // Create a new component for the span to handle its own animation loop
        return (
          <AnimatedLetter key={`${char}-${index}`} delay={index * 0.08}>
            {char === ' ' ? '\u00A0' : char}
          </AnimatedLetter>
        );
      })}
    </motion.h1>
  );
}


function AnimatedLetter({ children, delay }: { children: React.ReactNode, delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{
        times: [0, 0.1, 0.9, 1], // Appear quickly, stay, disappear quickly
        duration: 3, // Total duration of one loop
        repeat: Infinity,
        repeatDelay: 2, // Wait 2 seconds before repeating the entire heading animation
        delay: delay,
      }}
      style={{display: 'inline-block'}}
    >
      {children}
    </motion.span>
  );
}