'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FaSignOutAlt } from 'react-icons/fa';

import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import Version from '@/components/Version/Version';

import { ROUTES } from '@/config/routes';
import { useSignOut } from '@/hooks/useSignOut';
import { cn } from '@/lib/utils';

type Props = {
  user: {
    name: string;
    role: string;
  };
  onLinkClick: () => void;
};

const MenuContent: React.FC<Props> = ({ user, onLinkClick }) => {
  const pathname = usePathname();
  const role = user?.role as keyof typeof ROUTES;
  const menuItems = ROUTES[role] || [];
  const { handleSignOut } = useSignOut();

  return (
    <SheetContent
      side="left"
      className="w-[300px] sm:w-[350px] flex flex-col p-0"
    >
      <SheetHeader className="p-6 border-b text-left">
        <SheetTitle className="text-xl font-bold text-primary">
          HoraMais
        </SheetTitle>
        <SheetDescription>
          Olá, <span className="font-medium text-gray-900">{user.name}</span>
        </SheetDescription>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="flex flex-col space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onLinkClick}
                className={cn(
                  'flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors hover:bg-gray-100',
                  isActive
                    ? 'bg-primary/10 text-primary border-r-4 border-primary'
                    : 'text-gray-700'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5',
                    isActive ? 'text-primary' : 'text-gray-500'
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4 bg-gray-50">
        <button
          onClick={() => {
            onLinkClick();
            handleSignOut();
          }}
          className="flex items-center gap-3 w-full px-2 py-2 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors"
        >
          <FaSignOutAlt className="w-5 h-5" />
          Sair
        </button>
        <div className="mt-4 px-2">
          <Version />
        </div>
      </div>
    </SheetContent>
  );
};

export default MenuContent;
