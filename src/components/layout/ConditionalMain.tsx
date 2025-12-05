'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ConditionalMainProps {
  children: ReactNode;
}

// Pages that should not show the sidebar navigation (full-width layout)
const fullWidthRoutes = ['/onboarding', '/login', '/signup', '/verify-email'];

export default function ConditionalMain({ children }: ConditionalMainProps) {
  const pathname = usePathname();
  
  // Remove bottom padding on messages page since bottom nav is hidden
  const isMessagesPage = pathname === '/messages';
  
  // Check if current route should use full-width layout
  const isFullWidth = fullWidthRoutes.some(route => pathname.startsWith(route));
  
  return (
    <main className={`flex-1 ${isMessagesPage || isFullWidth ? 'pb-0' : 'pb-24'} ${isFullWidth ? '' : 'md:pl-64'} md:pb-0`}>
      <div className="h-full w-full" suppressHydrationWarning>
        {children}
      </div>
    </main>
  );
}
