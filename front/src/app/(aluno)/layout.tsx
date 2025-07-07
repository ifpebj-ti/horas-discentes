'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import Header from '@/components/Header';
import ProtectedLayout from '@/components/ProtectedLayout';

const getTitleFromPath = (path: string): string => {
  const last = path.split('/').filter(Boolean).pop() ?? '';
  switch (last) {
    case 'aluno':
      return 'Aluno';
    case 'novo':
      return 'Novo Certificado';
    case 'certificado':
      return 'Visualizar Certificados';
    case 'perguntas':
      return 'Perguntas Frequentes';
    default:
      return 'Início';
  }
};

export default function AlunoLayout({
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
    <ProtectedLayout allowedRoles={['aluno']}>
      <div className="min-h-screen bg-white text-black">
        <header className="shadow-md bg-gray-100 z-20 relative">
          <Header menuTitle={menuTitle} user={user} />
        </header>
        <main>{children}</main>
        <footer className="bg-white border-t py-4 text-center text-xs text-gray-500">
          IFPE - Campus Belo Jardim
          <br />
          Endereço: Av. Sebastião Rodrigues da Costa, s/n - São Pedro, Belo
          Jardim - PE, 55145-065
          <br />
          Telefone: (81) 3411-3200
          <br />© 2025 Desenvolvido por Erison Cavalcante e Erimilson Silva.
        </footer>
      </div>
    </ProtectedLayout>
  );
}
