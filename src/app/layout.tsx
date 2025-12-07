import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import ConditionalHeader from '@/components/layout/ConditionalHeader';
import ConditionalBottomNav from '@/components/layout/ConditionalBottomNav';
import ConditionalMain from '@/components/layout/ConditionalMain';
import ConditionalDesktopNav from '@/components/layout/ConditionalDesktopNav';
import { SidebarProvider } from '@/components/ui/sidebar';
import { PinGuardProvider } from '@/components/auth/PinGuardProvider';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'SugVoyage',
  description: 'Your AI-powered travel companion for Cebu.',
  keywords: ['travel', 'Cebu', 'AI', 'tourism', 'Philippines'],
  authors: [{ name: 'SugVoyage Team' }],
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="dns-prefetch" href="https://placehold.co" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <SidebarProvider>
          <AuthProvider>
            <PinGuardProvider>
              <div className="relative flex min-h-screen w-full flex-col">
                <ConditionalDesktopNav />
                <ConditionalMain>
                  <ConditionalHeader />
                  {children}
                </ConditionalMain>
                <ConditionalBottomNav />
              </div>
            </PinGuardProvider>
          </AuthProvider>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
