
'use client'
import { AppLayout } from '@/components/layout/app-layout';

export default function AppSubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <AppLayout>
          {children}
      </AppLayout>
  );
}
