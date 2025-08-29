import { RegistrationForm } from '@/components/auth/registration-form';
import { Logo } from '@/components/ui/logo';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-6 gap-3">
          <Logo />
          <h1 className="text-2xl font-bold text-foreground">FinTrack</h1>
        </Link>
        <Card className="hover:shadow-[0_0_50px_10px_rgba(138,43,226,0.3)]">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Start your journey to financial freedom.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationForm />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-primary hover:underline"
              >
                Log in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
