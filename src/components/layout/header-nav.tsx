'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Mic,
  Archive,
  FileSearch,
  LineChart,
  Bell,
  Settings,
  AudioLines,
  Smile,
  Database,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/live-monitoring', label: 'Live Monitoring', icon: Mic },
  { href: '/archive', label: 'Archive', icon: Archive },
  { href: '/denoise-studio', label: 'Denoise Studio', icon: AudioLines },
  { href: '/stress-detection', label: 'Stress Detection', icon: Smile },
  { href: '/reports', label: 'Reports', icon: LineChart },
  { href: '/alerts', label: 'Alerts', icon: Bell },
  { href: '/dataset', label: 'Dataset', icon: Database },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function HeaderNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  if (isMobile) {
    return (
       <nav className="flex flex-col gap-1 px-2 mt-4">
        {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
                 <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors',
                    isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    )}
                >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                </Link>
            )
        })}
       </nav>
    );
  }

  return (
    <nav className="flex items-center gap-1 p-1 rounded-full bg-card border">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
