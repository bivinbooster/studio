import React from 'react';
import { cn } from '@/lib/utils';

interface ShootingStarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ShootingStar({ className, ...props }: ShootingStarProps) {
  return (
    <div
      className={cn(
        'absolute h-1 w-40 animate-[shooting-star_5s_linear_infinite] origin-top-left -translate-x-1/2',
        'bg-gradient-to-r from-primary via-accent to-transparent',
        'shadow-[0_0_10px_hsl(var(--primary)/0.8)]',
        className
      )}
      {...props}
    />
  );
}
