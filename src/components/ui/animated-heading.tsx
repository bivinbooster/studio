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
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 1,
      },
    },
  };

  const child: Variants = {
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

  return (
    <motion.h1
      className={cn('font-bold inline-flex overflow-hidden', className)}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </motion.h1>
  );
}
