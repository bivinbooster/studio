'use client';

import { useEffect, useState } from 'react';

export function SnowfallBackground() {
  const [snowflakes, setSnowflakes] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const generateSnowflakes = () => {
      const newSnowflakes = Array.from({ length: 150 }).map((_, i) => {
        const style = {
          left: `${Math.random() * 100}vw`,
          width: `${Math.random() * 3 + 1}px`,
          height: `${Math.random() * 3 + 1}px`,
          animationDuration: `${Math.random() * 5 + 5}s`,
          animationDelay: `${Math.random() * 5}s`,
        };
        return <div key={i} className="snowflake" style={style}></div>;
      });
      setSnowflakes(newSnowflakes);
    };

    generateSnowflakes();
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full -z-10 pointer-events-none">
      {snowflakes}
    </div>
  );
}
