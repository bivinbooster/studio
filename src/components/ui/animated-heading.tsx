'use client';

import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

export function AnimatedHeading({ text, className }: AnimatedHeadingProps) {
  const letters = text.split('');

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      textShadow: [
        '0 0 4px rgba(160, 32, 240, 0)',
        '0 0 8px rgba(160, 32, 240, 0.8)',
        '0 0 4px rgba(160, 32, 240, 0)',
      ],
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
        duration: 1.5,
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

  return (
    <motion.h1
      className={cn('font-bold', className)}
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ display: 'inline-flex', overflow: 'hidden' }}
    >
      {letters.map((letter, index) => (
        <motion.span key={index} variants={child}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
}
