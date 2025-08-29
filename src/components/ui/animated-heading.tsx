'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedHeadingProps {
  text: string;
  className?: string;
}

export function AnimatedHeading({ text, className }: AnimatedHeadingProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) => text.slice(0, latest));

  useEffect(() => {
    const controls = animate(count, text.length, {
      type: 'tween',
      duration: 2,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 1,
    });

    return controls.stop;
  }, [count, text.length]);

  return (
    <h1 className={cn('font-bold', className)}>
      <motion.span>{displayText}</motion.span>
    </h1>
  );
}
