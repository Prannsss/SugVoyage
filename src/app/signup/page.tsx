'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BackgroundCarousel } from '@/components/auth/BackgroundCarousel';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the signup logic
    // For now, redirect to verify email page
    router.push('/verify-email');
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <BackgroundCarousel />
      
      <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-xl text-white shadow-2xl rounded-3xl">
        <CardHeader className="space-y-3 text-center pb-2">
          <div className="flex justify-center mb-2">
            <Logo />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight font-headline">Create Account</CardTitle>
          <CardDescription className="text-gray-200 text-base">
            Start your journey exploring Cebu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 pt-4">
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Display Name - "What should we call you" */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-sm font-medium text-gray-200">What should we call you?</Label>
              <Input 
                id="displayName" 
                placeholder="Enter your name or nickname" 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                autoComplete="name"
                className="h-14 bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus-visible:ring-primary/50 rounded-2xl text-base px-4"
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-200">Email</Label>
              <Input 
                id="email" 
                placeholder="name@example.com" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoCapitalize="none" 
                autoComplete="email" 
                autoCorrect="off"
                className="h-14 bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus-visible:ring-primary/50 rounded-2xl text-base px-4"
                required
              />
            </div>
            
            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-200">Password</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-white/10 border-white/30 text-white placeholder:text-gray-400 focus-visible:ring-primary/50 rounded-2xl text-base px-4"
                required
              />
              <p className="text-xs text-gray-400 pt-1">Must be at least 8 characters</p>
            </div>
            
            {/* Sign Up Button - Material 3 Expressive style */}
            <Button 
              type="submit"
              className="w-full h-14 font-semibold text-base rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Create Account
            </Button>
          </form>
          
          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent backdrop-blur-sm px-4 text-gray-300 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Sign Up - Material 3 Expressive style */}
          <Button 
            variant="outline" 
            className="w-full h-14 bg-white/10 border-white/30 hover:bg-white/20 hover:text-white text-white rounded-full transition-all duration-300"
          >
            <GoogleIcon className="mr-3 h-5 w-5" />
            <span className="font-medium">Continue with Google</span>
          </Button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-200 pt-4">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </div>
          
          {/* Terms */}
          <p className="text-center text-xs text-gray-400 pt-2">
            By creating an account, you agree to our{' '}
            <Link href="#" className="text-primary hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
