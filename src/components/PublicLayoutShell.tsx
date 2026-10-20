'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from '@/components/AnnouncementBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import ScrollReveal from '@/components/ScrollReveal';
import UtmTracker from '@/components/UtmTracker';
import MobileQuickBar from '@/components/MobileQuickBar';

export default function PublicLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    // Completely isolate the Admin Portal: No public announcement bar, header, or footer
    return (
      <main id="admin-root" style={{ minHeight: '100vh', width: '100%', position: 'relative' }}>
        {children}
      </main>
    );
  }

  // Public Facing Website Shell
  return (
    <>
      <UtmTracker />
      <ScrollProgressBar />
      <ScrollReveal />
      <AnnouncementBar />
      <Header />
      <main id="main-content" style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
      <MobileQuickBar />
    </>
  );
}
