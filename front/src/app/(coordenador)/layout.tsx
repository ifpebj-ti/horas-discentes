'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import Header from '@/components/Header';
import ProtectedLayout from '@/components/ProtectedLayout';
import Version from '@/components/Version/Version';

const getTitleFromPath = (path: string): string => {
  const parts = path.split('/').filter(Boolean);

  if (parts[0] === 'curso') {
    if (parts.length === 1) return 'Cursos';
    if (parts.length === 2) return `Curso ${parts[1]}`;
    if (parts.length >= 3) return `Turma ${parts[2]}`;
  }

  switch (parts[0]) {
    case 'coordenacao':
      return 'Coordenação';
    case 'certificados':
      return 'Validação de Certificados';
    case 'turmas':
      return 'Turmas';
    case 'secretaria':
      return 'Secretaria';
    default:
      return 'Início';
  }
};

export default function CoordenacaoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const menuTitle = getTitleFromPath(pathname);

  const user = {
    id: session?.user.entidadeId || '',
    name: session?.user.name || '',
    email: session?.user.email || '',
    role: session?.user.role || '',
    cursoId: session?.user.cursoId || ''
  };

  return (
    <ProtectedLayout allowedRoles={['coordenador']}>
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
