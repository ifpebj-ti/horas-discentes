'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import Header from '@/components/Header';

interface LayoutProps {
  children: ReactNode;
}

const user = {
  id: '1',
  name: 'Admin',
  email: 'admin@example.com',
  role: 'administrador'
};

const getTitleFromPath = (path: string): string => {
  const lastSegment = path.split('/').filter(Boolean).pop() ?? '';

  switch (lastSegment) {
    case 'administrador':
      return 'Administrador';
    case 'usuarios':
      return 'Gerenciar Usuários';
    case 'relatorios':
      return 'Relatórios';
    case 'configuracoes':
      return 'Configurações';
    default:
      return 'Início';
  }
};

export default function AdministradorLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const menuTitle = getTitleFromPath(pathname);

  return (
    <div className="min-h-screen bg-white">
      <header className="shadow-md bg-gray-100 z-20 relative">
        <Header menuTitle={menuTitle} user={user.name} role={user.role} />
      </header>
      <main>{children}</main>
    </div>
  );
}
