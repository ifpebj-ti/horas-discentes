'use client';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import * as Types from '@/types';
import { MOCK_USER } from '@/lib/alunoMock';

const getTitleFromPath = (path: string): string => {
  const lastSegment = path.split('/').filter(Boolean).pop() ?? '';

  switch (lastSegment) {
    case 'aluno':
      return 'Aluno';
    case 'novo':
      return 'Novo Certificado';
    case 'certificado':
      return 'Visualizar Certificados';
    default:
      return 'Início';
  }
};

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  const user: Types.Usuario = MOCK_USER;
  const pathname = usePathname();
  const menuTitle = getTitleFromPath(pathname);

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="shadow-md bg-gray-100 z-20 relative">
        <Header menuTitle={menuTitle} user={user} />
      </header>
      <main>{children}</main>
      {/* FOOTER -------------------------------------------------------------- */}
      <footer className="bg-white border-t py-4 text-center text-xs text-gray-500">
        IFPE - Campus Belo Jardim
        <br />
        Endereço: Av. Sebastião Rodrigues da Costa, s/n - São Pedro, Belo Jardim - PE, 55145-065
        <br />
        Telefone: (81) 3411-3200
        <br />
        © 2025 Desenvolvido por Erimilson Silva.
      </footer>
    </div>
  );
}
