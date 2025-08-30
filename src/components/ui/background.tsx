'use client';

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        {/* You can replace this with your own video file */}
        <source
          src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
}
