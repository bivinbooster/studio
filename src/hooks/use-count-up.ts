'use client';

import { useState, useEffect } from 'react';

export function useCountUp(endValue: number, duration: number = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrameId: number;

    const animateCount = (timestamp: number) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease-out cubic function
      const easeOutPercentage = 1 - Math.pow(1 - percentage, 3);
      const currentCount = Math.floor(endValue * easeOutPercentage);

      setCount(currentCount);

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animateCount);
      } else {
        // Ensure the final value is exact
        setCount(endValue);
      }
    };

    animationFrameId = requestAnimationFrame(animateCount);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [endValue, duration]);

  return count;
}
