'use client';

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      <div className="absolute inset-0 -z-20 h-full w-full bg-background" />
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute left-0 top-0 h-40 w-40 bg-primary opacity-20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 h-40 w-40 bg-accent opacity-20 translate-x-1/2 translate-y-1/2 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute inset-0 -z-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
}
