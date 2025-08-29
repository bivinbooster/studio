'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

export function AnimatedHeading({ text, className }: AnimatedHeadingProps) {
  const letters = text.split('');

  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        repeat: Infinity,
        repeatDelay: 1, // Time before the animation repeats
      },
    },
  };

  const child = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2, // Faster reveal for each letter
      }
    },
  };

  return (
    <motion.h1
      className={cn('font-bold', className)}
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {letters.map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={child}
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
