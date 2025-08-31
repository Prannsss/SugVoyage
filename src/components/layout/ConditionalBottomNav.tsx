'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

export default function ConditionalBottomNav() {
  const pathname = usePathname();
  
  // Hide bottom nav on messages page
  if (pathname === '/messages') {
    return null;
  }
  
  return <BottomNav />;
}
