'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react'; // Importa o useMemo

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

  // Desestrutura os dados da sessão para criar dependências primitivas
  const { entidadeId, name, email, role, isNewPpc, cursoId, turmaId } =
    session?.user || {};

  // Use useMemo para memoizar (estabilizar) o objeto user
  const user = useMemo(
    () => ({
      id: entidadeId || '',
      name: name || '',
      email: email || '',
      role: role || '',
      isNewPpc: isNewPpc || false,
      cursoId: cursoId || '',
      turmaId: turmaId || ''
    }),
    // O array de dependências agora usa valores primitivos (strings, booleans)
    // O objeto 'user' só será recriado se um desses valores realmente mudar.
    [entidadeId, name, email, role, isNewPpc, cursoId, turmaId]
  );

  return (
    <ProtectedLayout allowedRoles={['aluno']}>
      <div className="min-h-screen bg-white text-black">
        <header className="shadow-md bg-gray-100 z-20 relative">
          {/* Agora o 'user' é um objeto estável (memoizado) */}
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
          <div className="relative px-2 py-1 text-center text-xs text-token-text-secondary md:px-[60px]">
            <p>
              © 2025 Desenvolvido por{' '}
              <a
                href="https://github.com/erison7596"
                target="_blank"
                className="
                  relative font-bold text-[#1c2128] no-underline
                  transition-colors duration-300 ease-in-out
                  hover:text-[#1b2b41]
                  before:content-[''] before:absolute before:w-full before:h-[2px] before:-bottom-[2px] before:left-0
                  before:bg-[#1c2128] before:origin-left before:scale-x-0
                  before:transition-transform before:duration-300 before:ease-in-out
                  hover:before:scale-x-100
                "
                rel="noreferrer"
              >
                Erison
              </a>
            </p>
          </div>
        </footer>
      </div>
    </ProtectedLayout>
  );
}
