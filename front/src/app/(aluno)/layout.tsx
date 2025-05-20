'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import Header from '@/components/Header';

interface LayoutProps {
  children: ReactNode;
}

const user = {
  id: '1',
  name: 'Silva',
  email: 'silva@example.com',
  role: 'aluno'
};

const getTitleFromPath = (path: string): string => {
  const lastSegment = path.split('/').filter(Boolean).pop() ?? '';

  switch (lastSegment) {
    case 'aluno':
      return 'Aluno';
    case 'certificados':
      return 'Visualizar Certificados';
    default:
      return 'Início';
  }
};

export default function AlunoLayout({ children }: LayoutProps) {
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
