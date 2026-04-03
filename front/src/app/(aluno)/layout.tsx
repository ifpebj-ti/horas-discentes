import Header from '@/components/Header';
import ProtectedLayout from '@/components/ProtectedLayout';

export default function AlunoLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedLayout allowedRoles={['aluno']}>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="mt-6 px-5 md:px-10 pb-5">{children}</main>
      </div>
    </ProtectedLayout>
  );
}
