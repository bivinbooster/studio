import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { ArrowRight } from 'lucide-react';
import { AnimatedHeading } from '@/components/ui/animated-heading';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-background/80 px-4 backdrop-blur-sm sm:px-6 justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="text-xl font-bold text-foreground">FinTrack</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="relative w-full h-[80vh] flex items-center justify-center text-center">
          <div className="relative z-10 max-w-4xl px-4">
            <AnimatedHeading
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-accent"
              text="Take Control of Your Finances"
            />
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              FinTrack is a powerful and intuitive app that helps you track
              expenses, manage budgets, and achieve your financial goals with
              AI-powered insights.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register">
                  Get Started for Free <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
