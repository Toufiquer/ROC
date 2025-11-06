'use client';

/**
 * Main Layout Component for Crypto App
 */

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface CryptoLayoutProps {
  children: ReactNode;
}

export default function CryptoLayout({ children }: CryptoLayoutProps) {
  return (
    <div className="min-h-screen ">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="md:pl-64 pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-7xl">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
