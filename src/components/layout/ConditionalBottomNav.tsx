'use client';

import { usePathname } from 'next/navigation';
import BottomNav from './BottomNav';

// Pages that should not show the bottom navigation
const hiddenRoutes = ['/messages', '/onboarding', '/login', '/signup', '/verify-email', "/settings"];

export default function ConditionalBottomNav() {
  const pathname = usePathname();
  
  // Hide bottom nav on auth pages, onboarding, and messages
  const shouldHide = hiddenRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  
  if (shouldHide || hiddenRoutes.includes(pathname)) {
    return null;
  }
  
  return <BottomNav />;
}
