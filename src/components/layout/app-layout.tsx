'use client';
import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { HeaderNav } from './header-nav';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Bell, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Link from 'next/link';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/landing" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-primary"
            >
              <path d="M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
              <path d="M12 12m-7 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0" />
              <path d="M12 3L12 3" />
              <path d="M3 12L3 12" />
              <path d="M21 12L21 12" />
              <path d="M12 21L12 21" />
            </svg>
            <h1 className="text-xl font-semibold font-headline text-primary">
              AirScribe
            </h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          {/* This content is for the mobile drawer */}
          <HeaderNav isMobile={true}/>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="justify-start w-full gap-2 px-2 text-left h-14"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src="https://picsum.photos/seed/avatar/40/40"
                    alt="User"
                  />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Sam Altman</span>
                  <span className="text-xs text-muted-foreground">
                    sam.altman@example.com
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mb-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Sam Altman</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Administrator
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b bg-background/80 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="md:hidden" />
             <Link href="/landing" className='flex items-center gap-2 md:hidden'>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-primary"
                >
                  <path d="M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
                  <path d="M12 12m-7 0a7 7 0 1 0 14 0 7 7 0 1 0-14 0" />
                </svg>
             </Link>
          </div>

          <div className="hidden md:flex">
             <HeaderNav />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notifications">
              <Bell className="w-5 h-5" />
            </Button>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" className="hidden gap-2 px-2 text-left h-14 md:flex">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://picsum.photos/seed/avatar/40/40" alt="User" />
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Sam Altman</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Administrator
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><Settings className="mr-2" />Settings</DropdownMenuItem>
              <DropdownMenuItem><LogOut className="mr-2" />Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
