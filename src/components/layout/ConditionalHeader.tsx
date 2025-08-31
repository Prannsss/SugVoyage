'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide header on messages page
  if (pathname === '/messages') {
    return null;
  }
  
  return <Header />;
}
