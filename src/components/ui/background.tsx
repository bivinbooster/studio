
'use client';

import { useState, useEffect } from 'react';

export function Background() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const starCount = 100;
  const stars = Array.from({ length: starCount }).map((_, i) => {
    const style = {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 2 + 1}px`,
      height: `${Math.random() * 2 + 1}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 5 + 2}s`,
    };
    return <div key={i} className="star" style={style}></div>;
  });

  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      <div className="absolute inset-0 -z-20 h-full w-full bg-background" />
      <div id="stars">{stars}</div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div className="pointer-events-none absolute inset-0 -z-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
}
