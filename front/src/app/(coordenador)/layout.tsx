'use client';
import { usePathname } from 'next/navigation';

import Header from '@/components/Header';

import { MOCK_USER } from '@/lib/alunoMock';
import * as Types from '@/types';

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

export default function CoordenacaoLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user: Types.Usuario = MOCK_USER;
  const pathname = usePathname();
  const menuTitle = getTitleFromPath(pathname);

  return (
    <div className="min-h-screen bg-white">
      <header className="shadow-md bg-gray-100 z-20 relative">
        <Header menuTitle={menuTitle} user={user} />
      </header>
      <main>{children}</main>
    </div>
  );
}
