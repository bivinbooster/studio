'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

export function AnimatedHeading({ text, className }: AnimatedHeadingProps) {
  const letters = text.split('');

  return (
    <h1 className={cn('font-bold inline-flex overflow-hidden', className)}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ y: 0 }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.05,
            ease: 'easeInOut',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </h1>
  );
}
