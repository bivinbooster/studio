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
      staggerChildren: 0.05, // Faster reveal
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
      repeat: Infinity,
      repeatType: "mirror" as const,
      duration: 2, // Total duration for one cycle (in and out)
    }
  },
};

export function AnimatedHeading({ text, className }: AnimatedHeadingProps) {
  const letters = text.split('');
  const totalDuration = letters.length * 0.05 + 2; 

  return (
    <motion.h1
      className={cn('font-bold', className)}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05, // Faster stagger
            repeat: Infinity,
            repeatDelay: 0.5, // Faster repeat delay
          },
        },
        hidden: {},
      }}
    >
      {letters.map((char, index) => {
        return (
          <motion.span
            key={`${char}-${index}`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            style={{ display: 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}
