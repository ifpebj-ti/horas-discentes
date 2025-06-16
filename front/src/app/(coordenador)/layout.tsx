'use client';
import { usePathname } from 'next/navigation';

import Header from '@/components/Header';

import { MOCK_COORDENADORES } from '@/lib/coordenacaoMock';
import * as Types from '@/types';

const getTitleFromPath = (path: string): string => {
  const parts = path.split('/').filter(Boolean);

  if (parts[0] === 'curso') {
    if (parts.length === 1) return 'Cursos';              // /curso
    if (parts.length === 2) return `Curso ${parts[1]}`;   // /curso/:id
    if (parts.length >= 3) return `Turma ${parts[2]}`;    // /curso/:id/:turmaId
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
}: Readonly<{
  children: React.ReactNode;
}>) {
  const coordenador: Types.Coordenador = MOCK_COORDENADORES[0];
  const userForHeader: Types.Usuario = {
    id: String(coordenador.id),
    name: coordenador.nome,
    email: coordenador.email,
    role: coordenador.role
  };
  const pathname = usePathname();
  const menuTitle = getTitleFromPath(pathname);

  return (
    <div className="min-h-screen bg-white">
      <header className="shadow-md bg-gray-100 z-20 relative">
        <Header menuTitle={menuTitle} user={userForHeader} />
      </header>
      <main>{children}</main>
    </div>
  );
}
