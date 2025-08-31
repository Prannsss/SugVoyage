'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface ConditionalMainProps {
  children: ReactNode;
}

export default function ConditionalMain({ children }: ConditionalMainProps) {
  const pathname = usePathname();
  
  // Remove bottom padding on messages page since bottom nav is hidden
  const isMessagesPage = pathname === '/messages';
  
  return (
    <main className={`flex-1 ${isMessagesPage ? 'pb-0' : 'pb-24'} md:pb-0`}>
      <div className="h-full w-full" suppressHydrationWarning>
        {children}
      </div>
    </main>
  );
}
