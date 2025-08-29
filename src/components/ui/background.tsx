export function Background() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-background">
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-[radial-gradient(circle_farthest-side,rgba(138,43,226,.15),rgba(255,255,255,0))]"></div>
      <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[radial-gradient(circle_farthest-side,rgba(100,20,255,.15),rgba(255,255,255,0))]"></div>
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center"
        style={{
          backgroundImage:
            'url(https://assets.aceternity.com/textures/stars.png)',
          animation: 'animate-stars 240s linear infinite',
        }}
      ></div>
      <div className="absolute inset-0 h-full w-full">
        <div
          className="absolute h-full w-full bg-repeat"
          style={{
            backgroundImage:
              'url(https://assets.aceternity.com/textures/grid.png)',
          }}
        ></div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 h-full w-full [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="absolute inset-0 z-20 overflow-hidden">
        <div className="absolute bottom-0 left-1/2 h-4/5 w-1/2 -translate-x-1/2 rounded-t-full bg-gradient-to-t from-background via-transparent to-transparent"></div>
        {[...Array(20)].map((_, i) => (
          <div
            key={`shooting-star-${i}`}
            className="absolute h-0.5 w-0.5 rounded-full bg-primary shadow-[0_0_0_1px_#ffffff10]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `animate-shooting-star ${
                Math.random() * 8 + 4
              }s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            <div
              className="absolute top-1/2 -z-10 h-[1px] w-[50px] -translate-y-1/2 bg-gradient-to-r from-primary to-transparent"
              style={{
                transform: 'rotate(-45deg)',
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
}
