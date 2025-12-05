
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface LogoProps {
  showText?: boolean;
}

export function Logo({ showText = true }: LogoProps) {
  const pathname = usePathname();
  
  // On auth pages, logo should not be a link
  const isAuthPage = ['/onboarding', '/login', '/signup', '/verify-email'].some(
    route => pathname.startsWith(route)
  );

  const content = (
    <>
      <Image 
        src="/favicon.ico" 
        alt="SugVoyage Logo" 
        width={32} 
        height={32} 
        className="h-8 w-8 transition-all duration-300" 
      />
      <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          showText ? "max-w-[150px] opacity-100" : "max-w-0 opacity-0"
        )} suppressHydrationWarning>
        <span className={cn(
          "text-2xl font-bold font-headline whitespace-nowrap",
          isAuthPage ? "text-white" : "text-foreground"
        )}>
          SugVoyage
        </span>
      </div>
    </>
  );

  if (isAuthPage) {
    return (
      <div className="flex items-center gap-2">
        {content}
      </div>
    );
  }

  return (
    <Link href="/feed" className="flex items-center gap-2">
      {content}
    </Link>
  );
}
