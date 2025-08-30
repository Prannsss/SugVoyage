import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import DesktopNav from '@/components/layout/DesktopNav';
import { SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'SugVoyage',
  description: 'Your AI-powered travel companion for Cebu.',
  keywords: ['travel', 'Cebu', 'AI', 'tourism', 'Philippines'],
  authors: [{ name: 'SugVoyage Team' }],
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="dns-prefetch" href="https://placehold.co" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <SidebarProvider>
          <div className="relative flex min-h-screen w-full flex-col">
            <DesktopNav />
            <div className="flex flex-1 flex-col md:pl-64" suppressHydrationWarning>
              <Header />
              <main className="flex-1 pb-24 md:pb-0">
                <div className="h-full w-full" suppressHydrationWarning>
                  {children}
                </div>
              </main>
            </div>
            <BottomNav />
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
