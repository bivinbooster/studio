'use client';

import { motion, useAnimation } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

export function AnimatedHeading({ text, className }: AnimatedHeadingProps) {
  const controls = useAnimation();
  const letters = text.split('');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    const sequence = async () => {
      while (true) {
        await controls.start('visible');
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Time the text is visible
        await controls.start('hidden');
        await new Promise((resolve) => setTimeout(resolve, 500)); // Time before restart
      }
    };
    sequence();
  }, [controls]);

  return (
    <motion.h1
      className={cn('font-bold', className)}
      variants={container}
      initial="hidden"
      animate={controls}
      style={{ display: 'flex', overflow: 'hidden' }}
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
