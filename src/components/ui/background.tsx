export function Background() {
  return (
    <div className="fixed inset-0 -z-10 h-full w-full">
      <div className="absolute inset-0 -z-20 h-full w-full bg-background" />
      <div className="absolute inset-0 -z-10 h-full w-full bg-grid" />
      <div className="pointer-events-none absolute inset-0 -z-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
    </div>
  );
}
