
import { Plane } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  showText?: boolean;
}

export function Logo({ showText = true }: LogoProps) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Plane className="h-8 w-8 text-primary transition-all duration-300" />
      <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          showText ? "max-w-[150px] opacity-100" : "max-w-0 opacity-0"
        )}>
        <span className="text-2xl font-bold font-headline text-foreground whitespace-nowrap">
          SugVoyage
        </span>
      </div>
    </Link>
  );
}
