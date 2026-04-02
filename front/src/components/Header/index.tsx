'use client';

import Image from 'next/image';
import Link from 'next/link';

import { useSignOut } from '@/hooks/useSignOut';

const Header = () => {
  const { handleSignOut } = useSignOut();

  return (
    <header className="bg-white border-b shadow-sm relative z-20">
      <div className="flex items-center justify-between px-4 py-2">
        <Link href="/">
          <Image
            src="/img/logo.png"
            alt="Logo IFPE"
            width={130}
            height={60}
          />
        </Link>

        <span className="text-lg font-semibold text-gray-800">Hora+</span>

        <button
          onClick={handleSignOut}
          className="text-primary text-sm font-medium cursor-pointer"
        >
          Sair
        </button>
      </div>
    </header>
  );
};

export default Header;
