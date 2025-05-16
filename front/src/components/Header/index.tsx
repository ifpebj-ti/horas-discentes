import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars } from 'react-icons/fa';
import Menu from '@/components/Menu';
import { User } from 'next-auth';

interface HeaderProps {
  menuTitle: string;
  user: User
}

const Header: React.FC<HeaderProps> = ({ menuTitle, user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white border-b shadow-sm relative z-20">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex flex-col">
          <Link href="/">
            <Image src="/img/logo.svg" alt="Logo IFPE" width={130} height={60} />
          </Link>

          <div className="flex items-center gap-2 mt-2 px-2">
            <button onClick={toggleMenu} aria-label="Abrir menu" className="text-blue-600">
              <FaBars size={20} />
            </button>
            <span className="text-gray-700 text-sm font-bold tracking-wide">
              {menuTitle}
            </span>
          </div>
        </div>

        <Link
          href="/"
          onClick={() => {
            closeMenu();
          }}
          className="text-blue-600 text-sm font-medium"
        >
          Sair
        </Link>
      </div>

      {menuOpen && (
        <Menu
          user={{ name: user.name ?? '', role: (user as any).role ?? '' }}
          closeMenu={closeMenu}
        />
      )}
    </header>
  );
};

export default Header;
