'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import Header from '@/components/Header';
import ProtectedLayout from '@/components/ProtectedLayout';

const getTitleFromPath = (path: string): string => {
  const last = path.split('/').filter(Boolean).pop() ?? '';
  switch (last) {
    case 'curso':
      return 'Cursos';
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

export default function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const menuTitle = getTitleFromPath(pathname);

  const user = {
    id: '',
    name: session?.user.name || '',
    email: session?.user.email || '',
    role: session?.user.role || ''
  };

  return (
    <ProtectedLayout allowedRoles={['admin']}>
      <div className="min-h-screen bg-white">
        <header className="shadow-md bg-gray-100 z-20 relative">
          <Header menuTitle={menuTitle} user={user} />
        </header>
        <main>{children}</main>
      </div>
    </ProtectedLayout>
  );
}
