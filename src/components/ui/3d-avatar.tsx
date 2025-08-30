'use client';
import Image from 'next/image';

export function ThreeDAvatar() {
  return (
    <div className="absolute bottom-0 right-0 md:right-10 lg:right-20 w-48 h-96 md:w-64 md:h-[500px] lg:w-80 lg:h-[600px] pointer-events-none">
      <div className="w-full h-full animate-float">
        <Image
          src="https://picsum.photos/400/800"
          alt="3D Avatar pointing to the title"
          width={400}
          height={800}
          className="object-contain"
          data-ai-hint="3d avatar pointing"
        />
      </div>
    </div>
  );
}
