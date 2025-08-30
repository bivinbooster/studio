'use client';
import { useState, useEffect } from 'react';

const STAR_COUNT = 100;

export function Background() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
       <div className="fixed inset-0 -z-10 h-full w-full bg-background" />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 h-full w-full bg-background overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background)))]" />
      <div className="absolute inset-x-[-1000px] h-full w-[200%] animate-[move-background_200s_linear_infinite] bg-[url('/assets/stars.svg')]" />
      <div
        id="stars"
        className="absolute inset-0 h-full w-full"
        style={{ perspective: '500px' }}
      >
        {Array.from({ length: STAR_COUNT }).map((_, i) => {
          const size = `${Math.random() * 2 + 1}px`;
          const x = `${Math.random() * 100}%`;
          const y = `${Math.random() * 100}%`;
          const z = `${Math.random() * 400 - 200}px`;
          const animationDelay = `${Math.random() * 5}s`;

          return (
            <div
              key={`star-${i}`}
              className="absolute rounded-full bg-primary animate-[star-twinkle_5s_infinite]"
              style={{
                width: size,
                height: size,
                left: x,
                top: y,
                transform: `translateZ(${z})`,
                animationDelay,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
