'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

// Pages that should not show the header
const hiddenRoutes = ['/messages', '/onboarding', '/login', '/signup', '/verify-email', '/geolocation', '/feed'];

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Hide header on auth pages, onboarding, and messages
  const shouldHide = hiddenRoutes.some(route => pathname === route || pathname.startsWith(route + '/'));
  
  if (shouldHide || hiddenRoutes.includes(pathname)) {
    return null;
  }
  
  return <Header />;
}
