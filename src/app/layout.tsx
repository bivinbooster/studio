import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'FinTrack',
  description:
    'Track your expenses, manage your budget, and gain financial insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased relative">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-gradient-radial"></div>
        <div className="absolute bottom-0 left-0 right-0 top-0 -z-10 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute -bottom-40 -left-20 -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        <div className="absolute -right-40 -top-40 -z-10 h-80 w-80 float rounded-full bg-[radial-gradient(circle_farthest-side,rgba(0,128,255,.15),rgba(255,255,255,0))]"></div>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
