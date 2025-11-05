'use client';

/**
 * Bottom Navigation Component (Mobile)
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    name: 'Home',
    path: '/crypto',
    icon: Home,
  },
  {
    name: 'Finance',
    path: '/crypto/finance',
    icon: TrendingUp,
  },
  {
    name: 'Summary',
    path: '/crypto/summary',
    icon: BarChart3,
  },
  {
    name: 'Settings',
    path: '/crypto/settings',
    icon: Settings,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 transition-colors',
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
