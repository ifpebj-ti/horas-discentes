'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars } from 'react-icons/fa';
import Menu from '@components/Menu';

const useAuth = () => ({
  user: {
    name: 'Usuário',
    email: 'usuario@ifpe.edu.br',
    role: 'coordinator'
  }
});

const Header: React.FC = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="bg-white border-b shadow-sm relative z-20">
      <div className="flex items-center justify-between px-4 py-2">
        <div className='flex flex-col'>
          {/* Logo */}
          <Link href="/">
            <Image src="/img/logo.svg" alt="Logo IFPE" width={112} height={40} />
          </Link>

          {/* Botão de menu + Início */}
          <div className="flex items-center gap-2">
            <button onClick={toggleMenu} aria-label="Abrir menu" className="text-blue-600">
              <FaBars size={20} />
            </button>
            <span className="text-gray-700 text-sm font-medium">Início</span>
          </div>
        </div>

        {/* Botão Sair */}
        {user && (
          <button
            onClick={() => {
              // lógica de logout
              closeMenu();
            }}
            className="text-blue-600 text-sm font-medium"
          >
            Sair
          </button>
        )}
      </div>

      {/* Menu responsivo */}
      {menuOpen && <Menu user={user} closeMenu={closeMenu} />}
    </header>
  );
};

export default Header;
