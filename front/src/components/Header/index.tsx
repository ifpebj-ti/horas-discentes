'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Menu from '@/components/Menu';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import * as Types from '@/types';
import { useSignOut } from '@/hooks/useSignOut';


interface HeaderProps {
  menuTitle: string;
  user: Types.Usuario;
}

const Header = ({ menuTitle, user }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleSignOut } = useSignOut();

  return (
    <header className="bg-white border-b shadow-sm relative z-20">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex flex-col">
          <Link href="/">
            <Image
              src="/img/logo.png"
              alt="Logo IFPE"
              width={130}
              height={60}
            />
          </Link>

          <div className="flex items-center gap-2 mt-2 px-2">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button aria-label="Abrir menu" className="text-primary">
                  <FaBars size={20} />
                </button>
              </SheetTrigger>
              <Menu
                user={{
                  name: user.name || '',
                  role: user.role
                }}
                onLinkClick={() => setMenuOpen(false)}
              />
            </Sheet>
            <span className="text-gray-700 text-sm font-bold tracking-wide">
              {menuTitle}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setMenuOpen(false);
            handleSignOut();
          }}
          className="text-primary text-sm font-medium cursor-pointer"
        >
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;
