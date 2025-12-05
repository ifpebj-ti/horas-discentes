'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import Header from '@/components/Header';
import ProtectedLayout from '@/components/ProtectedLayout';
import Version from '@/components/Version/Version';

const getTitleFromPath = (path: string): string => {
  const last = path.split('/').filter(Boolean).pop() ?? '';
  switch (last) {
    case 'curso':
      return 'Administração Cursos';
    case 'curso/[id]':
      return 'Gerenciar Curso';
    case 'relatorios':
      return 'Relatórios';
    case 'configuracoes':
      return 'Configurações';
    default:
      return 'Administração';
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
      <div className="min-h-screen bg-white flex flex-col">
        <header className="shadow-md bg-gray-100 z-20 relative shrink-0">
          <Header menuTitle={menuTitle} user={user} />
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
        <footer className="w-full border-t bg-gray-50 px-4 py-2 flex justify-center items-center shrink-0">
          <Version />
        </footer>
      </div>
    </ProtectedLayout>
  );
}
