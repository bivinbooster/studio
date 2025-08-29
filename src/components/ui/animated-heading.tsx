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
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      repeat: Infinity,
      repeatType: 'reverse' as const,
      duration: 2,
      repeatDelay: 5,
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
    >
      {letters.map((char, index) => {
        // Use a space with a specific width for whitespace characters
        if (char === ' ') {
          return <span key={index} style={{ display: 'inline-block', width: '0.5em' }} />;
        }
        return (
          <motion.span key={char + '-' + index} variants={letter}>
            {char}
          </motion.span>
        );
      })}
    </motion.h1>
  );
}
