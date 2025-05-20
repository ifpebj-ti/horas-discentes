'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

import Header from '@/components/Header';

interface LayoutProps {
  children: ReactNode;
}

const user = {
  id: '1',
  name: 'Maria',
  email: 'coordenador@example.com',
  role: 'coordenador'
};

const getTitleFromPath = (path: string): string => {
  const lastSegment = path.split('/').filter(Boolean).pop() ?? '';

  switch (lastSegment) {
    case 'coordenacao':
      return 'Coordenação';
    case 'certificados':
      return 'Validação de Certificados';
    case 'turmas':
      return 'Turmas';
    case 'alunos':
      return 'Alunos';
    case 'secretaria':
      return 'Secretaria';
    case 'campus':
      return 'Campus';
    case 'configuracoes':
      return 'Configurações';
    default:
      return 'Início';
  }
};

export default function CoordenacaoLayout({ children }: LayoutProps) {
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
