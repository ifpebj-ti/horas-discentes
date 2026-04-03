'use client';

import Image from 'next/image';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

import UserProfile from '@/components/UserProfile/index';

const handleLogout = () => {
  signOut({ callbackUrl: window.location.origin });
};

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="top-0 left-0 w-full bg-white shadow z-50">
      <div className="mx-auto px-4 md:px-10 py-3 flex items-center justify-between gap-2 w-full">

        {/* Logo Desktop */}
        <div className="flex-shrink-0 hidden md:block">
          <Link href="/">
            <Image
              src="/img/logo.png"
              alt="Logo IFPE"
              width={130}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Logo Mobile */}
        <div className="flex-shrink-0 md:hidden">
          <Link href="/">
            <Image
              src="/img/logo.png"
              alt="Logo IFPE"
              width={80}
              height={40}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Título centralizado */}
        <h1 className="md:text-xl font-semibold text-gray-800 text-center">Hora+</h1>

        {/* Menu do usuário */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {session?.user ? (
            <UserProfile user={session.user} onLogout={handleLogout} />
          ) : (
            <div className="w-10 h-10" />
          )}
        </div>
      </div>
    </header>
  );
}
