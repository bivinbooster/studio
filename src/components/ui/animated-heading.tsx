'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

const sentence = {
  hidden: { opacity: 1 }, // Start with opacity 1 to avoid initial flash
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
  },
};

export function AnimatedHeading({ text, className }: AnimatedHeadingProps) {
  const letters = text.split('');
  const totalDuration = letters.length * 0.08 + 1.5; // Stagger duration + 1.5s pause

  return (
    <motion.h1
      className={cn('font-bold', className)}
      // Animate opacity to make the whole heading disappear at once
      animate={{
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: totalDuration,
        times: [0, 0.01, 0.99, 1], // Disappear quickly at the end
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <motion.span
         // Use a separate motion component for the children staggering
        variants={sentence}
        initial="hidden"
        animate="visible"
      >
        {letters.map((char, index) => {
          return (
            <motion.span
              key={`${char}-${index}`}
              variants={letter}
              style={{ display: 'inline-block' }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          );
        })}
      </motion.span>
    </motion.h1>
  );
}
