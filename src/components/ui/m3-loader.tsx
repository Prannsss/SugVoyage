'use client';

import { cn } from '@/lib/utils';

interface M3LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function M3Loader({ size = 'md', className }: M3LoaderProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      <svg
        className="m3-loader-spin"
        viewBox="0 0 50 50"
      >
        <circle
          className="stroke-primary"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="80, 200"
          strokeDashoffset="0"
        >
          <animate
            attributeName="stroke-dasharray"
            values="1, 200; 89, 200; 89, 200"
            dur="1.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            values="0; -35; -124"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}

interface M3LoadingOverlayProps {
  message?: string;
}

export function M3LoadingOverlay({ message = 'Loading...' }: M3LoadingOverlayProps) {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        <M3Loader size="lg" />
        <p className="text-white/80 text-lg font-medium animate-pulse">{message}</p>
      </div>
    </div>
  );
}
