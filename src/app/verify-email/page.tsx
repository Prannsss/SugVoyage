'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BackgroundCarousel } from '@/components/auth/BackgroundCarousel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/Logo';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...verificationCode];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    
    setVerificationCode(newCode);
  };

  const handleResend = async () => {
    setIsResending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsResending(false);
    setCountdown(60);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const code = verificationCode.join('');
    
    if (code.length === 6) {
      // Here you would typically verify the code with your backend
      setIsVerified(true);
      // Redirect after a short delay to show success
      setTimeout(() => {
        router.push('/feed');
      }, 2000);
    }
  };

  if (isVerified) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center p-4">
        <BackgroundCarousel />
        
        <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-xl text-white shadow-2xl rounded-3xl">
          <CardContent className="py-12 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold font-headline">Email Verified!</h2>
              <p className="text-gray-300">Your account has been successfully verified.</p>
              <p className="text-sm text-gray-400">Redirecting you to the app...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      <BackgroundCarousel />
      
      <Card className="w-full max-w-md bg-white/10 border-white/20 backdrop-blur-xl text-white shadow-2xl rounded-3xl">
        <CardHeader className="space-y-3 text-center pb-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight font-headline">Verify Your Email</CardTitle>
          <CardDescription className="text-gray-200 text-base">
            We&apos;ve sent a 6-digit code to your email address. Enter it below to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <form onSubmit={handleVerify} className="space-y-6">
            {/* Verification Code Input */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-200 text-center block">Verification Code</Label>
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {verificationCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    pattern="\d"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-white/10 border-white/30 text-white focus-visible:ring-primary/50 rounded-xl"
                  />
                ))}
              </div>
            </div>
            
            {/* Verify Button */}
            <Button 
              type="submit"
              disabled={verificationCode.join('').length !== 6}
              className="w-full h-14 font-semibold text-base rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify Email
            </Button>
          </form>

          {/* Resend Code */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-300">Didn&apos;t receive the code?</p>
            {countdown > 0 ? (
              <p className="text-sm text-gray-400">Resend code in {countdown}s</p>
            ) : (
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={isResending}
                className="text-primary hover:text-primary/80 hover:bg-white/10"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </Button>
            )}
          </div>

          {/* Back to Signup */}
          <div className="pt-4">
            <Link 
              href="/signup" 
              className="flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
