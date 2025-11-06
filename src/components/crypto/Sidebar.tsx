'use client';

/**
 * Sidebar Navigation Component (Desktop)
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, TrendingUp, BarChart3, Settings, Bitcoin } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    name: 'Home',
    path: '/',
    icon: Home,
    description: 'Overview & Stats',
  },
  {
    name: 'Finance',
    path: '/finance',
    icon: TrendingUp,
    description: 'Financial Strategies',
  },
  {
    name: 'Summary',
    path: '/summary',
    icon: BarChart3,
    description: 'Data Analysis',
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    description: 'Import & Manage',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 md:z-50 bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-800">
        <Bitcoin className="w-8 h-8 text-blue-400" />
        <div>
          <h1 className="text-lg font-bold">Crypto Analyzer</h1>
          <p className="text-xs text-gray-400">CSV Data Analysis</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white',
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-xs text-gray-400 truncate">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="px-3 py-2 bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-400">Powered by</p>
          <p className="text-sm font-semibold">Next.js 14 + Zustand</p>
        </div>
      </div>
    </aside>
  );
}
