

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, User, BookOpen, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarHeader,
} from '@/components/ui/sidebar';
import { Separator } from '../ui/separator';
import { Logo } from '../Logo';

const navItems = [
  { href: '/', label: 'Explore', icon: Home },
  { href: '/itinerary', label: 'Itinerary', icon: Map },
  { href: '/feed', label: 'Feed', icon: BookOpen },
  { href: '/profile/alex_doe', label: 'Profile', icon: User },
];

const bottomNavItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
];

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <div className="hidden md:block md:w-64 fixed top-0 left-0 h-full">
        <Sidebar className="border-r">
            <SidebarHeader className="p-4">
                <div className="flex justify-center w-full">
                    <Logo />
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => {
                        const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname.startsWith(item.href));
                        return (
                            <SidebarMenuItem key={item.href} className="w-full">
                                <SidebarMenuButton asChild isActive={isActive}>
                                    <Link href={item.href} className="flex items-center gap-4">
                                        <item.icon className="h-8 w-8" />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <div className="mt-auto">
                 <Separator />
                <SidebarMenu>
                    {bottomNavItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <SidebarMenuItem key={item.href} className="w-full">
                                <SidebarMenuButton asChild isActive={isActive}>
                                    <Link href={item.href} className="flex items-center gap-4">
                                        <item.icon className="h-8 w-8" />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </div>
        </Sidebar>
    </div>
  );
}
