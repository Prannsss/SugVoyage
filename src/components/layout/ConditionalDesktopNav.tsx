'use client';

import { usePathname } from 'next/navigation';
import DesktopNav from './DesktopNav';

// Pages that should not show the sidebar navigation
const hiddenRoutes = ['/onboarding', '/login', '/signup', '/verify-email'];

export default function ConditionalDesktopNav() {
  const pathname = usePathname();
  
  // Hide sidebar on auth pages and onboarding
  const shouldHide = hiddenRoutes.some(route => pathname.startsWith(route));
  
  if (shouldHide) {
    return null;
  }
  
  return <DesktopNav />;
}
