import Header from '@/components/Header';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function AlunoLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout allowedRoles={['aluno']}>
      <div className="min-h-screen bg-white text-black">
        <Header />

        <main className="mt-6 px-5 md:px-10 pb-5">{children}</main>

        <footer className="bg-white border-t py-4 text-center text-xs text-gray-500">
          IFPE - Campus Belo Jardim
          <br />
          Endereço: Av. Sebastião Rodrigues da Costa, s/n - São Pedro, Belo
          Jardim - PE, 55145-065
          <br />
          Telefone: (81) 3411-3200
          <div className="relative px-2 py-1 text-center text-xs text-token-text-secondary md:px-[60px] no-underline ">
            <p>
              © 2025 Desenvolvido por{' '}
              <a
                href="https://github.com/erison7596"
                target="_blank"
                rel="noreferrer"
              >
                Erison Cavalcante
              </a>
              <span> & </span>
              <a
                href="https://github.com/Erysilva98"
                target="_blank"
                rel="noreferrer"
              >
                Erimilson Silva
              </a>
            </p>
          </div>
        </footer>
      </div>
    </ProtectedLayout>
  );
}
